import { PolledLocationEffect } from './utils/index.js';
import { createTrainTime, trainTimeConfig, TRAIN_REFRESH_MS } from './TrainTime.js';
import { TRAIN_COLORS } from '../trains/tripStatus.js';
import { packRGB } from './utils/color.js';
import { renderedFrames, setupEffectTest } from '../test-utils/effectHelpers.js';
import type { TripStatus } from '../trains/api.js';

jest.mock('../ledRuntime.js', () => ({ safeRender: jest.fn() }));
jest.mock('../utils/index.js', () => ({ randomNumber: jest.fn() }));

setupEffectTest();

const makeEffect = (fetchStatus: jest.Mock, log = jest.fn()) =>
    new PolledLocationEffect(trainTimeConfig(3, { fetchStatus, travelMinutes: 20, log }));

test('shows the idle glow when there is no trip', async () => {
    const effect = makeEffect(jest.fn().mockResolvedValue({ phase: 'none' } satisfies TripStatus));

    effect.run();
    await jest.advanceTimersByTimeAsync(0);

    expect(renderedFrames()).toEqual([Array(3).fill(packRGB(...TRAIN_COLORS.idle))]);
    effect.stop();
});

test('polls on an interval and logs only when the status changes', async () => {
    const fetchStatus = jest.fn().mockResolvedValue({ phase: 'none' });
    const log = jest.fn();
    const effect = makeEffect(fetchStatus, log);

    effect.run();
    await jest.advanceTimersByTimeAsync(TRAIN_REFRESH_MS * 2);

    expect(fetchStatus).toHaveBeenCalledTimes(3);
    expect(log).toHaveBeenCalledTimes(1);
    effect.stop();
});

test('keeps the last frame when Train Time is unreachable', async () => {
    const fetchStatus = jest.fn().mockResolvedValueOnce({ phase: 'none' }).mockRejectedValueOnce(new Error('offline'));
    const log = jest.fn();
    const effect = makeEffect(fetchStatus, log);

    effect.run();
    await jest.advanceTimersByTimeAsync(TRAIN_REFRESH_MS);

    expect(renderedFrames()).toHaveLength(1);
    expect(log).toHaveBeenCalledWith('⚠️ Train Time update failed: offline');
    effect.stop();
});

describe('createTrainTime', () => {
    const original = process.env.TRAIN_TIME_TOKEN;
    afterEach(() => {
        if (original === undefined) delete process.env.TRAIN_TIME_TOKEN;
        else process.env.TRAIN_TIME_TOKEN = original;
    });

    test('requires a token from the prompt or the environment', () => {
        delete process.env.TRAIN_TIME_TOKEN;
        expect(() => createTrainTime(3, undefined)).toThrow(/TRAIN_TIME_TOKEN/);
    });

    test('accepts a token from the environment', () => {
        process.env.TRAIN_TIME_TOKEN = 'a'.repeat(43);
        expect(createTrainTime(3, undefined)).toBeInstanceOf(PolledLocationEffect);
    });
});
