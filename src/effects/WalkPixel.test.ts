import {
  WalkPixelOffCustomStatic,
  WalkPixelOffRandomChangeLoop,
  WalkPixelOffRandomChangePixel,
  WalkPixelOffRandomStatic,
  WalkPixelOnCustom,
  WalkPixelOnRandomChangeLoop,
  WalkPixelOnRandomChangePixel,
  WalkPixelOnRandomStatic,
} from './index.js';
import { buildWalkPixel } from './WalkPixel.js';
import {
  fixedColor,
  randomStaticColor,
  randomEveryPixelColor,
  randomEveryLoopColor,
} from './utils/colorSources.js';
import type { Effect } from '../types/index.js';

jest.mock('../ledRuntime.js', () => ({
  safeRender: jest.fn(),
}));

jest.mock('../utils/index.js', () => ({
  randomNumber: jest.fn(),
}));

import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';

const safeRenderMock = safeRender as jest.MockedFunction<typeof safeRender>;
const randomNumberMock = randomNumber as jest.MockedFunction<typeof randomNumber>;

// < - - - - - - Helpers - - - - - - >

const colorFromRGB = (red: number, green: number, blue: number) =>
    (red << 16) | (green << 8) | blue;

/** Queue RGB triples for randomNumber, in R, G, B order. */
const queueColors = (...triples: [number, number, number][]) => {
  for (const [r, g, b] of triples) {
    randomNumberMock.mockReturnValueOnce(r).mockReturnValueOnce(g).mockReturnValueOnce(b);
  }
};

/** Expected frame: one lit pixel on a dark strip. */
const onFrame = (leds: number, index: number, color: number) =>
    Array.from({ length: leds }, (_, i) => (i === index ? color : 0));

/** Expected frame: one dark pixel on a lit strip. */
const offFrame = (leds: number, index: number, color: number) =>
    Array.from({ length: leds }, (_, i) => (i === index ? 0 : color));

const renderedFrames = () =>
    safeRenderMock.mock.calls.map(([pixels]) => Array.from(pixels as Uint32Array));

/** Run an effect for `count` frames, stop it, and return every rendered frame. */
const runFrames = (effect: Effect, interval: number, count: number) => {
  effect.run();
  jest.advanceTimersByTime(interval * (count - 1));
  effect.stop?.();
  return renderedFrames();
};

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

// < - - - - - - Pure frame builder - - - - - - >

describe('buildWalkPixel', () => {
  test('pixel on: lights only the offset pixel', () => {
    expect(Array.from(buildWalkPixel(4, 2, 7, true))).toEqual([0, 0, 7, 0]);
  });

  test('pixel off: darkens only the offset pixel', () => {
    expect(Array.from(buildWalkPixel(4, 2, 7, false))).toEqual([7, 7, 0, 7]);
  });

  test('ignores an out-of-range offset', () => {
    expect(Array.from(buildWalkPixel(3, 5, 7, true))).toEqual([0, 0, 0]);
    expect(Array.from(buildWalkPixel(3, -1, 7, false))).toEqual([7, 7, 7]);
  });

  test('returns an empty array for zero LEDs', () => {
    expect(buildWalkPixel(0, 0, 7, true)).toHaveLength(0);
  });
});

// < - - - - - - Color sources - - - - - - >

describe('color sources', () => {
  test('fixedColor never changes', () => {
    const source = fixedColor(42);
    source.advance(false);
    source.advance(true);
    expect(source.current()).toBe(42);
  });

  test('randomStaticColor draws once and never changes', () => {
    queueColors([1, 2, 3], [4, 5, 6]);
    const source = randomStaticColor();

    source.advance(false);
    source.advance(true);

    expect(source.current()).toBe(colorFromRGB(1, 2, 3));
    expect(randomNumber).toHaveBeenCalledTimes(3);
  });

  test('randomEveryPixelColor redraws on every advance', () => {
    queueColors([1, 2, 3], [4, 5, 6], [7, 8, 9]);
    const source = randomEveryPixelColor();

    expect(source.current()).toBe(colorFromRGB(1, 2, 3));
    source.advance(false);
    expect(source.current()).toBe(colorFromRGB(4, 5, 6));
    source.advance(true);
    expect(source.current()).toBe(colorFromRGB(7, 8, 9));
  });

  test('randomEveryLoopColor redraws only when the walk wraps', () => {
    queueColors([1, 2, 3], [4, 5, 6]);
    const source = randomEveryLoopColor();

    source.advance(false);
    source.advance(false);
    expect(source.current()).toBe(colorFromRGB(1, 2, 3));

    source.advance(true);
    expect(source.current()).toBe(colorFromRGB(4, 5, 6));
  });
});

// < - - - - - - Pixel on - - - - - - >

describe('WalkPixelOn* effects', () => {
  test('WalkPixelOnCustom moves the lit pixel and wraps to the start', () => {
    const color = colorFromRGB(4, 8, 12);
    const effect = new WalkPixelOnCustom(3, 70, 4, 8, 12);

    expect(runFrames(effect, 70, 4)).toEqual([
      onFrame(3, 0, color),
      onFrame(3, 1, color),
      onFrame(3, 2, color),
      onFrame(3, 0, color),
    ]);
  });

  test('WalkPixelOnRandomStatic uses one random color for the moving pixel', () => {
    queueColors([1, 2, 3]);
    const color = colorFromRGB(1, 2, 3);
    const effect = new WalkPixelOnRandomStatic(4, 60);

    expect(runFrames(effect, 60, 2)).toEqual([
      onFrame(4, 0, color),
      onFrame(4, 1, color),
    ]);
  });

  test('WalkPixelOnRandomChangePixel changes color every time the pixel moves', () => {
    queueColors([5, 6, 7], [8, 9, 10]);
    const effect = new WalkPixelOnRandomChangePixel(4, 80);

    expect(runFrames(effect, 80, 2)).toEqual([
      onFrame(4, 0, colorFromRGB(5, 6, 7)),
      onFrame(4, 1, colorFromRGB(8, 9, 10)),
    ]);
  });

  test('WalkPixelOnRandomChangeLoop keeps a color for a full loop before changing', () => {
    queueColors([11, 12, 13], [14, 15, 16]);
    const first = colorFromRGB(11, 12, 13);
    const second = colorFromRGB(14, 15, 16);
    const effect = new WalkPixelOnRandomChangeLoop(3, 90);

    expect(runFrames(effect, 90, 4)).toEqual([
      onFrame(3, 0, first),
      onFrame(3, 1, first),
      onFrame(3, 2, first),
      onFrame(3, 0, second),
    ]);
  });
});

// < - - - - - - Pixel off - - - - - - >

describe('WalkPixelOff* effects', () => {
  test('WalkPixelOffCustomStatic leaves one dark pixel while the rest stay lit', () => {
    const color = colorFromRGB(20, 30, 40);
    const effect = new WalkPixelOffCustomStatic(3, 50, 20, 30, 40);

    expect(runFrames(effect, 50, 4)).toEqual([
      offFrame(3, 0, color),
      offFrame(3, 1, color),
      offFrame(3, 2, color),
      offFrame(3, 0, color),
    ]);
  });

  test('WalkPixelOffRandomStatic keeps the same random color for the lit pixels', () => {
    queueColors([2, 4, 6]);
    const color = colorFromRGB(2, 4, 6);
    const effect = new WalkPixelOffRandomStatic(3, 55);

    expect(runFrames(effect, 55, 2)).toEqual([
      offFrame(3, 0, color),
      offFrame(3, 1, color),
    ]);
  });

  test('WalkPixelOffRandomChangePixel changes the lit color each time the gap moves', () => {
    queueColors([7, 8, 9], [10, 11, 12]);
    const effect = new WalkPixelOffRandomChangePixel(3, 65);

    expect(runFrames(effect, 65, 2)).toEqual([
      offFrame(3, 0, colorFromRGB(7, 8, 9)),
      offFrame(3, 1, colorFromRGB(10, 11, 12)),
    ]);
  });

  test('WalkPixelOffRandomChangeLoop only changes color after a full pass', () => {
    queueColors([13, 14, 15], [16, 17, 18]);
    const first = colorFromRGB(13, 14, 15);
    const second = colorFromRGB(16, 17, 18);
    const effect = new WalkPixelOffRandomChangeLoop(3, 95);

    expect(runFrames(effect, 95, 4)).toEqual([
      offFrame(3, 0, first),
      offFrame(3, 1, first),
      offFrame(3, 2, first),
      offFrame(3, 0, second),
    ]);
  });
});

// < - - - - - - Lifecycle - - - - - - >

describe('WalkPixel lifecycle', () => {
  test('stop halts rendering', () => {
    const effect = new WalkPixelOnCustom(3, 100, 1, 2, 3);

    effect.run();
    effect.stop();
    jest.advanceTimersByTime(500);

    expect(safeRender).toHaveBeenCalledTimes(1);
  });

  test('calling run twice does not stack intervals', () => {
    const effect = new WalkPixelOnCustom(3, 100, 1, 2, 3);

    effect.run();
    effect.run();
    safeRenderMock.mockClear();

    jest.advanceTimersByTime(100);

    expect(safeRender).toHaveBeenCalledTimes(1);
    effect.stop();
  });

  test('run resumes from the current offset after stop', () => {
    const color = colorFromRGB(1, 2, 3);
    const effect = new WalkPixelOnCustom(3, 100, 1, 2, 3);

    effect.run();                   // renders offset 0
    jest.advanceTimersByTime(100);  // renders offset 1
    effect.stop();
    safeRenderMock.mockClear();

    effect.run();                   // resumes at offset 2

    expect(renderedFrames()).toEqual([onFrame(3, 2, color)]);
    effect.stop();
  });

  test('zero LEDs renders empty frames without breaking', () => {
    const effect = new WalkPixelOnCustom(0, 100, 1, 2, 3);

    const frames = runFrames(effect, 100, 3);

    expect(frames).toEqual([[], [], []]);
  });

  test('constructors do not call safeRender', () => {
    new WalkPixelOnCustom(3, 100, 1, 2, 3);
    new WalkPixelOnRandomStatic(3, 100);
    new WalkPixelOnRandomChangePixel(3, 100);
    new WalkPixelOnRandomChangeLoop(3, 100);
    new WalkPixelOffCustomStatic(3, 100, 1, 2, 3);
    new WalkPixelOffRandomStatic(3, 100);
    new WalkPixelOffRandomChangePixel(3, 100);
    new WalkPixelOffRandomChangeLoop(3, 100);

    expect(safeRender).not.toHaveBeenCalled();
  });
});