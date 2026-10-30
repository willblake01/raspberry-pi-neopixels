import { Effect, Options } from '../../types/index.js';
import { EFFECTS } from "../../constants/index.js";
import { createAirQuality, BlinkCustom, BlinkRandomChange, BlinkRandomStatic, BreatheCustom, BreatheRandom, Change, CheckerboardCustom, CheckerboardCustomShift, CheckerboardRandomShift, CheckerboardRandom, createSunriseSunset, CustomPixels, GrowingBarCustom, GrowingBarRandomChangePixel, GrowingBarRandomChangeLoop, GrowingBarRandomStatic, Pomodoro, SolidCustom, SolidRandom, TurnOff, createUVIndex, WalkPixelOffCustomStatic, WalkPixelOffRandomStatic, WalkPixelOffRandomChangeLoop, WalkPixelOffRandomChangePixel, WalkPixelOnCustom, WalkPixelOnRandomChangePixel, WalkPixelOnRandomChangeLoop, WalkPixelOnRandomStatic, createWeather, Wheel } from '../index.js';

interface Rule {
  name: string;
  when: (options: Options) => boolean;
  make: (options: Options) => Effect;
}

export const RULES: Rule[] = [
  // --- SOLID ---
  {
    name: 'solid-custom',
    when: options => options.isSolid && options.isCustomColorMode,
    make: options => new SolidCustom(options.leds, options.red, options.green, options.blue)
  },
  {
    name: 'solid-random',
    when: options => options.isSolid && options.isRandomColorMode,
    make: options => new SolidRandom(options.leds)
  },

  // --- CHECKERBOARD ---
  {
    name: 'checkerboard-custom',
    when: options => options.isCheckerboard && options.isCustomColorMode && !options.isShift,
    make: options => new CheckerboardCustom(options.leds, options.red, options.green, options.blue, options.red2, options.green2, options.blue2)
  },
  {
    name: 'checkerboard-custom-shift',
    when: options => options.isCheckerboard && options.isCustomColorMode && options.isShift,
    make: options => new CheckerboardCustomShift(options.leds, options.interval, options.red, options.green, options.blue, options.red2, options.green2, options.blue2)
  },
  {
    name: 'checkerboard-random',
    when: options => options.isCheckerboard && options.isRandomColorMode && !options.isShift,
    make: options => new CheckerboardRandom(options.leds)
  },
  {
    name: 'checkerboard-random-shift',
    when: options => options.isCheckerboard && options.isRandomColorMode && options.isShift,
    make: options => new CheckerboardRandomShift(options.leds, options.interval),
  },

  // --- CHANGE ---
  {
    name: 'change',
    when: options => options.isChange,
    make: options => new Change(options.leds, options.interval)
  },

  // --- BLINK ---
  {
    name: 'blink-custom',
    when: options => options.isBlink && options.isCustomColorMode,
    make: options => new BlinkCustom(options.leds, options.interval, options.red, options.green, options.blue)
  },
  {
    name: 'blink-random-static',
    when: options => options.isBlink && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: options => new BlinkRandomStatic(options.leds, options.interval)
  },
  {
    name: 'blink-random-change',
    when: options => options.isBlink && options.isRandomColorMode && options.isChangeRandomColorMode,
    make: options => new BlinkRandomChange(options.leds, options.interval)
  },

  // --- BREATHE ---
  {
    name: 'breathe-custom',
    when: options => options.isBreathe && options.isCustomColorMode,
    make: options => new BreatheCustom(options.leds, options.interval, options.red, options.green, options.blue)
  },
  {
    name: 'breathe-random',
    when: options => options.isBreathe && options.isRandomColorMode,
    make: options => new BreatheRandom(options.leds, options.interval)
  },

  // --- GROWING_BAR ---
  {
    name: 'growing-bar-custom',
    when: options => options.isGrowingBar && options.isCustomColorMode,
    make: options => new GrowingBarCustom(options.leds, options.interval, options.red, options.green, options.blue)
  },
  {
    name: 'growing-bar-random-static',
    when: options => options.isGrowingBar && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: options => new GrowingBarRandomStatic(options.leds, options.interval)
  },
  {
    name: 'growing-bar-random-change-every-pixel',
    when: options => options.isGrowingBar && options.isRandomColorMode && options.isChangeRandomColorMode && options.isEveryPixelColorChangeInterval,
    make: options => new GrowingBarRandomChangePixel(options.leds, options.interval)
  },
  {
    name: 'growing-bar-random-change-every-loop',
    when: options => options.isGrowingBar && options.isRandomColorMode && options.isChangeRandomColorMode && options.isEveryLoopColorChangeInterval,
    make: options => new GrowingBarRandomChangeLoop(options.leds, options.interval)
  },

  // --- WHEEL ---
  {
    name: 'wheel',
    when: options => options.isWheel,
    make: options => new Wheel(options.leds, options.interval)
  },

  // --- WALK PIXEL (pixel ON) ---
  {
    name: 'walk-pixel-on-custom',
    when: options => options.isWalkPixel && options.isPixelOn && options.isCustomColorMode,
    make: options => new WalkPixelOnCustom(options.leds, options.interval, options.red, options.green, options.blue)
  },
  {
    name: 'walk-pixel-on-random-static',
    when: options => options.isWalkPixel && options.isPixelOn && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: options => new WalkPixelOnRandomStatic(options.leds, options.interval)
  },
  {
    name: 'walk-pixel-on-random-change-every-pixel',
    when: options => options.isWalkPixel && options.isPixelOn && options.isRandomColorMode && options.isEveryPixelColorChangeInterval,
    make: options => new WalkPixelOnRandomChangePixel(options.leds, options.interval)
  },
  {
    name: 'walk-pixel-on-random-change-every-loop',
    when: options => options.isWalkPixel && options.isPixelOn && options.isRandomColorMode && options.isEveryLoopColorChangeInterval,
    make: options => new WalkPixelOnRandomChangeLoop(options.leds, options.interval)
  },

  // --- WALK PIXEL (pixel OFF) ---
  {
    name: 'walk-pixel-off-custom',
    when: options => options.isWalkPixel && !options.isPixelOn && options.isCustomColorMode,
    make: options => new WalkPixelOffCustomStatic(options.leds, options.interval, options.red, options.green, options.blue)
  },
  {
    name: 'walk-pixel-off-random-static',
    when: options => options.isWalkPixel && !options.isPixelOn && options.isRandomColorMode,
    make: options => new WalkPixelOffRandomStatic(options.leds, options.interval)
  },
  {
    name: 'walk-pixel-off-random-change-every-pixel',
    when: options => options.isWalkPixel && !options.isPixelOn && options.isRandomColorMode && options.isEveryPixelColorChangeInterval,
    make: options => new WalkPixelOffRandomChangePixel(options.leds, options.interval)
  },
  {
    name: 'walk-pixel-off-random-change-every-loop',
    when: options => options.isWalkPixel && !options.isPixelOn && options.isRandomColorMode && options.isEveryLoopColorChangeInterval,
    make: options => new WalkPixelOffRandomChangeLoop(options.leds, options.interval)
  },

  // Pomodoro timer
  {
    name: 'pomodoro',
    when: (o: Options) => o.isOn && o.effect === EFFECTS.POMODORO,
    make: (o: Options) =>
        new Pomodoro(o.leds, {
          workMs: (o.pomodoroWorkMinutes ?? 25) * 60_000,
          shortBreakMs: (o.pomodoroShortBreakMinutes ?? 5) * 60_000,
          longBreakMs: (o.pomodoroLongBreakMinutes ?? 15) * 60_000,
          rounds: o.pomodoroRounds ?? 4,
        }),
  },

  // --- SUNRISE/SUNSET ---
  {
    name: 'sunrise-sunset',
    when: (o: Options) => o.isOn && o.effect === EFFECTS.SUNRISE_SUNSET,
    make: (o: Options) =>
        createSunriseSunset(o.leds, o.locationType, o.location, o.showMoon === 1),
  },

  // --- WEATHER ---
  {
    name: 'weather',
    when: (o: Options) => o.isOn && o.effect === EFFECTS.WEATHER,
    make: (o: Options) =>
        createWeather(o.leds, o.locationType, o.location, o.weatherAlerts === 1),
  },

  {
    name: 'air-quality',
    when: (o: Options) => o.isOn && o.effect === EFFECTS.AIR_QUALITY,
    make: (o: Options) => createAirQuality(o.leds, o.locationType, o.location),
  },

  // --- UV INDEX ---
  {
    name: 'uv-index',
    when: (o: Options) => o.isOn && o.effect === EFFECTS.UV_INDEX,
    make: (o: Options) => createUVIndex(o.leds, o.locationType, o.location),
  },

  // --- CUSTOM PIXELS ---
  {
    name: 'custom-pixels',
    when: (o: Options) => o.isOn && o.effect === EFFECTS.CUSTOM_PIXELS,
    make: (o: Options) => new CustomPixels(o.leds, o.pixelSegments ?? []),
  },

  // --- TURN OFF (explicit command) ---
  {
    name: 'turn-off',
    when: options => options.isOff,
    make: options => new TurnOff(options.leds)
  },
];
