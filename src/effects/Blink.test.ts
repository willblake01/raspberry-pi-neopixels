import { BlinkCustom, BlinkRandomChange, BlinkRandomStatic } from './index.js';
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
  leds: 4,
  dma: 10,
  brightness: 64,
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

describe('Blink effects', () => {
  test('BlinkCustom toggles the configured color on and off', () => {
    const effect = new BlinkCustom(createConfig().leds, 50, 10, 20, 30);
    const expectedColor = colorFromRGB(10, 20, 30);

    effect.loop();

    let pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.leds).fill(expectedColor));

    effect.loop();
    pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.leds).fill(0));

    effect.loop();
    pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.leds).fill(expectedColor));
  });

  test('BlinkRandomStatic keeps the same random color when the LEDs are on', () => {
    randomNumberMock
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(15)
      .mockReturnValueOnce(25);

    const effect = new BlinkRandomStatic(createConfig().leds, 60);
    const expectedColor = colorFromRGB(5, 15, 25);

    effect.loop();
    let pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.leds).fill(expectedColor));

    effect.loop();
    pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.leds).fill(0));

    effect.loop();
    pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.leds).fill(expectedColor));
  });

  test('BlinkRandomChange picks a new color every time it turns back on', () => {
    randomNumberMock
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(3) // constructor
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(6); // next on-cycle color

    const effect = new BlinkRandomChange(createConfig().leds, 80);
    const firstColor = colorFromRGB(1, 2, 3);
    const secondColor = colorFromRGB(4, 5, 6);

    effect.loop();
    let pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.leds).fill(firstColor));

    effect.loop();
    pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.leds).fill(0));

    effect.loop();
    pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.leds).fill(secondColor));
  });
});
