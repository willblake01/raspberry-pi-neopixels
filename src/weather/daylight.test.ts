import {
    daylightRGB,
    nightDepth,
    NIGHT_FADE_MS,
    SUN_COLORS,
    TWILIGHT_MS,
} from './daylight.js';
import { mixRGB } from './colors.js';

const M = 60_000;
const H = 60 * M;
const SUNRISE = Date.UTC(2026, 9, 29, 12, 0);
const SUNSET = SUNRISE + 11 * H;
const day = { sunrise: SUNRISE, sunset: SUNSET };

describe('daylightRGB', () => {
    test('night before dawn', () => {
        expect(daylightRGB(SUNRISE - 2 * H, [day])).toEqual(SUN_COLORS.NIGHT);
    });

    test('deep orange just before sunrise', () => {
        expect(daylightRGB(SUNRISE - 15 * M, [day])).toEqual(SUN_COLORS.DAWN);
    });

    test('blends between keyframes at sunrise', () => {
        expect(daylightRGB(SUNRISE, [day])).toEqual(mixRGB(SUN_COLORS.DAWN, SUN_COLORS.GOLD, 0.5));
    });

    test('full daylight at midday', () => {
        expect(daylightRGB(SUNRISE + 5.5 * H, [day])).toEqual(SUN_COLORS.DAY);
    });

    test('golden just before sunset', () => {
        expect(daylightRGB(SUNSET - 15 * M, [day])).toEqual(SUN_COLORS.GOLD);
    });

    test('night after dusk and between days', () => {
        const tomorrow = { sunrise: SUNRISE + 24 * H, sunset: SUNSET + 24 * H };
        expect(daylightRGB(SUNSET + 2 * H, [day, tomorrow])).toEqual(SUN_COLORS.NIGHT);
    });

    test('short winter days still reach daylight at midday', () => {
        const short = { sunrise: SUNRISE, sunset: SUNRISE + 3 * H };
        expect(daylightRGB(SUNRISE + 1.5 * H, [short])).toEqual(SUN_COLORS.DAY);
    });

    test('no data means night', () => {
        expect(daylightRGB(SUNRISE, [])).toEqual(SUN_COLORS.NIGHT);
    });
});

describe('nightDepth', () => {
    test('zero during the day', () => {
        expect(nightDepth(SUNRISE + 5 * H, [day])).toBe(0);
    });

    test('zero during twilight', () => {
        expect(nightDepth(SUNSET + 30 * M, [day])).toBe(0);
        expect(nightDepth(SUNRISE - 30 * M, [day])).toBe(0);
    });

    test('zero at the exact end of twilight', () => {
        expect(nightDepth(SUNSET + TWILIGHT_MS, [day])).toBe(0);
    });

    test('fades in after dusk', () => {
        expect(nightDepth(SUNSET + TWILIGHT_MS + NIGHT_FADE_MS / 2, [day])).toBeCloseTo(0.5);
    });

    test('full depth in the middle of the night', () => {
        expect(nightDepth(SUNSET + 4 * H, [day])).toBe(1);
    });

    test('fades out before dawn', () => {
        expect(nightDepth(SUNRISE - TWILIGHT_MS - NIGHT_FADE_MS / 2, [day])).toBeCloseTo(0.5);
    });

    test('full depth between two days', () => {
        const tomorrow = { sunrise: SUNRISE + 24 * H, sunset: SUNSET + 24 * H };
        expect(nightDepth(SUNSET + 6 * H, [day, tomorrow])).toBe(1);
    });

    test('no data means full night', () => {
        expect(nightDepth(SUNRISE, [])).toBe(1);
    });
});