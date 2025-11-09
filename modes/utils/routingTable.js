import { BlinkCustomColor, BlinkRandomColorChange, BlinkRandomColorStatic, BreatheCustomColor, Change, CreepCustomColor, CreepRandomColorChangePixel, CreepRandomColorChangeStrand, CreepRandomColorStatic, SolidCustomColor, SolidRandomColor, WalkOffPixelCustomColor, WalkOffPixelRandomColorPixel, WalkOffPixelRandomColorStrand, WalkPixelCustomColor, WalkPixelRandomColorPixel, WalkPixelRandomColorStrand, Wheel, TurnOff } from '../index.js';

export const RULES = [
  // --- SOLID ---
  {
    name: 'solid-custom',
    when: o => o.isSolid && o.isCustom,
    make: (cfg, o) => new SolidCustomColor(cfg, o.red, o.green, o.blue),
  },
  {
    name: 'solid-random',
    when: o => o.isSolid && o.isRandom,
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
    when: o => o.isBlink && o.isCustom,
    make: (cfg, o) => new BlinkCustomColor(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'blink-random-static',
    when: o => o.isBlink && o.isRandom && o.isStaticRC,
    make: (cfg, o) => new BlinkRandomColorStatic(cfg, o.interval),
  },
  {
    name: 'blink-random-change',
    when: o => o.isBlink && o.isRandom && o.isChangeRC,
    make: (cfg, o) => new BlinkRandomColorChange(cfg, o.interval),
  },

  // --- BREATHE ---
  {
    name: 'breathe-custom',
    when: o => o.isBreathe && o.isCustom,
    make: (cfg, o) => new BreatheCustomColor(cfg, o.red, o.green, o.blue, o.interval),
  },

  // --- CREEP ---
  {
    name: 'creep-custom',
    when: o => o.isCreep && o.isCustom,
    make: (cfg, o) => new CreepCustomColor(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'creep-random-static',
    when: o => o.isCreep && o.isRandom && o.isStaticRC,
    make: (cfg, o) => new CreepRandomColorStatic(cfg, o.interval),
  },
  {
    name: 'creep-random-change-everyPixel',
    when: o => o.isCreep && o.isRandom && o.isChangeRC && o.everyPixel,
    make: (cfg, o) => new CreepRandomColorChangePixel(cfg, o.interval),
  },
  {
    name: 'creep-random-change-everyLoop',
    when: o => o.isCreep && o.isRandom && o.isChangeRC && o.everyLoop,
    make: (cfg, o) => new CreepRandomColorChangeStrand(cfg, o.interval),
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
    when: o => o.isWalkPixel && o.pixelOn && o.isCustom,
    make: (cfg, o) => new WalkPixelCustomColor(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'walkPixel-on-random-everyPixel',
    when: o => o.isWalkPixel && o.pixelOn && o.isRandom && o.everyPixel,
    make: (cfg, o) => new WalkPixelRandomColorPixel(cfg, o.interval),
  },
  {
    name: 'walkPixel-on-random-everyLoop',
    when: o => o.isWalkPixel && o.pixelOn && o.isRandom && o.everyLoop,
    make: (cfg, o) => new WalkPixelRandomColorStrand(cfg, o.interval),
  },

  // --- WALK PIXEL (pixel OFF) ---
  {
    name: 'walkPixel-off-custom',
    when: o => o.isWalkPixel && o.pixelOff && o.isCustom,
    make: (cfg, o) => new WalkOffPixelCustomColor(cfg, o.interval, o.red, o.green, o.blue),
  },
  {
    name: 'walkPixel-off-random-everyPixel',
    when: o => o.isWalkPixel && o.pixelOff && o.isRandom && o.everyPixel,
    make: (cfg, o) => new WalkOffPixelRandomColorPixel(cfg, o.interval),
  },
  {
    name: 'walkPixel-off-random-everyLoop',
    when: o => o.isWalkPixel && o.pixelOff && o.isRandom && o.everyLoop,
    make: (cfg, o) => new WalkOffPixelRandomColorStrand(cfg, o.interval),
  },

  // --- TURN OFF (explicit command) ---
  {
    name: 'turnOff',
    when: o => o.isOff,
    make: (cfg) => new TurnOff(cfg),
  },
];
