import { SolidCustom, SolidRandom } from './index.js';
import type { Config } from '../types/index.js';

// Mock safeRender so we don't hit hardware
jest.mock('../ledRuntime.js', () => ({
  safeRender: jest.fn(),
}));

import { safeRender } from '../ledRuntime.js';

describe('Solid effects', () => {
  const baseConfig: Config = {
    leds: 5,
    dma: 10,
    brightness: 128,
    gpio: 18,
    stripType: 'rgb',
  } as Config; // cast if Config has more fields

  beforeEach(() => {
    (safeRender as jest.Mock).mockClear();
  });

  test('SolidCustom: fills all pixels with the correct color and calls safeRender once', () => {
    const red = 10;
    const green = 20;
    const blue = 30;
    const expectedColor = (red << 16) | (green << 8) | blue;

    const solid = new SolidCustom(baseConfig, red, green, blue);
    solid.run();

    expect(safeRender).toHaveBeenCalledTimes(1);

    const pixels = (safeRender as jest.Mock).mock.calls[0][0] as Uint32Array;

    expect(pixels).toBeInstanceOf(Uint32Array);
    expect(pixels.length).toBe(baseConfig.leds);
    for (const value of pixels) {
      expect(value).toBe(expectedColor);
    }
  });

  test('SolidRandom: fills all pixels with the provided color and calls safeRender once', () => {
    const red = 100;
    const green = 150;
    const blue = 200;
    const expectedColor = (red << 16) | (green << 8) | blue;

    const solid = new SolidRandom(baseConfig, red, green, blue);
    solid.run();

    expect(safeRender).toHaveBeenCalledTimes(1);

    const pixels = (safeRender as jest.Mock).mock.calls[0][0] as Uint32Array;

    expect(pixels).toBeInstanceOf(Uint32Array);
    expect(pixels.length).toBe(baseConfig.leds);
    for (const value of pixels) {
      expect(value).toBe(expectedColor);
    }
  });

  test('constructors do not call safeRender', () => {
    new SolidCustom(baseConfig, 1, 2, 3);
    new SolidRandom(baseConfig, 4, 5, 6);
    expect(safeRender).not.toHaveBeenCalled();
  });
});
