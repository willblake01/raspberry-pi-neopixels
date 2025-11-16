import { BlinkCustom, BlinkRandomChange, BlinkRandomStatic, BreatheCustom, Change, CreepCustom, CreepRandomChangePixel, CreepRandomChangeLoop, CreepRandomStatic, SolidCustom, SolidRandom, WalkPixelOffCustomStatic, WalkPixelOffRandomChangeLoop, WalkPixelOffRandomChangePixel, WalkPixelOnCustom, WalkPixelOnRandomChangePixel, WalkPixelOnRandomChangeLoop, WalkPixelOnRandomStatic, Wheel, TurnOff } from '../index.js';
import { randomNumber } from '../../utils/utils.js';
import { Options } from '../../types/index.js';

const randomColorValue = randomNumber(255);

interface Rule {
  name: string;
  when: (options: Options) => boolean;
  make: (config: any, options: Options) => any;
};

export const RULES: Rule[] = [
  // --- SOLID ---
  {
    name: 'solid-custom',
    when: options => options.isSolid && options.isCustomColorMode,
    make: (config, options) => new SolidCustom(config, options.red, options.green, options.blue),
  },
  {
    name: 'solid-random',
    when: options => options.isSolid && options.isRandomColorMode,
    make: config => new SolidRandom(config, randomColorValue, randomColorValue, randomColorValue),
  },

  // --- CHANGE ---
  {
    name: 'change',
    when: options => options.isChange,
    make: (config, options) => new Change(config, options.interval, randomColorValue, randomColorValue, randomColorValue),
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
    make: (config, options) => new BlinkRandomStatic(config, options.interval, randomColorValue, randomColorValue, randomColorValue),
  },
  {
    name: 'blink-random-change',
    when: options => options.isBlink && options.isRandomColorMode && options.isChangeRandomColorMode,
    make: (config, options) => new BlinkRandomChange(config, options.interval, randomColorValue, randomColorValue, randomColorValue),
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
    when: options => options.isCreep && options.isRandomColorMode && options.isChangeRandomColorMode && options.everyPixelColorChangeInterval,
    make: (config, options) => new CreepRandomChangePixel(config, options.interval),
  },
  {
    name: 'creep-random-change-everyLoop',
    when: options => options.isCreep && options.isRandomColorMode && options.isChangeRandomColorMode && options.everyLoopColorChangeInterval,
    make: (config, options) => new CreepRandomChangeLoop(config, options.interval),
  },

  // --- WHEEL ---
  {
    name: 'wheel',
    when: options => options.isWheel,
    make: (config, options) => new Wheel(config, options.interval, randomColorValue, randomColorValue, randomColorValue),
  },

  // --- WALK PIXEL (pixel ON) ---
  {
    name: 'walkPixel-on-custom',
    when: options => options.isWalkPixel && options.pixelState === 1 && options.isCustomColorMode,
    make: (config, options) => new WalkPixelOnCustom(config, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'walkPixel-on-random-static',
    when: options => options.isWalkPixel && options.pixelState === 1 && options.isRandomColorMode && options.isStaticRandomColorMode,
    make: (config, options) => new WalkPixelOnRandomStatic(config, options.interval, randomColorValue, randomColorValue, randomColorValue),
  },
  {
    name: 'walkPixel-on-random-change-everyPixel',
    when: options => options.isWalkPixel && options.pixelState === 1 && options.isRandomColorMode && options.everyPixelColorChangeInterval,
    make: (config, options) => new WalkPixelOnRandomChangePixel(config, options.interval, randomColorValue, randomColorValue, randomColorValue),
  },
  {
    name: 'walkPixel-on-random-change-everyLoop',
    when: options => options.isWalkPixel && options.pixelState === 1 && options.isRandomColorMode && options.everyLoopColorChangeInterval,
    make: (config, options) => new WalkPixelOnRandomChangeLoop(config, options.interval, 0, 0, 0),
  },

  // --- WALK PIXEL (pixel OFF) ---
  {
    name: 'walkPixel-off-custom',
    when: options => options.isWalkPixel && options.pixelState === 0 && options.isCustomColorMode,
    make: (config, options) => new WalkPixelOffCustomStatic(config, options.interval, options.red, options.green, options.blue),
  },
  {
    name: 'walkPixel-off-random-change-everyPixel',
    when: options => options.isWalkPixel && options.pixelState === 0 && options.isRandomColorMode && options.everyPixelColorChangeInterval,
    make: (config, options) => new WalkPixelOffRandomChangePixel(config, options.interval, randomColorValue, randomColorValue, randomColorValue),
  },
  {
    name: 'walkPixel-off-random-change-everyLoop',
    when: options => options.isWalkPixel && options.pixelState === 0 && options.isRandomColorMode && options.everyLoopColorChangeInterval,
    make: (config, options) => new WalkPixelOffRandomChangeLoop(config, options.interval, randomColorValue, randomColorValue, randomColorValue),
  },

  // --- TURN OFF (explicit command) ---
  {
    name: 'turn-off',
    when: options => options.isOff,
    make: (config) => new TurnOff(config),
  },
];
