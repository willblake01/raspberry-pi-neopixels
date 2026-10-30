import { Wheel } from './index.js';
import { buildWheel } from './Wheel.js';
import {
  colorFromRGB,
  itBehavesLikeAnIntervalEffect,
  queueColors,
  randomNumberMock,
  runFrames,
  setupEffectTest,
} from '../test-utils/effectHelpers.js';

jest.mock('../ledRuntime.js', () => ({ safeRender: jest.fn() }));
jest.mock('../utils/index.js', () => ({ randomNumber: jest.fn() }));

setupEffectTest();

/** Expected frame: the first `filled` pixels in `color`, the rest in `previous`. */
const wheelFrame = (leds: number, filled: number, color: number, previous: number) =>
    Array.from({ length: leds }, (_, i) => (i < filled ? color : previous));

describe('buildWheel', () => {
  test('fills up to and including the offset with the new color', () => {
    expect(Array.from(buildWheel(4, 1, 7, 3))).toEqual([7, 7, 3, 3]);
  });

  test('fills the whole strip at the last offset', () => {
    expect(Array.from(buildWheel(4, 3, 7, 3))).toEqual([7, 7, 7, 7]);
  });

  test('returns an empty array for zero LEDs', () => {
    expect(buildWheel(0, 0, 7, 3)).toHaveLength(0);
  });
});

describe('Wheel effect', () => {
  test('the first pass sweeps over a dark strip', () => {
    queueColors([2, 4, 6]);
    const first = colorFromRGB(2, 4, 6);

    expect(runFrames(new Wheel(4, 75), 75, 4)).toEqual([
      wheelFrame(4, 1, first, 0),
      wheelFrame(4, 2, first, 0),
      wheelFrame(4, 3, first, 0),
      wheelFrame(4, 4, first, 0),
    ]);
  });

  test('later passes sweep the new color over the previous one', () => {
    queueColors([2, 4, 6], [7, 8, 9], [1, 1, 1]);
    const first = colorFromRGB(2, 4, 6);
    const second = colorFromRGB(7, 8, 9);
    const third = colorFromRGB(1, 1, 1);

    const frames = runFrames(new Wheel(3, 50), 50, 7);

    expect(frames.slice(3)).toEqual([
      wheelFrame(3, 1, second, first),
      wheelFrame(3, 2, second, first),
      wheelFrame(3, 3, second, first),
      wheelFrame(3, 1, third, second),
    ]);
  });

  test('picks one new color per revolution', () => {
    runFrames(new Wheel(3, 50), 50, 4); // one full pass plus the first frame of the next

    expect(randomNumberMock).toHaveBeenCalledTimes(6); // constructor + one wrap
  });

  describe('lifecycle', () => {
    itBehavesLikeAnIntervalEffect(() => new Wheel(3, 100), 100);
  });
});