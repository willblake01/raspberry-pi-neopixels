import { PolledLocationEffect, type PolledLocationEffectConfig } from './utils/index.js';
import { spaceWeatherConfig } from './SpaceWeather.js';
import { KP_STYLES } from '../weather/spaceWeather.js';
import { packRGB } from './utils/color.js';
import { renderedFrames, setupEffectTest } from '../test-utils/effectHelpers.js';

jest.mock('../ledRuntime.js', () => ({ safeRender: jest.fn() }));
jest.mock('../utils/index.js', () => ({ randomNumber: jest.fn() }));

setupEffectTest();

const makeEffect = (kp: number, clock = { now: 0 }, log = jest.fn()) =>
    new PolledLocationEffect(
        spaceWeatherConfig(3, {
            fetchKp: jest.fn().mockResolvedValue({ kp, time: '' }),
            now: () => clock.now,
            log,
        }),
    );

test('quiet conditions show a steady color', async () => {
    const effect = makeEffect(2);

    effect.run();
    await jest.advanceTimersByTimeAsync(1000);

    expect(renderedFrames()).toEqual([Array(3).fill(packRGB(...KP_STYLES.quiet.rgb))]);
    effect.stop();
});

test('storms pulse over time', async () => {
    const clock = { now: 0 };
    const effect = makeEffect(5, clock);

    effect.run();
    await jest.advanceTimersByTimeAsync(0);
    clock.now = KP_STYLES.storm.pulseMs! / 2; // peak of the pulse
    await jest.advanceTimersByTimeAsync(50);

    const frames = renderedFrames();
    expect(frames.length).toBeGreaterThan(1);
    expect(frames[frames.length - 1]).toEqual(Array(3).fill(packRGB(...KP_STYLES.storm.rgb)));
    effect.stop();
});

test('logs the level and G-scale', async () => {
    const log = jest.fn();
    const effect = makeEffect(6, { now: 0 }, log);

    effect.run();
    await jest.advanceTimersByTimeAsync(0);

    expect(log).toHaveBeenCalledWith('🌌 Space weather: geomagnetic storm (Kp 6, G2)');
    effect.stop();
});