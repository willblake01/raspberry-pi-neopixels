import { SunriseSunset, type SunriseSunsetDeps } from './SunriseSunset.js';
import { SUN_COLORS } from '../weather/daylight.js';
import { packRGB } from './utils/color.js';
import { renderedFrames, setupEffectTest } from '../test-utils/effectHelpers.js';

jest.mock('../ledRuntime.js', () => ({ safeRender: jest.fn() }));
jest.mock('../utils/index.js', () => ({ randomNumber: jest.fn() }));

setupEffectTest();

const H = 3_600_000;
const SUNRISE = Date.UTC(2026, 9, 29, 12, 0);
const DAYS = [{ sunrise: SUNRISE, sunset: SUNRISE + 11 * H }];
const LOCATION = { latitude: 1, longitude: 2, name: 'Testville' };
const TICK = 60_000;

const makeDeps = (clock: { now: number }): SunriseSunsetDeps & { fetchSunTimes: jest.Mock } => ({
    locate: jest.fn().mockResolvedValue(LOCATION),
    fetchSunTimes: jest.fn().mockResolvedValue(DAYS),
    now: () => clock.now,
    log: () => {},
});

const solid = (leds: number, rgb: readonly [number, number, number]) =>
    Array(leds).fill(packRGB(...rgb));

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