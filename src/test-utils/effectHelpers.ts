import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import type { Effect } from '../types/index.js';

// These resolve to the mocked versions as long as the importing
// test file calls jest.mock('../ledRuntime.js') and jest.mock('../utils/index.js').
export const safeRenderMock = safeRender as jest.MockedFunction<typeof safeRender>;
export const randomNumberMock = randomNumber as jest.MockedFunction<typeof randomNumber>;

export const colorFromRGB = (red: number, green: number, blue: number) =>
    (red << 16) | (green << 8) | blue;

/** Queue RGB triples for randomNumber, in R, G, B order. */
export const queueColors = (...triples: [number, number, number][]) => {
    for (const [r, g, b] of triples) {
        randomNumberMock.mockReturnValueOnce(r).mockReturnValueOnce(g).mockReturnValueOnce(b);
    }
};

export const renderedFrames = () =>
    safeRenderMock.mock.calls.map(([pixels]) => Array.from(pixels as Uint32Array));

/** Run an effect for `count` frames, stop it, and return every rendered frame. */
export const runFrames = (effect: Effect, interval: number, count: number) => {
    effect.run();
    jest.advanceTimersByTime(interval * (count - 1));
    effect.stop?.();
    return renderedFrames();
};

/** Standard per-test setup: fake timers, cleared mocks, randomNumber → 0. */
export const setupEffectTest = () => {
    beforeEach(() => {
        jest.useFakeTimers();
        safeRenderMock.mockClear();
        randomNumberMock.mockReset();
        randomNumberMock.mockReturnValue(0);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });
};

/**
 * Standard lifecycle tests for any effect driven by IntervalRunner.
 * Call inside a describe block.
 */
export const itBehavesLikeAnIntervalEffect = (make: () => Effect, interval: number) => {
    test('constructor does not render', () => {
        make();
        expect(safeRenderMock).not.toHaveBeenCalled();
    });

    test('run renders immediately', () => {
        const effect = make();
        effect.run();
        expect(safeRenderMock).toHaveBeenCalledTimes(1);
        effect.stop?.();
    });

    test('stop halts rendering', () => {
        const effect = make();
        effect.run();
        effect.stop?.();
        jest.advanceTimersByTime(interval * 5);
        expect(safeRenderMock).toHaveBeenCalledTimes(1);
    });

    test('calling run twice does not stack intervals', () => {
        const effect = make();
        effect.run();
        effect.run();
        safeRenderMock.mockClear();
        jest.advanceTimersByTime(interval);
        expect(safeRenderMock).toHaveBeenCalledTimes(1);
        effect.stop?.();
    });
};