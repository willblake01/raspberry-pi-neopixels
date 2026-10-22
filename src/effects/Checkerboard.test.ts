import {
  CheckerboardCustom,
  CheckerboardRandom,
  CheckerboardCustomShift,
  CheckerboardRandomShift,
} from './index.js';
import { buildCheckerboard } from './Checkerboard.js';
import type { Config } from '../types/index.js';

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

const createConfig = (overrides: Partial<Config> = {}): Config => ({
  leds: 6,
  dma: 10,
  brightness: 64,
  gpio: 18,
  stripType: 'rgb',
  ...overrides,
});

const colorFromRGB = (red: number, green: number, blue: number) =>
    (red << 16) | (green << 8) | blue;

const lastRenderPixels = () =>
    Array.from(
        safeRenderMock.mock.calls[safeRenderMock.mock.calls.length - 1][0] as Uint32Array,
    );

const RED = colorFromRGB(255, 0, 0);
const BLUE = colorFromRGB(0, 0, 255);

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

describe('buildCheckerboard', () => {
  test('alternates colors starting with color1', () => {
    expect(Array.from(buildCheckerboard(4, 1, 2))).toEqual([1, 2, 1, 2]);
  });

  test('starts with color2 when shifted', () => {
    expect(Array.from(buildCheckerboard(4, 1, 2, true))).toEqual([2, 1, 2, 1]);
  });

  test('handles odd lengths', () => {
    expect(Array.from(buildCheckerboard(5, 1, 2))).toEqual([1, 2, 1, 2, 1]);
  });

  test('returns an empty array for zero LEDs', () => {
    expect(buildCheckerboard(0, 1, 2)).toHaveLength(0);
  });
});

describe('Checkerboard effect', () => {
  describe('CheckerboardCustom', () => {
    test('alternates between two specified colors', () => {
      const { leds } = createConfig();
      const effect = new CheckerboardCustom(leds, 10, 20, 30, 40, 50, 60);
      const color1 = colorFromRGB(10, 20, 30);
      const color2 = colorFromRGB(40, 50, 60);

      effect.run();

      expect(lastRenderPixels()).toEqual([color1, color2, color1, color2, color1, color2]);
      expect(safeRender).toHaveBeenCalledTimes(1);
    });

    test('works with odd number of LEDs', () => {
      const effect = new CheckerboardCustom(5, 255, 0, 0, 0, 255, 0);
      const color1 = colorFromRGB(255, 0, 0);
      const color2 = colorFromRGB(0, 255, 0);

      effect.run();

      expect(lastRenderPixels()).toEqual([color1, color2, color1, color2, color1]);
    });
  });

  describe('CheckerboardRandom', () => {
    test('alternates between two random colors', () => {
      randomNumberMock
          .mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValueOnce(30)
          .mockReturnValueOnce(40).mockReturnValueOnce(50).mockReturnValueOnce(60);

      const effect = new CheckerboardRandom(4);
      const color1 = colorFromRGB(10, 20, 30);
      const color2 = colorFromRGB(40, 50, 60);

      effect.run();

      expect(lastRenderPixels()).toEqual([color1, color2, color1, color2]);
      expect(randomNumber).toHaveBeenCalledTimes(6);
      expect(safeRender).toHaveBeenCalledTimes(1);
    });

    test('generates different colors on each instantiation', () => {
      randomNumberMock
          .mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValueOnce(3)
          .mockReturnValueOnce(4).mockReturnValueOnce(5).mockReturnValueOnce(6)
          .mockReturnValueOnce(7).mockReturnValueOnce(8).mockReturnValueOnce(9)
          .mockReturnValueOnce(10).mockReturnValueOnce(11).mockReturnValueOnce(12);

      const effect1 = new CheckerboardRandom(2);
      const effect2 = new CheckerboardRandom(2);

      effect1.run();
      const pixels1 = lastRenderPixels();

      effect2.run();
      const pixels2 = lastRenderPixels();

      expect(pixels1).not.toEqual(pixels2);
    });
  });

  describe('CheckerboardCustomShift', () => {
    test('renders immediately on run, then shifts each interval', () => {
      const effect = new CheckerboardCustomShift(4, 100, 255, 0, 0, 0, 0, 255);

      effect.run();
      expect(lastRenderPixels()).toEqual([RED, BLUE, RED, BLUE]);

      jest.advanceTimersByTime(100);
      expect(lastRenderPixels()).toEqual([BLUE, RED, BLUE, RED]);

      jest.advanceTimersByTime(100);
      expect(lastRenderPixels()).toEqual([RED, BLUE, RED, BLUE]);

      expect(safeRender).toHaveBeenCalledTimes(3);
      effect.stop();
    });

    test('stop halts rendering', () => {
      const effect = new CheckerboardCustomShift(4, 100, 255, 0, 0, 0, 0, 255);

      effect.run();
      effect.stop();
      jest.advanceTimersByTime(500);

      expect(safeRender).toHaveBeenCalledTimes(1);
    });

    test('calling run twice does not stack intervals', () => {
      const effect = new CheckerboardCustomShift(4, 100, 255, 0, 0, 0, 0, 255);

      effect.run();
      effect.run();
      safeRenderMock.mockClear();

      jest.advanceTimersByTime(100);

      expect(safeRender).toHaveBeenCalledTimes(1);
      effect.stop();
    });

    test('run resets to the unshifted pattern', () => {
      const effect = new CheckerboardCustomShift(4, 100, 255, 0, 0, 0, 0, 255);

      effect.run();
      jest.advanceTimersByTime(100); // now shifted
      effect.stop();

      effect.run();
      expect(lastRenderPixels()).toEqual([RED, BLUE, RED, BLUE]);
      effect.stop();
    });
  });

  describe('CheckerboardRandomShift', () => {
    test('shifts pattern between two random colors each interval', () => {
      randomNumberMock
          .mockReturnValueOnce(15).mockReturnValueOnce(25).mockReturnValueOnce(35)
          .mockReturnValueOnce(45).mockReturnValueOnce(55).mockReturnValueOnce(65);

      const effect = new CheckerboardRandomShift(3, 200);
      const color1 = colorFromRGB(15, 25, 35);
      const color2 = colorFromRGB(45, 55, 65);

      effect.run();
      expect(lastRenderPixels()).toEqual([color1, color2, color1]);

      jest.advanceTimersByTime(200);
      expect(lastRenderPixels()).toEqual([color2, color1, color2]);

      expect(randomNumber).toHaveBeenCalledTimes(6);
      expect(safeRender).toHaveBeenCalledTimes(2);
      effect.stop();
    });
  });

  test('constructors do not call safeRender', () => {
    new CheckerboardCustom(6, 1, 2, 3, 4, 5, 6);
    new CheckerboardRandom(6);
    new CheckerboardCustomShift(6, 100, 1, 2, 3, 4, 5, 6);
    new CheckerboardRandomShift(6, 100);

    expect(safeRender).not.toHaveBeenCalled();
  });
});