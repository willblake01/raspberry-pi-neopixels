import { daylightRGB, SUN_COLORS } from './daylight.js';
import { mixRGB } from './colors.js';

const M = 60_000;
const H = 60 * M;
const SUNRISE = Date.UTC(2026, 9, 29, 12, 0);
const SUNSET = SUNRISE + 11 * H;
const day = { sunrise: SUNRISE, sunset: SUNSET };

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