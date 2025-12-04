import {
  GrowingBarCustom,
  GrowingBarRandomChangeLoop,
  GrowingBarRandomChangePixel,
  GrowingBarRandomStatic,
} from './index.js';
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
  brightness: 80,
  gpio: 18,
  stripType: 'rgb',
  ...overrides,
});

const colorFromRGB = (red: number, green: number, blue: number) =>
  (red << 16) | (green << 8) | blue;

const lastRenderPixels = () =>
  safeRenderMock.mock.calls[safeRenderMock.mock.calls.length - 1][0] as Uint32Array;

const expectLitPixels = (pixels: Uint32Array, litCount: number, color: number) => {
  const expected = Array.from({ length: pixels.length }, (_, idx) =>
    idx <= litCount - 1 ? color : 0,
  );
  expect(Array.from(pixels)).toEqual(expected);
};

beforeEach(() => {
  safeRenderMock.mockClear();
  randomNumberMock.mockReset();
  randomNumberMock.mockReturnValue(0);
});

describe('Creep effects', () => {
  test('GrowingBarCustom progressively fills pixels and wraps to the start', () => {
    const effect = new GrowingBarCustom(createConfig().leds, 100, 5, 10, 15);
    const color = colorFromRGB(5, 10, 15);

    effect.loop();
    expectLitPixels(lastRenderPixels(), 1, color);

    effect.loop();
    expectLitPixels(lastRenderPixels(), 2, color);

    effect.loop();
    expectLitPixels(lastRenderPixels(), 3, color);

    effect.loop();
    expectLitPixels(lastRenderPixels(), 4, color);

    effect.loop();
    expectLitPixels(lastRenderPixels(), 1, color);
  });

  test('GrowingBarRandomStatic keeps the same random color for the lit trail', () => {
    randomNumberMock
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(19)
      .mockReturnValueOnce(29);

    const effect = new GrowingBarRandomStatic(createConfig().leds, 120);
    const color = colorFromRGB(9, 19, 29);

    effect.loop();
    expectLitPixels(lastRenderPixels(), 1, color);

    effect.loop();
    expectLitPixels(lastRenderPixels(), 2, color);
  });

  test('GrowingBarRandomChangePixel picks a new color after every pixel advance', () => {
    randomNumberMock
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(3) // constructor
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(6); // next pixel

    const effect = new GrowingBarRandomChangePixel(createConfig().leds, 90);

    effect.loop();
    expectLitPixels(lastRenderPixels(), 1, colorFromRGB(1, 2, 3));

    effect.loop();
    expectLitPixels(lastRenderPixels(), 2, colorFromRGB(4, 5, 6));
  });

  test('GrowingBarRandomChangeLoop only changes color when the trail wraps', () => {
    const config = createConfig({ leds: 3 });

    randomNumberMock
      .mockReturnValueOnce(7)
      .mockReturnValueOnce(8)
      .mockReturnValueOnce(9) // constructor
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(11)
      .mockReturnValueOnce(12); // after wrap

    const effect = new GrowingBarRandomChangeLoop(config.leds, 110);
    const firstColor = colorFromRGB(7, 8, 9);
    const secondColor = colorFromRGB(10, 11, 12);

    effect.loop(); // offset 0
    expectLitPixels(lastRenderPixels(), 1, firstColor);

    effect.loop(); // offset 1
    expectLitPixels(lastRenderPixels(), 2, firstColor);

    effect.loop(); // offset 2
    expectLitPixels(lastRenderPixels(), 3, firstColor);

    effect.loop(); // wraps to 0 and changes color
    expectLitPixels(lastRenderPixels(), 1, secondColor);
  });
});
