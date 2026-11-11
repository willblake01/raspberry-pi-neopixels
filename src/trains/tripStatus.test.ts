import {
    COUNTDOWN_WINDOW_MIN,
    FAR_LEVEL,
    RISK_BLOCK,
    RISK_SWAP_MS,
    TRACK_LEVEL,
    TRAIN_COLORS,
    buildBar,
    buildTripFrame,
    describeTrip,
    minutesToLeave,
} from './tripStatus.js';
import { mixColors, packRGB, scaleColor } from '../effects/utils/color.js';
import type { TripStatus } from './api.js';

const MIN = 60_000;
const DEPART = Date.UTC(2026, 10, 8, 1, 22); // 7:22 PM Central
const ARRIVE = DEPART + 3 * 60 * MIN;
const TRAVEL = 20;
const CT = 'America/Chicago';

const status = (overrides: Partial<TripStatus> = {}): TripStatus => ({
    phase: 'upcoming',
    leg: {
        tripName: 'New Orleans for Thanksgiving',
        trainNum: '21',
        routeName: 'Texas Eagle',
        from: { code: 'AUS', name: 'Austin', tz: CT },
        to: { code: 'SAS', name: 'San Antonio', tz: CT },
        estimatedDeparture: new Date(DEPART).toISOString(),
        estimatedArrival: new Date(ARRIVE).toISOString(),
        delayMinutes: 0,
        live: false,
    },
    ...overrides,
});

const c = (rgb: readonly [number, number, number]) => packRGB(...rgb);
const solid = (leds: number, color: number) => Array(leds).fill(color);
const frame = (s: TripStatus, now: number, leds = 4) => Array.from(buildTripFrame(leds, s, now, TRAVEL));

/** `now` such that the rider must leave in `minutes` */
const leaveIn = (minutes: number) => DEPART - (TRAVEL + minutes) * MIN;

describe('buildBar', () => {
    const lit = c(TRAIN_COLORS.countdown);
    const track = scaleColor(lit, TRACK_LEVEL);

    test('fills from the start of the strip with a dim track behind', () => {
        expect(Array.from(buildBar(4, 0.5, TRAIN_COLORS.countdown))).toEqual([lit, lit, track, track]);
    });

    test('the edge pixel blends between track and lit', () => {
        expect(Array.from(buildBar(4, 0.625, TRAIN_COLORS.countdown))).toEqual([lit, lit, mixColors(track, lit, 0.5), track]);
    });

    test('clamps to empty and full', () => {
        expect(Array.from(buildBar(2, -1, TRAIN_COLORS.countdown))).toEqual([track, track]);
        expect(Array.from(buildBar(2, 2, TRAIN_COLORS.countdown))).toEqual([lit, lit]);
    });
});

describe('minutesToLeave', () => {
    test('is departure minus travel time', () => {
        expect(minutesToLeave(status(), leaveIn(15), TRAVEL)).toBeCloseTo(15);
    });

    test('is infinite with no trip', () => {
        expect(minutesToLeave({ phase: 'none' }, 0, TRAVEL)).toBe(Infinity);
    });
});

describe('buildTripFrame', () => {
    test('no trip is a dim steady glow', () => {
        expect(frame({ phase: 'none' }, 0)).toEqual(solid(4, c(TRAIN_COLORS.idle)));
    });

    test('far from leaving, the whole bar glows softly', () => {
        expect(frame(status(), leaveIn(COUNTDOWN_WINDOW_MIN + 30))).toEqual(
            solid(4, scaleColor(c(TRAIN_COLORS.countdown), FAR_LEVEL)),
        );
    });

    test('within the window, the green bar drains', () => {
        expect(frame(status(), leaveIn(30))).toEqual(Array.from(buildBar(4, 0.5, TRAIN_COLORS.countdown)));
    });

    test('turns amber in the last 10 minutes', () => {
        expect(frame(status(), leaveIn(6))).toEqual(Array.from(buildBar(4, 0.1, TRAIN_COLORS.soon)));
    });

    test('pulses red when it is time to leave', () => {
        const now = leaveIn(-1);
        const pixels = frame(status(), now);
        expect(new Set(pixels).size).toBe(1);
        expect((pixels[0] >> 16) & 0xff).toBeGreaterThan(0);
        expect(pixels[0] & 0xffff).toBe(0); // red only
    });

    test('a delay pushes back the time to leave', () => {
        const delayed = status();
        delayed.leg!.estimatedDeparture = new Date(DEPART + 25 * MIN).toISOString();
        expect(frame(delayed, leaveIn(-1))).toEqual(Array.from(buildBar(4, 24 / COUNTDOWN_WINDOW_MIN, TRAIN_COLORS.countdown)));
    });

    test('on board, a teal bar fills with the ride', () => {
        const halfway = DEPART + 90 * MIN;
        expect(frame(status({ phase: 'onBoard' }), halfway)).toEqual(Array.from(buildBar(4, 0.5, TRAIN_COLORS.onBoard)));
    });

    describe('connection risk', () => {
        const tight = status({ phase: 'onBoard', connection: { station: 'San Antonio', nextTrainNum: '2', minutes: 12, risk: 'tight' } });
        const missed = status({ phase: 'onBoard', connection: { station: 'San Antonio', nextTrainNum: '2', minutes: -20, risk: 'missed' } });
        const red = c(TRAIN_COLORS.risk);
        const amber = c(TRAIN_COLORS.riskAlt);

        test('tight connections alternate red and amber blocks', () => {
            const leds = RISK_BLOCK * 2;
            const now = DEPART + 10 * MIN;
            const blocks = [...solid(RISK_BLOCK, red), ...solid(RISK_BLOCK, amber)];
            const swapped = [...solid(RISK_BLOCK, amber), ...solid(RISK_BLOCK, red)];
            const at = (t: number) => Array.from(buildTripFrame(leds, tight, t, TRAVEL));

            const first = at(now);
            const second = at(now + RISK_SWAP_MS);
            expect([first, second]).toEqual(expect.arrayContaining([blocks, swapped]));
            expect(first).not.toEqual(second);
        });

        test('missed connections pulse red', () => {
            const pixels = frame(missed, DEPART + 10 * MIN);
            expect(new Set(pixels).size).toBe(1);
            expect(pixels[0] & 0xffff).toBe(0);
        });

        test('time to leave beats a connection warning', () => {
            const upcomingTight = { ...tight, phase: 'upcoming' as const };
            const pixels = frame(upcomingTight, leaveIn(-1));
            expect(new Set(pixels).size).toBe(1);
        });

        test('warnings wait until the countdown starts', () => {
            const upcomingTight = { ...tight, phase: 'upcoming' as const };
            expect(frame(upcomingTight, leaveIn(COUNTDOWN_WINDOW_MIN + 30))).toEqual(
                solid(4, scaleColor(c(TRAIN_COLORS.countdown), FAR_LEVEL)),
            );
        });

        test('an ok connection shows the normal bar', () => {
            const ok = status({ phase: 'onBoard', connection: { station: 'San Antonio', nextTrainNum: '2', minutes: 60, risk: 'ok' } });
            expect(frame(ok, DEPART + 90 * MIN)).toEqual(Array.from(buildBar(4, 0.5, TRAIN_COLORS.onBoard)));
        });
    });
});

describe('describeTrip', () => {
    test('no trip', () => {
        expect(describeTrip({ phase: 'none' })).toBe('🚆 Train Time: no upcoming trains');
    });

    test('upcoming, with the departure in the station time zone', () => {
        expect(describeTrip(status())).toBe('🚆 #21 Austin → San Antonio: departs 7:22 PM');
    });

    test('on board and late, with a tight connection', () => {
        const s = status({ phase: 'onBoard', connection: { station: 'San Antonio', nextTrainNum: '2', minutes: 12, risk: 'tight' } });
        s.leg!.delayMinutes = 25;
        expect(describeTrip(s)).toBe(
            '🚆 #21 Austin → San Antonio: on board, arriving 10:22 PM (25 min late)\n⚠️ Tight connection to #2 in San Antonio: 12 min',
        );
    });

    test('missed connection', () => {
        const s = status({ connection: { station: 'San Antonio', nextTrainNum: '2', minutes: -5, risk: 'missed' } });
        expect(describeTrip(s)).toContain('🚨 Connection to #2 in San Antonio will be missed');
    });
});
