import { BlinkCustom, BlinkRandomChange, BlinkRandomStatic, BreatheCustom, BreatheRandom, Change, CreepCustom, CreepRandomChangePixel, CreepRandomChangeLoop, CreepRandomStatic, SolidCustom, SolidRandom, WalkPixelOffCustomStatic, WalkPixelOffRandomStatic, WalkPixelOffRandomChangeLoop, WalkPixelOffRandomChangePixel, WalkPixelOnCustom, WalkPixelOnRandomChangePixel, WalkPixelOnRandomChangeLoop, WalkPixelOnRandomStatic, Wheel, TurnOff } from '../index.js';
import { Effect, Options } from '../../types/index.js';

interface Rule {
  name: string;
  when: (options: Options) => boolean;
  make: (leds: number, options: Options) => Effect;
};

export const RULES: Rule[] = [
  // --- SOLID ---
  {
    name: 'solid-custom',
    when: options => options.isSolid && options.isCustomColorMode,
    make: (leds, options) => new SolidCustom(leds, options.red, options.green, options.blue),
  },
  {
    name: 'solid-random',
    when: options => options.isSolid && options.isRandomColorMode,
    make: leds => new SolidRandom(leds),
  },

  // --- CHANGE ---
  {
    name: 'change',
    when: options => options.isChange,
    make: (leds, options) => new Change(leds, options.interval),
  },

  // --- BLINK ---
  {
    name: 'blink-custom',
    when: options => options.isBlink && options.isCustomColorMode,
    make: (leds, options) => new BlinkCustom(leds, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'blink-random-static',
    when: options => options.isBlink && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: (leds, options) => new BlinkRandomStatic(leds, options.interval),
  },
  {
    name: 'blink-random-change',
    when: options => options.isBlink && options.isRandomColorMode && options.isChangeRandomColorMode,
    make: (leds, options) => new BlinkRandomChange(leds, options.interval),
  },

  // --- BREATHE ---
  {
    name: 'breathe-custom',
    when: options => options.isBreathe && options.isCustomColorMode,
    make: (leds, options) => new BreatheCustom(leds, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'breathe-random',
    when: options => options.isBreathe && options.isRandomColorMode,
    make: (leds, options) => new BreatheRandom(leds, options.interval),
  },

  // --- CREEP ---
  {
    name: 'creep-custom',
    when: options => options.isCreep && options.isCustomColorMode,
    make: (leds, options) => new CreepCustom(leds, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'creep-random-static',
    when: options => options.isCreep && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: (leds, options) => new CreepRandomStatic(leds, options.interval),
  },
  {
    name: 'creep-random-change-every-pixel',
    when: options => options.isCreep && options.isRandomColorMode && options.isChangeRandomColorMode && options.everyPixelColorChangeInterval,
    make: (leds, options) => new CreepRandomChangePixel(leds, options.interval),
  },
  {
    name: 'creep-random-change-every-loop',
    when: options => options.isCreep && options.isRandomColorMode && options.isChangeRandomColorMode && options.everyLoopColorChangeInterval,
    make: (leds, options) => new CreepRandomChangeLoop(leds, options.interval),
  },

  // --- WHEEL ---
  {
    name: 'wheel',
    when: options => options.isWheel,
    make: (leds, options) => new Wheel(leds, options.interval),
  },

  // --- WALK PIXEL (pixel ON) ---
  {
    name: 'walk-pixel-on-custom',
    when: options => options.isWalkPixel && options.pixelState === 1 && options.isCustomColorMode,
    make: (leds, options) => new WalkPixelOnCustom(leds, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'walk-pixel-on-random-static',
    when: options => options.isWalkPixel && options.pixelState === 1 && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: (leds, options) => new WalkPixelOnRandomStatic(leds, options.interval),
  },
  {
    name: 'walk-pixel-on-random-change-every-pixel',
    when: options => options.isWalkPixel && options.pixelState === 1 && options.isRandomColorMode && options.everyPixelColorChangeInterval,
    make: (leds, options) => new WalkPixelOnRandomChangePixel(leds, options.interval),
  },
  {
    name: 'walk-pixel-on-random-change-every-loop',
    when: options => options.isWalkPixel && options.pixelState === 1 && options.isRandomColorMode && options.everyLoopColorChangeInterval,
    make: (leds, options) => new WalkPixelOnRandomChangeLoop(leds, options.interval),
  },

  // --- WALK PIXEL (pixel OFF) ---
  {
    name: 'walk-pixel-off-custom',
    when: options => options.isWalkPixel && options.pixelState === 0 && options.isCustomColorMode,
    make: (leds, options) => new WalkPixelOffCustomStatic(leds, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'walk-pixel-off-random-static',
    when: options => options.isWalkPixel && options.pixelState === 0 && options.isRandomColorMode,
    make: (leds, options) => new WalkPixelOffRandomStatic(leds, options.interval),
  },
  {
    name: 'walk-pixel-off-random-change-every-pixel',
    when: options => options.isWalkPixel && options.pixelState === 0 && options.isRandomColorMode && options.everyPixelColorChangeInterval,
    make: (leds, options) => new WalkPixelOffRandomChangePixel(leds, options.interval),
  },
  {
    name: 'walk-pixel-off-random-change-every-loop',
    when: options => options.isWalkPixel && options.pixelState === 0 && options.isRandomColorMode && options.everyLoopColorChangeInterval,
    make: (leds, options) => new WalkPixelOffRandomChangeLoop(leds, options.interval),
  },

  // --- TURN OFF (explicit command) ---
  {
    name: 'turn-off',
    when: options => options.isOff,
    make: (leds) => new TurnOff(leds),
  },
];
