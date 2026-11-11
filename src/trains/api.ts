// Reads the rider's next-train status from Train Time with a device token.
// Link a device in Train Time (My Trips → Linked devices) to get a token.

export const DEFAULT_TRAIN_TIME_URL = 'https://train-time-rosy.vercel.app';

const TIMEOUT_MS = 10_000;

export type TripPhase = 'none' | 'upcoming' | 'onBoard';
export type ConnectionRisk = 'ok' | 'tight' | 'missed';

export interface TripStop {
    code: string;
    name: string;
    tz: string;
}

export interface TripLeg {
    tripName: string;
    trainNum: string;
    routeName: string;
    from: TripStop;
    to: TripStop;
    estimatedDeparture: string; // ISO
    estimatedArrival: string;   // ISO
    delayMinutes: number;
    live: boolean;
}

export interface TripConnection {
    station: string;
    nextTrainNum: string;
    minutes: number;
    risk: ConnectionRisk;
}

export interface TripStatus {
    phase: TripPhase;
    leg?: TripLeg;
    connection?: TripConnection;
}

export interface TrainTimeSource {
    baseUrl: string;
    token: string;
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const isString = (v: unknown): v is string => typeof v === 'string';
const isTime = (v: unknown): v is string => isString(v) && !Number.isNaN(Date.parse(v));

const parseStop = (v: unknown): TripStop | null =>
    isObject(v) && isString(v.code) && isString(v.name) && isString(v.tz)
        ? { code: v.code, name: v.name, tz: v.tz }
        : null;

/** Validates the response so an unexpected shape fails loudly instead of lighting the wrong thing. */
export function parseTripStatus(json: unknown): TripStatus {
    if (!isObject(json)) throw new Error('Unexpected Train Time response');

    const phase = json.phase;
    if (phase !== 'none' && phase !== 'upcoming' && phase !== 'onBoard') {
        throw new Error('Unexpected Train Time response: unknown phase');
    }
    if (phase === 'none') return { phase };

    const leg = json.leg;
    const from = isObject(leg) ? parseStop(leg.from) : null;
    const to = isObject(leg) ? parseStop(leg.to) : null;
    if (!isObject(leg) || !from || !to || !isTime(leg.estimatedDeparture) || !isTime(leg.estimatedArrival)) {
        throw new Error('Unexpected Train Time response: missing leg');
    }

    const status: TripStatus = {
        phase,
        leg: {
            tripName: isString(leg.tripName) ? leg.tripName : '',
            trainNum: String(leg.trainNum ?? ''),
            routeName: isString(leg.routeName) ? leg.routeName : '',
            from,
            to,
            estimatedDeparture: leg.estimatedDeparture,
            estimatedArrival: leg.estimatedArrival,
            delayMinutes: typeof leg.delayMinutes === 'number' ? leg.delayMinutes : 0,
            live: leg.live === true,
        },
    };

    const c = json.connection;
    if (isObject(c) && typeof c.minutes === 'number' && (c.risk === 'ok' || c.risk === 'tight' || c.risk === 'missed')) {
        status.connection = {
            station: isString(c.station) ? c.station : '',
            nextTrainNum: String(c.nextTrainNum ?? ''),
            minutes: c.minutes,
            risk: c.risk,
        };
    }

    return status;
}

export async function fetchTripStatus({ baseUrl, token }: TrainTimeSource): Promise<TripStatus> {
    const res = await fetch(new URL('/api/device/status', baseUrl), {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.status === 401) throw new Error('device token was rejected; link this device again in Train Time');
    if (res.status === 429) throw new Error('asked too often; will retry');
    if (!res.ok) throw new Error(`HTTP ${res.status} from Train Time`);

    return parseTripStatus(await res.json());
}
