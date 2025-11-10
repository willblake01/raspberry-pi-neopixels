import { BlinkCustomColor, BlinkRandomColorChange, BlinkRandomColorStatic, BreatheCustomColor, Change, CreepCustomColor, CreepRandomColorChangePixel, CreepRandomColorChangeLoop, CreepRandomColorStatic, SolidCustomColor, SolidRandomColor, WalkPixelOffCustomColor, WalkPixelOffRandomColorLoop, WalkPixelOffRandomColorPixel, WalkPixelOnCustomColor, WalkPixelOnRandomColorPixel, WalkPixelOnRandomColorLoop, Wheel, TurnOff } from '../index.js';

export const RULES = [
  // --- SOLID ---
  {
    name: 'solid-custom',
    when: o => o.isSolid && o.isCustomColorMode,
    make: (cfg, o) => new SolidCustomColor(cfg, o.red, o.green, o.blue),
  },
  {
    name: 'solid-random',
    when: o => o.isSolid && o.isRandomColorMode,
    make: (cfg) => new SolidRandomColor(cfg),
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
    make: (cfg, o) => new BlinkCustomColor(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'blink-random-static',
    when: o => o.isBlink && o.isRandomColorMode && o.isStaticRandomColorMode,
    make: (cfg, o) => new BlinkRandomColorStatic(cfg, o.interval),
  },
  {
    name: 'blink-random-change',
    when: o => o.isBlink && o.isRandomColorMode && o.isChangeRandomColorMode,
    make: (cfg, o) => new BlinkRandomColorChange(cfg, o.interval),
  },

  // --- BREATHE ---
  {
    name: 'breathe-custom',
    when: o => o.isBreathe && o.isCustomColorMode,
    make: (cfg, o) => new BreatheCustomColor(cfg, o.red, o.green, o.blue, o.interval),
  },

  // --- CREEP ---
  {
    name: 'creep-custom',
    when: o => o.isCreep && o.isCustomColorMode,
    make: (cfg, o) => new CreepCustomColor(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'creep-random-static',
    when: o => o.isCreep && o.isRandomColorMode && o.isStaticRandomColorMode,
    make: (cfg, o) => new CreepRandomColorStatic(cfg, o.interval),
  },
  {
    name: 'creep-random-change-everyPixel',
    when: o => o.isCreep && o.isRandomColorMode && o.isChangeRandomColorMode && o.everyPixelColorChangeInterval,
    make: (cfg, o) => new CreepRandomColorChangePixel(cfg, o.interval),
  },
  {
    name: 'creep-random-change-everyLoop',
    when: o => o.isCreep && o.isRandomColorMode && o.isChangeRandomColorMode && o.everyLoopColorChangeInterval,
    make: (cfg, o) => new CreepRandomColorChangeLoop(cfg, o.interval),
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
    make: (cfg, o) => new WalkPixelOnCustomColor(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'walkPixel-on-random-everyPixel',
    when: o => o.isWalkPixel && o.pixelOn && o.isRandomColorMode && o.everyPixelColorChangeInterval,
    make: (cfg, o) => new WalkPixelOnRandomColorPixel(cfg, o.interval),
  },
  {
    name: 'walkPixel-on-random-everyLoop',
    when: o => o.isWalkPixel && o.pixelOn && o.isRandomColorMode && o.everyLoopColorChangeInterval,
    make: (cfg, o) => new WalkPixelOnRandomColorLoop(cfg, o.interval),
  },

  // --- WALK PIXEL (pixel OFF) ---
  {
    name: 'walkPixel-off-custom',
    when: o => o.isWalkPixel && o.pixelOff && o.isCustomColorMode,
    make: (cfg, o) => new WalkPixelOffCustomColor(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'walkPixel-off-random-everyPixel',
    when: o => o.isWalkPixel && o.pixelOff && o.isRandomColorMode && o.everyPixelColorChangeInterval,
    make: (cfg, o) => new WalkPixelOffRandomColorPixel(cfg, o.interval),
  },
  {
    name: 'walkPixel-off-random-everyLoop',
    when: o => o.isWalkPixel && o.pixelOff && o.isRandomColorMode && o.everyLoopColorChangeInterval,
    make: (cfg, o) => new WalkPixelOffRandomColorLoop(cfg, o.interval),
  },

  // --- TURN OFF (explicit command) ---
  {
    name: 'turnOff',
    when: o => o.isOff,
    make: (cfg) => new TurnOff(cfg),
  },
];
