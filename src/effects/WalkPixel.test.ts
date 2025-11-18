import {
  WalkPixelOffCustomStatic,
  WalkPixelOffRandomChangeLoop,
  WalkPixelOffRandomChangePixel,
  WalkPixelOffRandomStatic,
  WalkPixelOnCustom,
  WalkPixelOnRandomChangeLoop,
  WalkPixelOnRandomChangePixel,
  WalkPixelOnRandomStatic,
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
  brightness: 90,
  gpio: 18,
  stripType: 'rgb',
  ...overrides,
});

const colorFromRGB = (red: number, green: number, blue: number) =>
  (red << 16) | (green << 8) | blue;

const lastRenderPixels = () =>
  safeRenderMock.mock.calls[safeRenderMock.mock.calls.length - 1][0] as Uint32Array;

const expectSinglePixel = (pixels: Uint32Array, index: number, color: number) => {
  const expected = Array.from({ length: pixels.length }, (_, i) => (i === index ? color : 0));
  expect(Array.from(pixels)).toEqual(expected);
};

const expectOffPixel = (pixels: Uint32Array, index: number, color: number) => {
  const expected = Array.from({ length: pixels.length }, (_, i) => (i === index ? 0 : color));
  expect(Array.from(pixels)).toEqual(expected);
};

beforeEach(() => {
  safeRenderMock.mockClear();
  randomNumberMock.mockReset();
  randomNumberMock.mockReturnValue(0);
});

describe('WalkPixelOn* effects', () => {
  test('WalkPixelOnCustom moves the lit pixel and wraps to the start', () => {
    const config = createConfig({ leds: 3 });
    const color = colorFromRGB(4, 8, 12);

    const effect = new WalkPixelOnCustom(config, 70, 4, 8, 12);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 0, color);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 1, color);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 2, color);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 0, color);
  });

  test('WalkPixelOnRandomStatic uses one random color for the moving pixel', () => {
    randomNumberMock
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(3);

    const effect = new WalkPixelOnRandomStatic(createConfig(), 60);
    const color = colorFromRGB(1, 2, 3);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 0, color);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 1, color);
  });

  test('WalkPixelOnRandomChangePixel changes color every time the pixel moves', () => {
    randomNumberMock
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(6)
      .mockReturnValueOnce(7)
      .mockReturnValueOnce(8)
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(10);

    const effect = new WalkPixelOnRandomChangePixel(createConfig(), 80);
    const firstColor = colorFromRGB(5, 6, 7);
    const secondColor = colorFromRGB(8, 9, 10);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 0, firstColor);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 1, secondColor);
  });

  test('WalkPixelOnRandomChangeLoop keeps a color for a full loop before changing', () => {
    const config = createConfig({ leds: 3 });

    randomNumberMock
      .mockReturnValueOnce(11)
      .mockReturnValueOnce(12)
      .mockReturnValueOnce(13)
      .mockReturnValueOnce(14)
      .mockReturnValueOnce(15)
      .mockReturnValueOnce(16);

    const effect = new WalkPixelOnRandomChangeLoop(config, 90);
    const firstColor = colorFromRGB(11, 12, 13);
    const secondColor = colorFromRGB(14, 15, 16);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 0, firstColor);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 1, firstColor);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 2, firstColor);

    effect.loop();
    expectSinglePixel(lastRenderPixels(), 0, secondColor);
  });
});

describe('WalkPixelOff* effects', () => {
  test('WalkPixelOffCustomStatic leaves one dark pixel while the rest stay lit', () => {
    const config = createConfig({ leds: 3 });
    const color = colorFromRGB(20, 30, 40);
    const effect = new WalkPixelOffCustomStatic(config, 50, 20, 30, 40);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 0, color);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 1, color);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 2, color);
  });

  test('WalkPixelOffRandomStatic keeps the same random color for the lit pixels', () => {
    randomNumberMock
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(6);

    const effect = new WalkPixelOffRandomStatic(createConfig({ leds: 3 }), 55);
    const color = colorFromRGB(2, 4, 6);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 0, color);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 1, color);
  });

  test('WalkPixelOffRandomChangePixel changes the lit color each time the gap moves', () => {
    randomNumberMock
      .mockReturnValueOnce(7)
      .mockReturnValueOnce(8)
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(11)
      .mockReturnValueOnce(12);

    const effect = new WalkPixelOffRandomChangePixel(createConfig({ leds: 3 }), 65);
    const firstColor = colorFromRGB(7, 8, 9);
    const secondColor = colorFromRGB(10, 11, 12);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 0, firstColor);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 1, secondColor);
  });

  test('WalkPixelOffRandomChangeLoop only changes color after a full pass', () => {
    const config = createConfig({ leds: 3 });

    randomNumberMock
      .mockReturnValueOnce(13)
      .mockReturnValueOnce(14)
      .mockReturnValueOnce(15)
      .mockReturnValueOnce(16)
      .mockReturnValueOnce(17)
      .mockReturnValueOnce(18);

    const effect = new WalkPixelOffRandomChangeLoop(config, 95);
    const firstColor = colorFromRGB(13, 14, 15);
    const secondColor = colorFromRGB(16, 17, 18);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 0, firstColor);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 1, firstColor);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 2, firstColor);

    effect.loop();
    expectOffPixel(lastRenderPixels(), 0, secondColor);
  });
});
