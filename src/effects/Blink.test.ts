import { BlinkCustom, BlinkRandomStatic, BlinkRandomChange } from './index.js';
import { buildBlink } from './Blink.js';
import {
  colorFromRGB,
  itBehavesLikeAnIntervalEffect,
  queueColors,
  randomNumberMock,
  renderedFrames,
  runFrames,
  safeRenderMock,
  setupEffectTest,
} from '../test-utils/effectHelpers.js';

jest.mock('../ledRuntime.js', () => ({ safeRender: jest.fn() }));
jest.mock('../utils/index.js', () => ({ randomNumber: jest.fn() }));

setupEffectTest();

const on = (leds: number, color: number) => Array(leds).fill(color);
const off = (leds: number) => Array(leds).fill(0);

describe('buildBlink', () => {
  test('step 0 fills the strip', () => {
    expect(Array.from(buildBlink(3, 0, 7))).toEqual([7, 7, 7]);
  });

  test('step 1 is dark', () => {
    expect(Array.from(buildBlink(3, 1, 7))).toEqual([0, 0, 0]);
  });
});

describe('Blink effects', () => {
  test('BlinkCustom alternates on and off', () => {
    const color = colorFromRGB(10, 20, 30);

    expect(runFrames(new BlinkCustom(3, 100, 10, 20, 30), 100, 4)).toEqual([
      on(3, color), off(3), on(3, color), off(3),
    ]);
  });

  test('BlinkRandomStatic keeps one random color', () => {
    queueColors([1, 2, 3]);
    const color = colorFromRGB(1, 2, 3);

    expect(runFrames(new BlinkRandomStatic(3, 100), 100, 4)).toEqual([
      on(3, color), off(3), on(3, color), off(3),
    ]);
    expect(randomNumberMock).toHaveBeenCalledTimes(3);
  });

  test('BlinkRandomChange picks a new color each time it turns back on', () => {
    queueColors([1, 2, 3], [4, 5, 6]);

    expect(runFrames(new BlinkRandomChange(3, 100), 100, 4)).toEqual([
      on(3, colorFromRGB(1, 2, 3)), off(3),
      on(3, colorFromRGB(4, 5, 6)), off(3),
    ]);
  });

  test('run restarts at "on" after stopping mid-cycle', () => {
    const color = colorFromRGB(10, 20, 30);
    const effect = new BlinkCustom(3, 100, 10, 20, 30);

    effect.run();                   // on
    jest.advanceTimersByTime(100);  // off
    effect.stop();
    safeRenderMock.mockClear();

    effect.run();                   // restarts: on

    expect(renderedFrames()).toEqual([on(3, color)]);
    effect.stop();
  });

  test('cycle length does not depend on LED count', () => {
    expect(runFrames(new BlinkCustom(0, 100, 1, 2, 3), 100, 3)).toEqual([[], [], []]);
  });

  describe('lifecycle', () => {
    itBehavesLikeAnIntervalEffect(() => new BlinkCustom(3, 100, 1, 2, 3), 100);
  });
});