import { 
  AlternateCustom, 
  AlternateRandom, 
  AlternateCustomShift, 
  AlternateRandomShift
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
  safeRenderMock.mock.calls[safeRenderMock.mock.calls.length - 1][0] as Uint32Array;

beforeEach(() => {
  safeRenderMock.mockClear();
  randomNumberMock.mockReset();
  randomNumberMock.mockReturnValue(0);
});

describe('Alternate effects', () => {
  describe('AlternateCustom', () => {
    test('alternates between two specified colors', () => {
      const leds = createConfig().leds;
      const red = 10, green = 20, blue = 30;
      const red2 = 40, green2 = 50, blue2 = 60;
      
      const effect = new AlternateCustom(leds, red, green, blue, red2, green2, blue2);
      const expectedColor1 = colorFromRGB(red, green, blue);
      const expectedColor2 = colorFromRGB(red2, green2, blue2);

      effect.run();

      const pixels = Array.from(lastRenderPixels());
      
      // Check that even indexes have color1 and odd indexes have color2
      for (let i = 0; i < leds; i++) {
        if (i % 2 === 0) {
          expect(pixels[i]).toBe(expectedColor1);
        } else {
          expect(pixels[i]).toBe(expectedColor2);
        }
      }

      expect(safeRender).toHaveBeenCalledTimes(1);
    });

    test('works with even number of LEDs', () => {
      const leds = 4;
      const red = 100, green = 150, blue = 200;
      const red2 = 50, green2 = 75, blue2 = 25;
      
      const effect = new AlternateCustom(leds, red, green, blue, red2, green2, blue2);
      const expectedColor1 = colorFromRGB(red, green, blue);
      const expectedColor2 = colorFromRGB(red2, green2, blue2);

      effect.run();

      const pixels = Array.from(lastRenderPixels());
      
      expect(pixels).toEqual([
        expectedColor1, // index 0 - even
        expectedColor2, // index 1 - odd
        expectedColor1, // index 2 - even
        expectedColor2  // index 3 - odd
      ]);
    });

    test('works with odd number of LEDs', () => {
      const leds = 5;
      const red = 255, green = 0, blue = 0;
      const red2 = 0, green2 = 255, blue2 = 0;
      
      const effect = new AlternateCustom(leds, red, green, blue, red2, green2, blue2);
      const expectedColor1 = colorFromRGB(red, green, blue);
      const expectedColor2 = colorFromRGB(red2, green2, blue2);

      effect.run();

      const pixels = Array.from(lastRenderPixels());
      
      expect(pixels).toEqual([
        expectedColor1, // index 0 - even
        expectedColor2, // index 1 - odd
        expectedColor1, // index 2 - even
        expectedColor2, // index 3 - odd
        expectedColor1  // index 4 - even
      ]);
    });
  });

  describe('AlternateRandom', () => {
    test('alternates between two random colors', () => {
      // Mock randomNumber to return predictable values
      randomNumberMock
        .mockReturnValueOnce(10) // red
        .mockReturnValueOnce(20) // green
        .mockReturnValueOnce(30) // blue
        .mockReturnValueOnce(40) // red2
        .mockReturnValueOnce(50) // green2
        .mockReturnValueOnce(60); // blue2

      const leds = 4;
      const effect = new AlternateRandom(leds);
      const expectedColor1 = colorFromRGB(10, 20, 30);
      const expectedColor2 = colorFromRGB(40, 50, 60); // Now uses correct bit shifting

      effect.run();

      const pixels = Array.from(lastRenderPixels());
      
      expect(pixels).toEqual([
        expectedColor1, // index 0 - even
        expectedColor2, // index 1 - odd
        expectedColor1, // index 2 - even
        expectedColor2  // index 3 - odd
      ]);

      expect(randomNumber).toHaveBeenCalledTimes(6);
      expect(safeRender).toHaveBeenCalledTimes(1);
    });

    test('generates different colors on each instantiation', () => {
      randomNumberMock
        .mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValueOnce(3) // first instance
        .mockReturnValueOnce(4).mockReturnValueOnce(5).mockReturnValueOnce(6) 
        .mockReturnValueOnce(7).mockReturnValueOnce(8).mockReturnValueOnce(9) // second instance
        .mockReturnValueOnce(10).mockReturnValueOnce(11).mockReturnValueOnce(12);

      const effect1 = new AlternateRandom(2);
      const effect2 = new AlternateRandom(2);

      effect1.run();
      const pixels1 = Array.from(lastRenderPixels());

      effect2.run();
      const pixels2 = Array.from(lastRenderPixels());

      // The two effects should have different color patterns
      expect(pixels1).not.toEqual(pixels2);
    });
  });

  describe('AlternateCustomShift', () => {
    test('shifts pattern between two specified colors on each loop call', () => {
      const leds = 4;
      const interval = 100;
      const red = 255, green = 0, blue = 0;
      const red2 = 0, green2 = 0, blue2 = 255;
      
      const effect = new AlternateCustomShift(leds, interval, red, green, blue, red2, green2, blue2);
      const expectedColor1 = colorFromRGB(red, green, blue);
      const expectedColor2 = colorFromRGB(red2, green2, blue2);

      // First loop call
      effect.loop();
      let pixels = Array.from(lastRenderPixels());
      expect(pixels).toEqual([
        expectedColor1, // index 0 - even (normal pattern)
        expectedColor2, // index 1 - odd (normal pattern)
        expectedColor1, // index 2 - even (normal pattern)
        expectedColor2  // index 3 - odd (normal pattern)
      ]);

      // Second loop call - should shift pattern
      effect.loop();
      pixels = Array.from(lastRenderPixels());
      expect(pixels).toEqual([
        expectedColor2, // index 0 - even (shifted pattern)
        expectedColor1, // index 1 - odd (shifted pattern)
        expectedColor2, // index 2 - even (shifted pattern)
        expectedColor1  // index 3 - odd (shifted pattern)
      ]);

      expect(safeRender).toHaveBeenCalledTimes(2);
    });

    test('run method calls loop and sets up interval', () => {
      jest.useFakeTimers();
      const effect = new AlternateCustomShift(4, 100, 255, 0, 0, 0, 0, 255);
      
      effect.run();
      expect(safeRender).toHaveBeenCalledTimes(1);
      
      // Advance timers to trigger interval
      jest.advanceTimersByTime(100);
      expect(safeRender).toHaveBeenCalledTimes(2);
      
      jest.useRealTimers();
    });
  });

  describe('AlternateRandomShift', () => {
    test('shifts pattern between two random colors on each loop call', () => {
      randomNumberMock
        .mockReturnValueOnce(15) // red
        .mockReturnValueOnce(25) // green
        .mockReturnValueOnce(35) // blue
        .mockReturnValueOnce(45) // red2
        .mockReturnValueOnce(55) // green2
        .mockReturnValueOnce(65); // blue2

      const leds = 3;
      const interval = 200;
      const effect = new AlternateRandomShift(leds, interval);
      
      // First loop call
      effect.loop();
      let pixels = Array.from(lastRenderPixels());
      expect(pixels.length).toBe(leds);
      
      // Second loop call - pattern should shift (same colors, different positions)
      effect.loop();
      const pixels2 = Array.from(lastRenderPixels());
      expect(pixels2.length).toBe(leds);
      
      // Patterns should be different due to shifting
      expect(pixels).not.toEqual(pixels2);
      
      expect(randomNumber).toHaveBeenCalledTimes(6);
      expect(safeRender).toHaveBeenCalledTimes(2);
    });
  });

  test('constructors do not call safeRender', () => {
    new AlternateCustom(6, 1, 2, 3, 4, 5, 6);
    new AlternateRandom(6);
    new AlternateCustomShift(6, 100, 1, 2, 3, 4, 5, 6);
    new AlternateRandomShift(6, 100);

    expect(safeRender).not.toHaveBeenCalled();
  });
});
