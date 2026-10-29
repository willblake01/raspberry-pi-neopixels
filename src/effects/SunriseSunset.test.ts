import { SunriseSunset, type SunriseSunsetDeps } from './SunriseSunset.js';
import { SUN_COLORS, TWILIGHT_MS, NIGHT_FADE_MS } from '../weather/daylight.js';
import { KNOWN_NEW_MOON, SYNODIC_MONTH_DAYS, MOON_COLOR } from '../astronomy/moon.js';
import { mixColors, packRGB } from './utils/color.js';
import { renderedFrames, setupEffectTest } from '../test-utils/effectHelpers.js';

jest.mock('../ledRuntime.js', () => ({ safeRender: jest.fn() }));
jest.mock('../utils/index.js', () => ({ randomNumber: jest.fn() }));

setupEffectTest();

const H = 3_600_000;
const SUNRISE = Date.UTC(2026, 9, 29, 12, 0);
const DAYS = [{ sunrise: SUNRISE, sunset: SUNRISE + 11 * H }];
const LOCATION = { latitude: 1, longitude: 2, name: 'Testville' };
const TICK = 60_000;

// A known full moon, with the surrounding night, for the moon tests
const FULL_MOON = KNOWN_NEW_MOON + (SYNODIC_MONTH_DAYS * 86_400_000) / 2;
const MOON_DAYS = [{ sunrise: FULL_MOON + 6 * H, sunset: FULL_MOON + 17 * H }];

const makeDeps = (clock: { now: number }): SunriseSunsetDeps & { fetchSunTimes: jest.Mock } => ({
    locate: jest.fn().mockResolvedValue(LOCATION),
    fetchSunTimes: jest.fn().mockResolvedValue(DAYS),
    now: () => clock.now,
    log: () => {},
});

const moonDeps = (
    clock: { now: number },
    days = MOON_DAYS,
): SunriseSunsetDeps & { fetchSunTimes: jest.Mock } => ({
    ...makeDeps(clock),
    fetchSunTimes: jest.fn().mockResolvedValue(days),
    showMoon: true,
});

const solid = (leds: number, rgb: readonly [number, number, number]) =>
    Array(leds).fill(packRGB(...rgb));

describe('SunriseSunset', () => {
    test('renders the daylight color once sun times load', async () => {
        const clock = { now: SUNRISE + 5.5 * H }; // midday
        const effect = new SunriseSunset(3, makeDeps(clock), 6 * H, TICK);

        effect.run();
        await jest.advanceTimersByTimeAsync(0);

        expect(renderedFrames()).toEqual([solid(3, SUN_COLORS.DAY)]);
        effect.stop();
    });

    test('updates the color as time passes', async () => {
        const clock = { now: SUNRISE + 5.5 * H };
        const effect = new SunriseSunset(3, makeDeps(clock), 6 * H, TICK);

        effect.run();
        await jest.advanceTimersByTimeAsync(0);

        clock.now = SUNRISE + 11 * H + 2 * H; // well after sunset
        await jest.advanceTimersByTimeAsync(TICK);

        const frames = renderedFrames();
        expect(frames[frames.length - 1]).toEqual(solid(3, SUN_COLORS.NIGHT));
        effect.stop();
    });

    test('does not re-render when the color is unchanged', async () => {
        const clock = { now: SUNRISE + 5.5 * H };
        const effect = new SunriseSunset(3, makeDeps(clock), 6 * H, TICK);

        effect.run();
        await jest.advanceTimersByTimeAsync(TICK * 3); // still midday plateau

        expect(renderedFrames()).toHaveLength(1);
        effect.stop();
    });

    test('a quick restart redraws without re-fetching', async () => {
        const clock = { now: SUNRISE + 5.5 * H };
        const deps = makeDeps(clock);
        const effect = new SunriseSunset(3, deps, 6 * H, TICK);

        effect.run();
        await jest.advanceTimersByTimeAsync(0);
        effect.stop();
        effect.run();
        await jest.advanceTimersByTimeAsync(0);

        expect(deps.fetchSunTimes).toHaveBeenCalledTimes(1);
        expect(renderedFrames()).toHaveLength(2);
        effect.stop();
    });
});

describe('SunriseSunset with moon phase', () => {
    test('shows the moon in the middle of the night', async () => {
        const clock = { now: FULL_MOON }; // 6 hours before sunrise
        const effect = new SunriseSunset(3, moonDeps(clock), 6 * H, TICK);

        effect.run();
        await jest.advanceTimersByTimeAsync(0);

        expect(renderedFrames()).toEqual([solid(3, MOON_COLOR)]); // full moon lights every pixel
        effect.stop();
    });

    test('daytime is unchanged when the moon is enabled', async () => {
        const clock = { now: FULL_MOON + 11.5 * H }; // midday
        const effect = new SunriseSunset(3, moonDeps(clock), 6 * H, TICK);

        effect.run();
        await jest.advanceTimersByTimeAsync(0);

        expect(renderedFrames()).toEqual([solid(3, SUN_COLORS.DAY)]);
        effect.stop();
    });

    test('the moon fades in after dusk', async () => {
        // Halfway through the fade-in after twilight ends
        const sunset = FULL_MOON - TWILIGHT_MS - NIGHT_FADE_MS / 2;
        const days = [{ sunrise: sunset - 11 * H, sunset }];
        const clock = { now: FULL_MOON };
        const effect = new SunriseSunset(3, moonDeps(clock, days), 6 * H, TICK);

        effect.run();
        await jest.advanceTimersByTimeAsync(0);

        const halfway = mixColors(packRGB(...SUN_COLORS.NIGHT), packRGB(...MOON_COLOR), 0.5);
        expect(renderedFrames()).toEqual([Array(3).fill(halfway)]);
        effect.stop();
    });

    test('without the moon option, night is the plain night color', async () => {
        const clock = { now: FULL_MOON };
        const deps = { ...moonDeps(clock), showMoon: false };
        const effect = new SunriseSunset(3, deps, 6 * H, TICK);

        effect.run();
        await jest.advanceTimersByTimeAsync(0);

        expect(renderedFrames()).toEqual([solid(3, SUN_COLORS.NIGHT)]);
        effect.stop();
    });

    test('logs the moon phase when enabled', async () => {
        const clock = { now: FULL_MOON };
        const log = jest.fn();
        const effect = new SunriseSunset(3, { ...moonDeps(clock), log }, 6 * H, TICK);

        effect.run();
        await jest.advanceTimersByTimeAsync(0);

        expect(log).toHaveBeenCalledWith(expect.stringContaining('Full Moon'));
        effect.stop();
    });

    test('does not log the moon phase when disabled', async () => {
        const clock = { now: FULL_MOON };
        const log = jest.fn();
        const effect = new SunriseSunset(3, { ...makeDeps(clock), log }, 6 * H, TICK);

        effect.run();
        await jest.advanceTimersByTimeAsync(0);

        expect(log).not.toHaveBeenCalledWith(expect.stringContaining('🌙'));
        effect.stop();
    });
});