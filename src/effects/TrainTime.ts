import { PolledLocationEffect, type PolledLocationEffectConfig } from './utils/index.js';
import type { Location } from '../weather/api.js';
import { DEFAULT_TRAIN_TIME_URL, fetchTripStatus, type TripStatus } from '../trains/api.js';
import { buildTripFrame, describeTrip } from '../trains/tripStatus.js';

/** Train Time limits each device to one request every 10 seconds */
export const TRAIN_REFRESH_MS = 30_000;
const TRAIN_MIN_REFETCH_GAP_MS = 15_000;
/** Fast enough for smooth pulses; frames are only sent when they change */
const TRAIN_TICK_MS = 100;
export const DEFAULT_TRAVEL_MINUTES = 20;

/** Trip status isn't tied to a weather location; the base class just needs one. */
const TRAIN_TIME: Location = { latitude: 0, longitude: 0, name: 'Train Time' };

export interface TrainTimeDeps {
    fetchStatus: () => Promise<TripStatus>;
    /** Minutes the rider needs to get to the station */
    travelMinutes: number;
    now?: () => number;
    log?: (message: string) => void;
}

export const trainTimeConfig = (leds: number, deps: TrainTimeDeps): PolledLocationEffectConfig<TripStatus> => ({
    name: 'Train Time',
    locate: async () => TRAIN_TIME,
    fetch: () => deps.fetchStatus(),
    buildFrame: (status, now) => buildTripFrame(leds, status, now, deps.travelMinutes),
    describe: (status) => describeTrip(status),
    refreshMs: TRAIN_REFRESH_MS,
    tickMs: TRAIN_TICK_MS,
    minRefetchGapMs: TRAIN_MIN_REFETCH_GAP_MS,
    now: deps.now,
    log: deps.log,
});

/**
 * Shows the next train from Train Time. The token comes from the prompt or the
 * TRAIN_TIME_TOKEN environment variable; TRAIN_TIME_URL overrides the server.
 */
export const createTrainTime = (leds: number, token: string | undefined, travelMinutes = DEFAULT_TRAVEL_MINUTES) => {
    const deviceToken = token?.trim() || process.env.TRAIN_TIME_TOKEN?.trim();
    if (!deviceToken) {
        throw new Error('Train Time needs a device token: set TRAIN_TIME_TOKEN or enter it when prompted');
    }
    const baseUrl = process.env.TRAIN_TIME_URL?.trim() || DEFAULT_TRAIN_TIME_URL;

    return new PolledLocationEffect(
        trainTimeConfig(leds, {
            fetchStatus: () => fetchTripStatus({ baseUrl, token: deviceToken }),
            travelMinutes,
        }),
    );
};
