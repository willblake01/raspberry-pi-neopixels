import { BlinkCustom, BlinkRandomChange, BlinkRandomStatic, BreatheCustom, Change, CreepCustom, CreepRandomChangePixel, CreepRandomChangeLoop, CreepRandomStatic, SolidCustom, SolidRandom, WalkPixelOffCustomStatic, WalkPixelOffRandomChangeLoop, WalkPixelOffRandomChangePixel, WalkPixelOnCustom, WalkPixelOnRandomChangePixel, WalkPixelOnRandomChangeLoop, WalkPixelOnRandomStatic, Wheel, TurnOff } from '../index.js';

export const RULES = [
  // --- SOLID ---
  {
    name: 'solid-custom',
    when: options => options.isSolid && options.isCustomColorMode,
    make: (config, options) => new SolidCustom(config, options.red, options.green, options.blue),
  },
  {
    name: 'solid-random',
    when: options => options.isSolid && options.isRandomColorMode,
    make: (config) => new SolidRandom(config),
  },

  // --- CHANGE ---
  {
    name: 'change',
    when: options => options.isChange,
    make: (config, options) => new Change(config, options.interval),
  },

  // --- BLINK ---
  {
    name: 'blink-custom',
    when: options => options.isBlink && options.isCustomColorMode,
    make: (config, options) => new BlinkCustom(config, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'blink-random-static',
    when: options => options.isBlink && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: (config, options) => new BlinkRandomStatic(config, options.interval),
  },
  {
    name: 'blink-random-change',
    when: options => options.isBlink && options.isRandomColorMode && options.isChangeRandomColorMode,
    make: (config, options) => new BlinkRandomChange(config, options.interval),
  },

  // --- BREATHE ---
  {
    name: 'breathe-custom',
    when: options => options.isBreathe && options.isCustomColorMode,
    make: (config, options) => new BreatheCustom(config, options.interval, options.red, options.green, options.blue),
  },

  // --- CREEP ---
  {
    name: 'creep-custom',
    when: options => options.isCreep && options.isCustomColorMode,
    make: (config, options) => new CreepCustom(config, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'creep-random-static',
    when: options => options.isCreep && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: (config, options) => new CreepRandomStatic(config, options.interval),
  },
  {
    name: 'creep-random-change-everyPixel',
    when: options => options.isCreep && options.isRandomColorMode && options.isChangeRandomColorMode && options.everyPixelcolorChangeInterval,
    make: (config, options) => new CreepRandomChangePixel(config, options.interval),
  },
  {
    name: 'creep-random-change-everyLoop',
    when: options => options.isCreep && options.isRandomColorMode && options.isChangeRandomColorMode && options.everyLoopcolorChangeInterval,
    make: (config, options) => new CreepRandomChangeLoop(config, options.interval),
  },

  // --- WHEEL ---
  {
    name: 'wheel',
    when: options => options.isWheel,
    make: (config, options) => new Wheel(config, options.interval),
  },

  // --- WALK PIXEL (pixel ON) ---
  {
    name: 'walkPixel-on-custom',
    when: options => options.isWalkPixel && options.pixelOn && options.isCustomColorMode,
    make: (config, options) => new WalkPixelOnCustom(config, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'walkPixel-on-random-static',
    when: options => options.isWalkPixel && options.pixelOn && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: (config, options) => new WalkPixelOnRandomStatic(config, options.interval),
  },
  {
    name: 'walkPixel-on-random-change-everyPixel',
    when: options => options.isWalkPixel && options.pixelOn && options.isRandomColorMode && options.everyPixelcolorChangeInterval,
    make: (config, options) => new WalkPixelOnRandomChangePixel(config, options.interval),
  },
  {
    name: 'walkPixel-on-random-change-everyLoop',
    when: options => options.isWalkPixel && options.pixelOn && options.isRandomColorMode && options.everyLoopcolorChangeInterval,
    make: (config, options) => new WalkPixelOnRandomChangeLoop(config, options.interval),
  },

  // --- WALK PIXEL (pixel OFF) ---
  {
    name: 'walkPixel-off-custom',
    when: options => options.isWalkPixel && options.pixelOff && options.isCustomColorMode,
    make: (config, options) => new WalkPixelOffCustomStatic(config, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'walkPixel-off-random-change-everyPixel',
    when: options => options.isWalkPixel && options.pixelOff && options.isRandomColorMode && options.everyPixelcolorChangeInterval,
    make: (config, options) => new WalkPixelOffRandomChangePixel(config, options.interval),
  },
  {
    name: 'walkPixel-off-random-change-everyLoop',
    when: options => options.isWalkPixel && options.pixelOff && options.isRandomColorMode && options.everyLoopcolorChangeInterval,
    make: (config, options) => new WalkPixelOffRandomChangeLoop(config, options.interval),
  },

  // --- TURN OFF (explicit command) ---
  {
    name: 'turnOff',
    when: options => options.isOff,
    make: (config) => new TurnOff(config),
  },
];
