import { BreatheCustom, BreatheRandom } from './index.js';
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
  leds: 5,
  dma: 10,
  brightness: 120,
  gpio: 18,
  stripType: 'rgb',
  ...overrides,
});

const colorFromRGB = (red: number, green: number, blue: number) =>
  (red << 16) | (green << 8) | blue;

const lastRenderPixels = () =>
  safeRenderMock.mock.calls[safeRenderMock.mock.calls.length - 1][0] as Uint32Array;

beforeEach(() => {
  safeRenderMock.mockClear();
  randomNumberMock.mockReset();
  randomNumberMock.mockReturnValue(0);
});

describe('Breathe effects', () => {
  test('BreatheCustom scales the configured color using the easing scalar', () => {
    const effect = new BreatheCustom(createConfig().leds, 1000, 200, 100, 50);
    const scalarSpy = jest
      .spyOn(effect as unknown as { _scalar: (nowMs: number) => number }, '_scalar')
      .mockReturnValue(0.5);

    effect.loop();

    const expectedColor = colorFromRGB(100, 50, 25);
    const pixels = Array.from(lastRenderPixels());

    expect(pixels).toEqual(new Array(effect.leds).fill(expectedColor));

    scalarSpy.mockRestore();
  });

  test('BreatheRandom uses the same random color throughout its lifetime', () => {
    randomNumberMock
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(20)
      .mockReturnValueOnce(30); // constructor color

    const effect = new BreatheRandom(createConfig().leds, 1500);
    const scalarSpy = jest
      .spyOn(effect as unknown as { _scalar: (nowMs: number) => number }, '_scalar')
      .mockReturnValue(1);

    // First loop call
    effect.loop();
    let pixels = Array.from(lastRenderPixels());
    const expectedColor = colorFromRGB(10, 20, 30);
    expect(pixels).toEqual(new Array(effect.leds).fill(expectedColor));

    safeRenderMock.mockClear();

    // Second loop call - should use the same color (no new randomNumber calls)
    effect.loop();
    pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.leds).fill(expectedColor));

    // Verify randomNumber was only called during construction
    expect(randomNumber).toHaveBeenCalledTimes(3);

    scalarSpy.mockRestore();
  });
});
