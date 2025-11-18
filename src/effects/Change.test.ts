import { Change } from './index.js';
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
  brightness: 100,
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

describe('Change effect', () => {
  test('loop renders the current color and prepares a new random color for the next cycle', () => {
    randomNumberMock
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(3) // constructor color
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(6); // next color

    const effect = new Change(createConfig(), 90);

    effect.loop();
    let pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.config.leds).fill(colorFromRGB(1, 2, 3)));

    safeRenderMock.mockClear();

    effect.loop();
    pixels = Array.from(lastRenderPixels());
    expect(pixels).toEqual(new Array(effect.config.leds).fill(colorFromRGB(4, 5, 6)));
  });
});
