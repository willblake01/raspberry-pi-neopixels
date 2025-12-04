import { CheckerboardCustom, CheckerboardCustomShift, CheckerboardRandomShift, CheckerboardRandom, BlinkCustom, BlinkRandomChange, BlinkRandomStatic, BreatheCustom, BreatheRandom, Change, GrowingBarCustom, GrowingBarRandomChangePixel, GrowingBarRandomChangeLoop, GrowingBarRandomStatic, SolidCustom, SolidRandom, WalkPixelOffCustomStatic, WalkPixelOffRandomStatic, WalkPixelOffRandomChangeLoop, WalkPixelOffRandomChangePixel, WalkPixelOnCustom, WalkPixelOnRandomChangePixel, WalkPixelOnRandomChangeLoop, WalkPixelOnRandomStatic, Wheel, TurnOff } from '../index.js';
import { Effect, Options } from '../../types/index.js';

interface Rule {
  name: string;
  when: (options: Options) => boolean;
  make: (options: Options) => Effect;
};

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
    when: options => options.isAlternate && options.isCustomColorMode,
    make: options => new CheckerboardCustom(options.leds, options.red, options.green, options.blue, options.red2, options.green2, options.blue2)
  },
  {
    name: 'checkerboard-custom-shift',
    when: options => options.isAlternate && options.isCustomColorMode && options.isShiftMode,
    make: options => new CheckerboardCustomShift(options.leds, options.interval, options.red, options.green, options.blue, options.red2, options.green2, options.blue2)
  },
  {
    name: 'checkerboard-random',
    when: options => options.isAlternate && options.isRandomColorMode,
    make: options => new CheckerboardRandom(options.leds)
  },
  {
    name: 'checkerboard-random-shift',
    when: options => options.isAlternate && options.isRandomColorMode && options.isShiftMode,
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
    when: options => options.isCreep && options.isCustomColorMode,
    make: options => new GrowingBarCustom(options.leds, options.interval, options.red, options.green, options.blue)
  },
  {
    name: 'growing-bar-random-static',
    when: options => options.isCreep && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: options => new GrowingBarRandomStatic(options.leds, options.interval)
  },
  {
    name: 'growing-bar-random-change-every-pixel',
    when: options => options.isCreep && options.isRandomColorMode && options.isChangeRandomColorMode && options.isEveryPixelColorChangeInterval,
    make: options => new GrowingBarRandomChangePixel(options.leds, options.interval)
  },
  {
    name: 'growing-bar-random-change-every-loop',
    when: options => options.isCreep && options.isRandomColorMode && options.isChangeRandomColorMode && options.isEveryLoopColorChangeInterval,
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

  // --- TURN OFF (explicit command) ---
  {
    name: 'turn-off',
    when: options => options.isOff,
    make: options => new TurnOff(options.leds)
  },
];
