import { Wheel } from './index.js';
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
  brightness: 70,
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

describe('Wheel effect', () => {
  test('Wheel moves a color wedge across the strip and picks a new color after each revolution', () => {
    randomNumberMock
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(6) // constructor color
      .mockReturnValueOnce(7)
      .mockReturnValueOnce(8)
      .mockReturnValueOnce(9); // next revolution

    const config = createConfig({ leds: 4 });
    const effect = new Wheel(config, 75);
    const firstColor = colorFromRGB(2, 4, 6);
    const secondColor = colorFromRGB(7, 8, 9);

    effect.loop();
    expect(Array.from(lastRenderPixels())).toEqual([firstColor, 0, 0, 0]);

    effect.loop();
    expect(Array.from(lastRenderPixels())).toEqual([firstColor, firstColor, 0, 0]);

    effect.loop();
    expect(Array.from(lastRenderPixels())).toEqual([firstColor, firstColor, firstColor, 0]);

    effect.loop();
    expect(Array.from(lastRenderPixels())).toEqual([
      firstColor,
      firstColor,
      firstColor,
      firstColor,
    ]);

    effect.loop();
    expect(Array.from(lastRenderPixels())).toEqual([secondColor, 0, 0, 0]);
  });
});
