import { BlinkCustom, BlinkRandomChange, BlinkRandomStatic, BreatheCustom, Change, CreepCustom, CreepRandomChangePixel, CreepRandomChangeLoop, CreepRandomStatic, SolidCustom, SolidRandom, WalkPixelOffCustomStatic, WalkPixelOffRandomChangeLoop, WalkPixelOffRandomChangePixel, WalkPixelOnCustom, WalkPixelOnRandomChangePixel, WalkPixelOnRandomChangeLoop, WalkPixelOnRandomStatic, Wheel, TurnOff } from '../index.js';

export const RULES = [
  // --- SOLID ---
  {
    name: 'solid-custom',
    when: o => o.isSolid && o.isCustomColorMode,
    make: (cfg, o) => new SolidCustom(cfg, o.red, o.green, o.blue),
  },
  {
    name: 'solid-random',
    when: o => o.isSolid && o.isRandomColorMode,
    make: (cfg) => new SolidRandom(cfg),
  },

  // --- CHANGE ---
  {
    name: 'change',
    when: o => o.isChange,
    make: (cfg, o) => new Change(cfg, o.interval),
  },

  // --- BLINK ---
  {
    name: 'blink-custom',
    when: o => o.isBlink && o.isCustomColorMode,
    make: (cfg, o) => new BlinkCustom(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'blink-random-static',
    when: o => o.isBlink && o.isRandomColorMode && o.isStaticRandomColorMode,
    make: (cfg, o) => new BlinkRandomStatic(cfg, o.interval),
  },
  {
    name: 'blink-random-change',
    when: o => o.isBlink && o.isRandomColorMode && o.isChangeRandomColorMode,
    make: (cfg, o) => new BlinkRandomChange(cfg, o.interval),
  },

  // --- BREATHE ---
  {
    name: 'breathe-custom',
    when: o => o.isBreathe && o.isCustomColorMode,
    make: (cfg, o) => new BreatheCustom(cfg, o.red, o.green, o.blue, o.interval),
  },

  // --- CREEP ---
  {
    name: 'creep-custom',
    when: o => o.isCreep && o.isCustomColorMode,
    make: (cfg, o) => new CreepCustom(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'creep-random-static',
    when: o => o.isCreep && o.isRandomColorMode && o.isStaticRandomColorMode,
    make: (cfg, o) => new CreepRandomStatic(cfg, o.interval),
  },
  {
    name: 'creep-random-change-everyPixel',
    when: o => o.isCreep && o.isRandomColorMode && o.isChangeRandomColorMode && o.everyPixelColorcolorChangeInterval,
    make: (cfg, o) => new CreepRandomChangePixel(cfg, o.interval),
  },
  {
    name: 'creep-random-change-everyLoop',
    when: o => o.isCreep && o.isRandomColorMode && o.isChangeRandomColorMode && o.everyLoopColorcolorChangeInterval,
    make: (cfg, o) => new CreepRandomChangeLoop(cfg, o.interval),
  },

  // --- WHEEL ---
  {
    name: 'wheel',
    when: o => o.isWheel,
    make: (cfg, o) => new Wheel(cfg, o.interval),
  },

  // --- WALK PIXEL (pixel ON) ---
  {
    name: 'walkPixel-on-custom',
    when: o => o.isWalkPixel && o.pixelOn && o.isCustomColorMode,
    make: (cfg, o) => new WalkPixelOnCustom(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'walkPixel-on-random-static',
    when: o => o.isWalkPixel && o.pixelOn && o.isRandomColorMode && o.isStaticRandomColorMode,
    make: (cfg, o) => new WalkPixelOnRandomStatic(cfg, o.interval),
  },
  {
    name: 'walkPixel-on-random-change-everyPixel',
    when: o => o.isWalkPixel && o.pixelOn && o.isRandomColorMode && o.everyPixelColorcolorChangeInterval,
    make: (cfg, o) => new WalkPixelOnRandomChangePixel(cfg, o.interval),
  },
  {
    name: 'walkPixel-on-random-change-everyLoop',
    when: o => o.isWalkPixel && o.pixelOn && o.isRandomColorMode && o.everyLoopColorcolorChangeInterval,
    make: (cfg, o) => new WalkPixelOnRandomChangeLoop(cfg, o.interval),
  },

  // --- WALK PIXEL (pixel OFF) ---
  {
    name: 'walkPixel-off-custom',
    when: o => o.isWalkPixel && o.pixelOff && o.isCustomColorMode,
    make: (cfg, o) => new WalkPixelOffCustomStatic(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'walkPixel-off-random-change-everyPixel',
    when: o => o.isWalkPixel && o.pixelOff && o.isRandomColorMode && o.everyPixelColorcolorChangeInterval,
    make: (cfg, o) => new WalkPixelOffRandomChangePixel(cfg, o.interval),
  },
  {
    name: 'walkPixel-off-random-change-everyLoop',
    when: o => o.isWalkPixel && o.pixelOff && o.isRandomColorMode && o.everyLoopColorcolorChangeInterval,
    make: (cfg, o) => new WalkPixelOffRandomChangeLoop(cfg, o.interval),
  },

  // --- TURN OFF (explicit command) ---
  {
    name: 'turnOff',
    when: o => o.isOff,
    make: (cfg) => new TurnOff(cfg),
  },
];
