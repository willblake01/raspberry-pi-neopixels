import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { questions } from './prompts/questions.js';
import { BlinkCustomColor, BlinkRandomColorChange, BlinkRandomColorStatic, BreatheCustomColor, Change, CreepCustomColor, CreepRandomColorChangePixel, CreepRandomColorChangeStrand, CreepRandomColorStatic, SolidCustomColor, SolidRandomColor, WalkOffPixelCustomColor, WalkOffPixelRandomColorPixel, WalkOffPixelRandomColorStrand, WalkPixelCustomColor, WalkPixelRandomColorPixel, WalkPixelRandomColorStrand, Wheel, TurnOff } from './modes/index.js';

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
      const solidCustomColor = new SolidCustomColor(config.leds, red, green, blue);
      manager.start(solidCustomColor);
    };

    if (solidMode && randomColor) {
      const solidRandomColor = new SolidRandomColor(config.leds);
      manager.start(solidRandomColor);
    };

    // Change Mode
    if (changeMode) {
      const change = new Change(config.leds, interval);
      manager.start(change);
    };

    // Blink Mode
    if (blinkMode && customColor) {
      const blinkCustomColor = new BlinkCustomColor(config.leds, interval, red, green, blue);
      manager.start(blinkCustomColor);
    };

    if (blinkMode && randomColor && staticRandomColorMode) {
      const blinkRandomColorStatic = new BlinkRandomColorStatic(config.leds, interval);
      manager.start(blinkRandomColorStatic);
    };

    if (blinkMode && randomColor && changeRandomColorMode) {
      const blinkRandomColorChange = new BlinkRandomColorChange(config.leds, interval);
      manager.start(blinkRandomColorChange);
    };

    // Breathe Mode
    if (breatheMode && customColor) {
      const breatheCustomColor = new BreatheCustomColor(config.leds, config.brightness, red, green, blue, interval);
      manager.start(breatheCustomColor);
    };

    // Creep Mode
    if (creepMode && customColor) {
      const creepCustomColor = new CreepCustomColor(config.leds, interval, red, green, blue);
      manager.start(creepCustomColor);
    };

    if (creepMode && randomColor && staticRandomColorMode) {
      const creepRandomColorStatic = new CreepRandomColorStatic(config.leds, interval);
      manager.start(creepRandomColorStatic);
    };

    if (creepMode && randomColor && changeRandomColorMode && everyPixelChangeInterval) {
      const creepRandomColorChangePixel = new CreepRandomColorChangePixel(config.leds, interval);
      manager.start(creepRandomColorChangePixel);
    };

    if (creepMode && randomColor && changeRandomColorMode && everyLoopChangeInterval) {
      const creepRandomColorChangeStrand = new CreepRandomColorChangeStrand(config.leds, interval);
      manager.start(creepRandomColorChangeStrand);
    };

    // Wheel Mode
    if (wheelMode) {
      const wheel = new Wheel(config.leds, interval);
      manager.start(wheel);
    };

    // Walk Pixel Mode
    if (walkPixelMode && pixelOn && customColor) {
      const walkPixelCustomColor = new WalkPixelCustomColor(config.leds, interval, red, green, blue);
      manager.start(walkPixelCustomColor);
    };

    if (walkPixelMode && pixelOn && randomColor && everyLoopChangeInterval) {
      const walkPixelRandomColorPixel = new WalkPixelRandomColorPixel(config.leds, interval);
      manager.start(walkPixelRandomColorPixel);
    };

    if (walkPixelMode && pixelOn && randomColor && everyLoopChangeInterval) {
      const walkPixelRandomColorStrand = new WalkPixelRandomColorStrand(config.leds, interval);
      manager.start(walkPixelRandomColorStrand);
    };

    if (walkPixelMode && pixelOff && customColor) {
      const walkOffPixelCustomColor = new WalkOffPixelCustomColor(config.leds, interval, red, green, blue);
      manager.start(walkOffPixelCustomColor);
    };

    if (walkPixelMode && pixelOff && randomColor && everyPixelChangeInterval) {
      const walkOffPixelRandomColorPixel = new WalkOffPixelRandomColorPixel(config.leds, interval);
      manager.start(walkOffPixelRandomColorPixel);
    };

    if (walkPixelMode && pixelOff && randomColor && everyLoopChangeInterval) {
      const walkOffPixelRandomColorStrand = new WalkOffPixelRandomColorStrand(config.leds, interval);
      manager.start(walkOffPixelRandomColorStrand);
    };
  };

  const handleCommand = () => {
    if (turnOn) {
      handleMode();
    };

    if (turnOff) {
      const turnOff = new TurnOff(config.leds);
      manager.start(turnOff);
    };
  };

  setTimeout(handleCommand, timeout);
})();
