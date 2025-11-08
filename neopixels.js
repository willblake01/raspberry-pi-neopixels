import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { questions } from './prompts/questions.js';
import { BlinkCustomColor, BlinkRandomColorChange, BlinkRandomColorStatic, BreatheCustomColor, Change, CreepCustomColor, CreepRandomColorChangePixel, CreepRandomColorChangeStrand, CreepRandomColorStatic, SolidCustomColor, SolidRandomColor, WalkOffPixelCustomColor, WalkOffPixelRandomColorPixel, WalkOffPixelRandomColorStrand, WalkPixelCustomColor, WalkPixelRandomColorPixel, WalkPixelRandomColorStrand, Wheel, TurnOff } from './modes/index.js';

const _realReset = ws281x.reset.bind(ws281x);
let _resetCount = 0;
ws281x.reset = () => {
  _resetCount += 1;
  console.trace(`[ws281x.reset] call #${_resetCount}`);
  return _realReset();
};

(async () => {
  const response = await prompts(questions);

  const { blue, brightness, colorMode, colorChangeInterval, command, green, interval, mode, leds, pixelState, randomColorMode, red } = response;

  const config = {
    leds: leds,
    dma: 10,
    brightness: brightness,
    gpio: 18,
    stripType: 'rgb'
  };

  // Set delay
  const timeout = 1000;

  const turnOn = command === 1;
  const turnOff = command === 0;
  const solidMode = mode === 'solid';
  const changeMode = mode === 'change';
  const blinkMode = mode === 'blink';
  const breatheMode = mode === 'breathe';
  const creepMode = mode === 'creep';
  const wheelMode = mode === 'wheel';
  const walkPixelMode = mode === 'walk pixel';
  const staticRandomColorMode = randomColorMode === 'static';
  const changeRandomColorMode = randomColorMode === 'change';
  const customColor = colorMode === 'custom';
  const randomColor = colorMode === 'random';
  const everyPixelChangeInterval = colorChangeInterval === 'everyPixel';
  const everyLoopChangeInterval = colorChangeInterval === 'everyLoop'
  const pixelOn = pixelState === 1;
  const pixelOff = pixelState === 0;

  const manager = new EffectManager(config);

  const handleMode = () => {
    // Solid Mode
    if (solidMode && customColor) {
      const solidCustomColor = new SolidCustomColor(manager.config, red, green, blue);
      manager.start(solidCustomColor);
    };

    if (solidMode && randomColor) {
      const solidRandomColor = new SolidRandomColor(manager.config);
      manager.start(solidRandomColor);
    };

    // Change Mode
    if (changeMode) {
      const change = new Change(manager.config, interval);
      manager.start(change);
    };

    // Blink Mode
    if (blinkMode && customColor) {
      const blinkCustomColor = new BlinkCustomColor(manager.config, interval, red, green, blue);
      manager.start(blinkCustomColor);
    };

    if (blinkMode && randomColor && staticRandomColorMode) {
      const blinkRandomColorStatic = new BlinkRandomColorStatic(manager.config, interval);
      manager.start(blinkRandomColorStatic);
    };

    if (blinkMode && randomColor && changeRandomColorMode) {
      const blinkRandomColorChange = new BlinkRandomColorChange(manager.config, interval);
      manager.start(blinkRandomColorChange);
    };

    // Breathe Mode
    if (breatheMode && customColor) {
      const breatheCustomColor = new BreatheCustomColor(manager.config, red, green, blue, interval);
      manager.start(breatheCustomColor);
    };

    // Creep Mode
    if (creepMode && customColor) {
      const creepCustomColor = new CreepCustomColor(manager.config, interval, red, green, blue);
      manager.start(creepCustomColor);
    };

    if (creepMode && randomColor && staticRandomColorMode) {
      const creepRandomColorStatic = new CreepRandomColorStatic(manager.config, interval);
      manager.start(creepRandomColorStatic);
    };

    if (creepMode && randomColor && changeRandomColorMode && everyPixelChangeInterval) {
      const creepRandomColorChangePixel = new CreepRandomColorChangePixel(manager.config, interval);
      manager.start(creepRandomColorChangePixel);
    };

    if (creepMode && randomColor && changeRandomColorMode && everyLoopChangeInterval) {
      const creepRandomColorChangeStrand = new CreepRandomColorChangeStrand(manager.config, interval);
      manager.start(creepRandomColorChangeStrand);
    };

    // Wheel Mode
    if (wheelMode) {
      const wheel = new Wheel(manager.config, interval);
      manager.start(wheel);
    };

    // Walk Pixel Mode
    if (walkPixelMode && pixelOn && customColor) {
      const walkPixelCustomColor = new WalkPixelCustomColor(manager.config, interval, red, green, blue);
      manager.start(walkPixelCustomColor);
    };

    if (walkPixelMode && pixelOn && randomColor && everyPixelChangeInterval) {
      const walkPixelRandomColorPixel = new WalkPixelRandomColorPixel(manager.config, interval);
      manager.start(walkPixelRandomColorPixel);
    };

    if (walkPixelMode && pixelOn && randomColor && everyLoopChangeInterval) {
      const walkPixelRandomColorStrand = new WalkPixelRandomColorStrand(manager.config, interval);
      manager.start(walkPixelRandomColorStrand);
    };

    if (walkPixelMode && pixelOff && customColor) {
      const walkOffPixelCustomColor = new WalkOffPixelCustomColor(manager.config, interval, red, green, blue);
      manager.start(walkOffPixelCustomColor);
    };

    if (walkPixelMode && pixelOff && randomColor && everyPixelChangeInterval) {
      const walkOffPixelRandomColorPixel = new WalkOffPixelRandomColorPixel(manager.config, interval);
      manager.start(walkOffPixelRandomColorPixel);
    };

    if (walkPixelMode && pixelOff && randomColor && everyLoopChangeInterval) {
      const walkOffPixelRandomColorStrand = new WalkOffPixelRandomColorStrand(manager.config, interval);
      manager.start(walkOffPixelRandomColorStrand);
    };
  };

  const handleCommand = () => {
    if (turnOn) {
      handleMode();
    };

    if (turnOff) {
      const turnOff = new TurnOff(manager.config);
      manager.start(turnOff);
    };
  };

  // Graceful exit hooks
  let shuttingDown = false;

  const shutDown = (reason, err) => {
    if (shuttingDown) return;
    shuttingDown = true;
    try { 
      manager.dispose();
    } finally {
    if (err) { 
      console.error(`[shutdown ${reason}]`, err);
      process.exitCode = 1;
    }
      setTimeout(() => process.exit(), 10);
    }
  };

  process.once('SIGINT', () => shutDown('SIGINT'));
  process.once('SIGTERM', () => shutDown('SIGTERM'));
  process.once('uncaughtException', (err) => shutDown('uncaughtException', err));
  process.once('unhandledRejection', (err) => shutDown('unhandledRejection', err));

  setTimeout(handleCommand, timeout);
})();
