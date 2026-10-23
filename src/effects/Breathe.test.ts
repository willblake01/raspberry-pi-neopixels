import { BreatheCustom, BreatheRandom } from './index.js';
import { breatheScale } from './Breathe.js';
import { scaleColor } from './utils/color.js';
import {
  colorFromRGB,
  itBehavesLikeAnIntervalEffect,
  queueColors,
  randomNumberMock,
  renderedFrames,
  runFrames,
  setupEffectTest,
} from '../test-utils/effectHelpers.js';

jest.mock('../ledRuntime.js', () => ({ safeRender: jest.fn() }));
jest.mock('../utils/index.js', () => ({ randomNumber: jest.fn() }));

setupEffectTest();

const PERIOD = 1000;
const FPS = 2; // one frame every 500 ms → floor, peak, floor
const FRAME_MS = 500;

const solid = (leds: number, color: number) => Array(leds).fill(color);

// < - - - - - - Pure helpers - - - - - - >

describe('breatheScale', () => {
  test('starts at the floor', () => {
    expect(breatheScale(0, PERIOD, 0.1)).toBeCloseTo(0.1);
  });

  test('peaks at full brightness halfway through', () => {
    expect(breatheScale(500, PERIOD, 0.1)).toBeCloseTo(1);
  });

  test('wraps back to the floor each period', () => {
    expect(breatheScale(1000, PERIOD, 0.1)).toBeCloseTo(0.1);
    expect(breatheScale(2500, PERIOD, 0.1)).toBeCloseTo(1);
  });

  test('curve > 1 lingers longer near the floor', () => {
    // At a quarter period the plain cosine is halfway (0.5); curve 2 squares it.
    expect(breatheScale(250, PERIOD, 0, 1)).toBeCloseTo(0.5);
    expect(breatheScale(250, PERIOD, 0, 2)).toBeCloseTo(0.25);
  });
});

describe('scaleColor', () => {
  test('scales each channel and rounds', () => {
    expect(scaleColor(colorFromRGB(200, 100, 50), 0.5)).toBe(colorFromRGB(100, 50, 25));
  });

  test('clamps to 0–255', () => {
    expect(scaleColor(colorFromRGB(200, 100, 50), 2)).toBe(colorFromRGB(255, 200, 100));
    expect(scaleColor(colorFromRGB(200, 100, 50), -1)).toBe(0);
  });
});

// < - - - - - - Effects - - - - - - >

describe('Breathe effects', () => {
  test('BreatheCustom breathes between the floor and the configured color', () => {
    const effect = new BreatheCustom(3, PERIOD, 200, 100, 50, 0.5, 1, FPS);

    expect(runFrames(effect, FRAME_MS, 3)).toEqual([
      solid(3, colorFromRGB(100, 50, 25)),  // t=0: floor (0.5)
      solid(3, colorFromRGB(200, 100, 50)), // t=500: peak (1.0)
      solid(3, colorFromRGB(100, 50, 25)),  // t=1000: floor again
    ]);
  });

  test('BreatheRandom uses the same random color throughout its lifetime', () => {
    queueColors([200, 100, 50]);
    const effect = new BreatheRandom(3, PERIOD, 0.5, 1, FPS);

    expect(runFrames(effect, FRAME_MS, 3)).toEqual([
      solid(3, colorFromRGB(100, 50, 25)),
      solid(3, colorFromRGB(200, 100, 50)),
      solid(3, colorFromRGB(100, 50, 25)),
    ]);
    expect(randomNumberMock).toHaveBeenCalledTimes(3); // constructor only
  });

  test('renders at the frame rate set by fps', () => {
    const effect = new BreatheCustom(3, PERIOD, 1, 2, 3, 0.5, 1, 60); // 17 ms frames

    effect.run();
    jest.advanceTimersByTime(17 * 3);
    effect.stop();

    expect(renderedFrames()).toHaveLength(4);
  });

  test('never renders faster than every 5 ms', () => {
    const effect = new BreatheCustom(3, PERIOD, 1, 2, 3, 0.5, 1, 1000); // would be 1 ms

    effect.run();
    jest.advanceTimersByTime(10);
    effect.stop();

    expect(renderedFrames()).toHaveLength(3); // t=0, 5, 10
  });

  test('clamps floor to 0–1', () => {
    const effect = new BreatheCustom(1, PERIOD, 200, 100, 50, 5, 1, FPS);

    expect(runFrames(effect, FRAME_MS, 1)).toEqual([[colorFromRGB(200, 100, 50)]]);
  });

  describe('lifecycle', () => {
    itBehavesLikeAnIntervalEffect(
        () => new BreatheCustom(3, PERIOD, 1, 2, 3, 0.5, 1, FPS),
        FRAME_MS,
    );
  });
});