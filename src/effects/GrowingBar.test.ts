import {
  GrowingBarCustom,
  GrowingBarRandomChangeLoop,
  GrowingBarRandomChangePixel,
  GrowingBarRandomStatic,
} from './index.js';
import { buildGrowingBar } from './GrowingBar.js';
import { OffsetAnimation } from './utils/OffsetAnimation.js';
import type { ColorSource } from './utils/colorSources.js';
import {
  colorFromRGB,
  queueColors,
  renderedFrames,
  runFrames,
  safeRenderMock,
  setupEffectTest,
} from '../test-utils/effectHelpers.js';

jest.mock('../ledRuntime.js', () => ({ safeRender: jest.fn() }));
jest.mock('../utils/index.js', () => ({ randomNumber: jest.fn() }));

import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';

setupEffectTest();

/** Expected frame: the first `litCount` pixels lit, the rest dark. */
const barFrame = (leds: number, litCount: number, color: number) =>
    Array.from({ length: leds }, (_, i) => (i < litCount ? color : 0));

// < - - - - - - Pure frame builder - - - - - - >

describe('buildGrowingBar', () => {
  test('lights pixels 0 through offset inclusive', () => {
    expect(Array.from(buildGrowingBar(4, 0, 7))).toEqual([7, 0, 0, 0]);
    expect(Array.from(buildGrowingBar(4, 2, 7))).toEqual([7, 7, 7, 0]);
  });

  test('fills the whole strip at the last offset', () => {
    expect(Array.from(buildGrowingBar(4, 3, 7))).toEqual([7, 7, 7, 7]);
  });

  test('clamps an offset past the end', () => {
    expect(Array.from(buildGrowingBar(3, 10, 7))).toEqual([7, 7, 7]);
  });

  test('lights nothing for a negative offset', () => {
    expect(Array.from(buildGrowingBar(3, -1, 7))).toEqual([0, 0, 0]);
  });

  test('returns an empty array for zero LEDs', () => {
    expect(buildGrowingBar(0, 0, 7)).toHaveLength(0);
  });
});

// < - - - - - - Shared stepping animation - - - - - - >

describe('OffsetAnimation', () => {
  const spyColors = (): ColorSource & { advance: jest.Mock } => ({
    current: () => 1,
    advance: jest.fn(),
  });

  test('passes offsets 0..leds-1 to the frame builder, then wraps', () => {
    const buildFrame = jest.fn(
        (leds: number, _offset: number, _color: number) => new Uint32Array(leds),
    );
    const effect = new OffsetAnimation(3, 100, buildFrame, spyColors());

    runFrames(effect, 100, 4);

    expect(buildFrame.mock.calls.map(([, offset]) => offset)).toEqual([0, 1, 2, 0]);
  });

  test('tells the color source when the walk wraps', () => {
    const colors = spyColors();
    const effect = new OffsetAnimation(3, 100, () => new Uint32Array(3), colors);

    runFrames(effect, 100, 4);

    // After offsets 0, 1, 2, 0 → next offsets 1, 2, 0 (wrapped), 1
    expect(colors.advance.mock.calls.map(([wrapped]) => wrapped)).toEqual([
      false, false, true, false,
    ]);
  });

  test('renders whatever the frame builder returns', () => {
    const frame = new Uint32Array([9, 8, 7]);
    const effect = new OffsetAnimation(3, 100, () => frame, spyColors());

    effect.run();
    effect.stop();

    expect(safeRender).toHaveBeenCalledWith(frame);
  });
});

// < - - - - - - GrowingBar effects - - - - - - >

describe('GrowingBar effects', () => {
  test('GrowingBarCustom progressively fills pixels and wraps to the start', () => {
    const color = colorFromRGB(5, 10, 15);
    const effect = new GrowingBarCustom(4, 100, 5, 10, 15);

    expect(runFrames(effect, 100, 5)).toEqual([
      barFrame(4, 1, color),
      barFrame(4, 2, color),
      barFrame(4, 3, color),
      barFrame(4, 4, color),
      barFrame(4, 1, color),
    ]);
  });

  test('GrowingBarRandomStatic keeps the same random color for the whole run', () => {
    queueColors([9, 19, 29]);
    const color = colorFromRGB(9, 19, 29);
    const effect = new GrowingBarRandomStatic(3, 120);

    expect(runFrames(effect, 120, 4)).toEqual([
      barFrame(3, 1, color),
      barFrame(3, 2, color),
      barFrame(3, 3, color),
      barFrame(3, 1, color),
    ]);
    expect(randomNumber).toHaveBeenCalledTimes(3);
  });

  test('GrowingBarRandomChangePixel recolors the bar after every step', () => {
    queueColors([1, 2, 3], [4, 5, 6], [7, 8, 9]);
    const effect = new GrowingBarRandomChangePixel(4, 90);

    expect(runFrames(effect, 90, 3)).toEqual([
      barFrame(4, 1, colorFromRGB(1, 2, 3)),
      barFrame(4, 2, colorFromRGB(4, 5, 6)),
      barFrame(4, 3, colorFromRGB(7, 8, 9)),
    ]);
  });

  test('GrowingBarRandomChangeLoop only changes color when the bar wraps', () => {
    queueColors([7, 8, 9], [10, 11, 12]);
    const first = colorFromRGB(7, 8, 9);
    const second = colorFromRGB(10, 11, 12);
    const effect = new GrowingBarRandomChangeLoop(3, 110);

    expect(runFrames(effect, 110, 4)).toEqual([
      barFrame(3, 1, first),
      barFrame(3, 2, first),
      barFrame(3, 3, first),
      barFrame(3, 1, second),
    ]);
  });
});

// < - - - - - - Lifecycle - - - - - - >

describe('GrowingBar lifecycle', () => {
  test('stop halts rendering', () => {
    const effect = new GrowingBarCustom(3, 100, 1, 2, 3);

    effect.run();
    effect.stop();
    jest.advanceTimersByTime(500);

    expect(safeRender).toHaveBeenCalledTimes(1);
  });

  test('calling run twice does not stack intervals', () => {
    const effect = new GrowingBarCustom(3, 100, 1, 2, 3);

    effect.run();
    effect.run();
    safeRenderMock.mockClear();

    jest.advanceTimersByTime(100);

    expect(safeRender).toHaveBeenCalledTimes(1);
    effect.stop();
  });

  test('run resumes from the current offset after stop', () => {
    const color = colorFromRGB(1, 2, 3);
    const effect = new GrowingBarCustom(3, 100, 1, 2, 3);

    effect.run();                   // 1 lit
    jest.advanceTimersByTime(100);  // 2 lit
    effect.stop();
    safeRenderMock.mockClear();

    effect.run();                   // resumes: 3 lit

    expect(renderedFrames()).toEqual([barFrame(3, 3, color)]);
    effect.stop();
  });

  test('zero LEDs renders empty frames without breaking', () => {
    const effect = new GrowingBarCustom(0, 100, 1, 2, 3);

    expect(runFrames(effect, 100, 3)).toEqual([[], [], []]);
  });

  test('constructors do not call safeRender', () => {
    new GrowingBarCustom(3, 100, 1, 2, 3);
    new GrowingBarRandomStatic(3, 100);
    new GrowingBarRandomChangePixel(3, 100);
    new GrowingBarRandomChangeLoop(3, 100);

    expect(safeRender).not.toHaveBeenCalled();
  });
});