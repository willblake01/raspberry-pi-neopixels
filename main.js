import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { questions } from './prompts/questions.js';
import { BlinkCustomColor, BlinkRandomColorChange, BlinkRandomColorStatic, BreatheCustomColor, Change, CreepCustomColor, CreepRandomColorChangePixel, CreepRandomColorChangeStrand, CreepRandomColorStatic, SolidCustomColor, SolidRandomColor, WalkOffPixelCustomColor, WalkOffPixelRandomColorPixel, WalkOffPixelRandomColorStrand, WalkPixelCustomColor, WalkPixelRandomColorPixel, WalkPixelRandomColorStrand, Wheel, TurnOff } from './modes/index.js';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

const once = (fn) => {
  let called = false;
  return (...args) => { if (called) return; called = true; return fn(...args); };
};

const normalizeAnsers = (res) => {
  const {blue, brightness, colorMode, colorChangeInterval, command, green, interval, mode, leds, pixelState, randomColorMode, red} = res;

  return {
    leds,
    brightness,
    interval,
    red,
    green,
    blue,
    command,
    mode,
    colorMode,
    randomColorMode,
    colorChangeInterval,
    pixelState,
    isOn: command === 1,
    isOff: command === 0,
    isSolid: mode === 'solid',
    isChange: mode === 'change',
    isBlink: mode === 'blink',
    isBreathe: mode === 'breathe',
    isCreep: mode === 'creep',
    isWheel: mode === 'wheel',
    isWalkPixel: mode === 'walk pixel',
    isCustom: colorMode === 'custom',
    isRandom: colorMode === 'random',
    isStaticRC: randomColorMode === 'static',
    isChangeRC: randomColorMode === 'change',
    everyPixel: colorChangeInterval === 'everyPixel',
    everyLoop: colorChangeInterval === 'everyLoop',
    pixelOn: pixelState === 1,
    pixelOff: pixelState === 0 
  };
};

const RULES = [
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

const selectEffect = (config, opts) => {
  if (opts.isOff) return new TurnOff(config);
  const rule = RULES.find(r => r.when(opts));
  if (!rule) return new TurnOff(config);
  return rule.make(config, opts);
};

const main = async () => {
  const response = await prompts(questions);
  const options = normalizeAnsers(response);

  const config = {
    leds:options.leds,
    dma: 10,
    brightness: options.brightness,
    gpio: 18,
    stripType: 'rgb'
  };

  const manager = new EffectManager(config);

  const shutDown = once(async (reason, err) => {
    try { 
      await manager.dispose();
    } finally {
      if (err) { 
        console.error(`[shutdown ${reason}]`, err);
        process.exitCode = 1;
      }
      setTimeout(() => process.exit(), 10);
    }
  });

  process.once('SIGINT', () => shutDown('SIGINT'));
  process.once('SIGTERM', () => shutDown('SIGTERM'));
  process.once('uncaughtException', (err) => shutDown('uncaughtException', err));
  process.once('unhandledRejection', (err) => shutDown('unhandledRejection', err));

  await delay(1000);

  const effect = selectEffect(manager.config, options);
  await manager.start(effect);
};

main().catch(err => {
  console.error('[fatal]', err);
  process.exitCode = 1;
});
