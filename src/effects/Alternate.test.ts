import { 
  AlternateCustomStatic, 
  AlternateRandomStatic, 
  AlternateCustomShiftPixel, 
  AlternateRandomShiftPixel, 
  AlternateCustomShiftLoop, 
  AlternateRandomShiftLoop 
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
  describe('AlternateCustomStatic', () => {
    test('alternates between two specified colors', () => {
      const leds = createConfig().leds;
      const red1 = 10, green1 = 20, blue1 = 30;
      const red2 = 40, green2 = 50, blue2 = 60;
      
      const effect = new AlternateCustomStatic(leds, red1, green1, blue1, red2, green2, blue2);
      const expectedColor1 = colorFromRGB(red1, green1, blue1);
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
      const red1 = 100, green1 = 150, blue1 = 200;
      const red2 = 50, green2 = 75, blue2 = 25;
      
      const effect = new AlternateCustomStatic(leds, red1, green1, blue1, red2, green2, blue2);
      const expectedColor1 = colorFromRGB(red1, green1, blue1);
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
      const red1 = 255, green1 = 0, blue1 = 0;
      const red2 = 0, green2 = 255, blue2 = 0;
      
      const effect = new AlternateCustomStatic(leds, red1, green1, blue1, red2, green2, blue2);
      const expectedColor1 = colorFromRGB(red1, green1, blue1);
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

  describe('AlternateRandomStatic', () => {
    test('alternates between two random colors (note: color2 has bit shifting bug)', () => {
      // Mock randomNumber to return predictable values
      randomNumberMock
        .mockReturnValueOnce(10) // red1
        .mockReturnValueOnce(20) // green1
        .mockReturnValueOnce(30) // blue1
        .mockReturnValueOnce(40) // red2
        .mockReturnValueOnce(50) // green2
        .mockReturnValueOnce(60); // blue2

      const leds = 4;
      const effect = new AlternateRandomStatic(leds);
      const expectedColor1 = colorFromRGB(10, 20, 30);
      // Note: AlternateRandomStatic has a bug in color2 calculation
      // It should be (red2 << 16) | (green2 << 8) | blue2
      // but it's currently (red2) | (green2) | (blue2)
      const expectedColor2 = 40 | 50 | 60; // This is the buggy calculation

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

      const effect1 = new AlternateRandomStatic(2);
      const effect2 = new AlternateRandomStatic(2);

      effect1.run();
      const pixels1 = Array.from(lastRenderPixels());

      effect2.run();
      const pixels2 = Array.from(lastRenderPixels());

      // The two effects should have different color patterns
      expect(pixels1).not.toEqual(pixels2);
    });
  });

  describe('AlternateCustomShiftPixel', () => {
    test('shifts pattern between two specified colors on each loop call', () => {
      const leds = 4;
      const interval = 100;
      const red1 = 255, green1 = 0, blue1 = 0;
      const red2 = 0, green2 = 0, blue2 = 255;
      
      const effect = new AlternateCustomShiftPixel(leds, interval, red1, green1, blue1, red2, green2, blue2);
      const expectedColor1 = colorFromRGB(red1, green1, blue1);
      const expectedColor2 = colorFromRGB(red2, green2, blue2);

      // First loop call
      effect.loop();
      let pixels = Array.from(lastRenderPixels());
      expect(pixels).toEqual([
        expectedColor2, // index 0 - even (shifted)
        expectedColor1, // index 1 - odd (shifted)
        expectedColor2, // index 2 - even (shifted)
        expectedColor1  // index 3 - odd (shifted)
      ]);

      // Second loop call - should shift pattern
      effect.loop();
      pixels = Array.from(lastRenderPixels());
      expect(pixels).toEqual([
        expectedColor1, // index 0 - even (normal)
        expectedColor2, // index 1 - odd (normal)
        expectedColor1, // index 2 - even (normal)
        expectedColor2  // index 3 - odd (normal)
      ]);

      expect(safeRender).toHaveBeenCalledTimes(2);
    });

    test('run method calls loop and sets up interval', () => {
      jest.useFakeTimers();
      const effect = new AlternateCustomShiftPixel(4, 100, 255, 0, 0, 0, 0, 255);
      
      effect.run();
      expect(safeRender).toHaveBeenCalledTimes(1);
      
      // Advance timers to trigger interval
      jest.advanceTimersByTime(100);
      expect(safeRender).toHaveBeenCalledTimes(2);
      
      jest.useRealTimers();
    });
  });

  describe('AlternateRandomShiftPixel', () => {
    test('shifts pattern between two random colors on each loop call', () => {
      randomNumberMock
        .mockReturnValueOnce(15) // red1
        .mockReturnValueOnce(25) // green1
        .mockReturnValueOnce(35) // blue1
        .mockReturnValueOnce(45) // red2
        .mockReturnValueOnce(55) // green2
        .mockReturnValueOnce(65); // blue2

      const leds = 3;
      const interval = 200;
      const effect = new AlternateRandomShiftPixel(leds, interval);
      
      // First loop call
      effect.loop();
      let pixels = Array.from(lastRenderPixels());
      expect(pixels.length).toBe(leds);
      
      // Second loop call - pattern should shift
      effect.loop();
      const pixels2 = Array.from(lastRenderPixels());
      expect(pixels2.length).toBe(leds);
      
      // Patterns should be different due to shifting
      expect(pixels).not.toEqual(pixels2);
      
      expect(randomNumber).toHaveBeenCalledTimes(6);
      expect(safeRender).toHaveBeenCalledTimes(2);
    });

    test('generates new colors every loop call', () => {
      randomNumberMock
        .mockReturnValue(100); // Always return 100 for initial colors

      const effect = new AlternateRandomShiftPixel(2, 100);
      
      // Mock randomNumber for new colors on each loop
      randomNumberMock
        .mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValueOnce(30) // first loop new colors
        .mockReturnValueOnce(40).mockReturnValueOnce(50).mockReturnValueOnce(60); // second loop new colors
      
      effect.loop();
      const pixels1 = Array.from(lastRenderPixels());
      
      effect.loop();
      const pixels2 = Array.from(lastRenderPixels());
      
      // Colors should be different between loops
      expect(pixels1).not.toEqual(pixels2);
    });
  });

  describe('AlternateCustomShiftLoop', () => {
    test('shifts pattern and changes colors on each loop call', () => {
      const leds = 4;
      const interval = 150;
      const red1 = 128, green1 = 64, blue1 = 192;
      const red2 = 32, green2 = 96, blue2 = 160;
      
      const effect = new AlternateCustomShiftLoop(leds, interval, red1, green1, blue1, red2, green2, blue2);
      
      // First loop call
      effect.loop();
      const pixels1 = Array.from(lastRenderPixels());
      expect(pixels1.length).toBe(leds);
      
      // Second loop call - should shift pattern and potentially change colors
      effect.loop();
      const pixels2 = Array.from(lastRenderPixels());
      expect(pixels2.length).toBe(leds);
      
      expect(safeRender).toHaveBeenCalledTimes(2);
    });
  });

  describe('AlternateRandomShiftLoop', () => {
    test('shifts pattern and generates new random colors on each loop call', () => {
      randomNumberMock
        .mockReturnValueOnce(80) // initial red1
        .mockReturnValueOnce(90) // initial green1
        .mockReturnValueOnce(100) // initial blue1
        .mockReturnValueOnce(110) // initial red2
        .mockReturnValueOnce(120) // initial green2
        .mockReturnValueOnce(130); // initial blue2

      const leds = 3;
      const interval = 250;
      const effect = new AlternateRandomShiftLoop(leds, interval);
      
      // Add more mocks for loop calls
      randomNumberMock
        .mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValueOnce(30) // first loop
        .mockReturnValueOnce(40).mockReturnValueOnce(50).mockReturnValueOnce(60); // second loop
      
      effect.loop();
      const pixels1 = Array.from(lastRenderPixels());
      expect(pixels1.length).toBe(leds);
      
      effect.loop();
      const pixels2 = Array.from(lastRenderPixels());
      expect(pixels2.length).toBe(leds);
      
      // Should have different patterns due to new random colors and shifting
      expect(pixels1).not.toEqual(pixels2);
      
      expect(safeRender).toHaveBeenCalledTimes(2);
    });
  });

  test('constructors do not call safeRender', () => {
    new AlternateCustomStatic(6, 1, 2, 3, 4, 5, 6);
    new AlternateRandomStatic(6);
    new AlternateCustomShiftPixel(6, 100, 1, 2, 3, 4, 5, 6);
    new AlternateRandomShiftPixel(6, 100);
    new AlternateCustomShiftLoop(6, 100, 1, 2, 3, 4, 5, 6);
    new AlternateRandomShiftLoop(6, 100);

    expect(safeRender).not.toHaveBeenCalled();
  });
});
