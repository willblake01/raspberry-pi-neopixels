import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { questions } from './prompts/questions.js';
import { BlinkCustomColor, BlinkRandomColorChange, BlinkRandomColorStatic, BreatheCustomColor, Change, CreepCustomColor, CreepRandomColorChangePixel, CreepRandomColorChangeStrand, CreepRandomColorStatic, SolidCustomColor, SolidRandomColor, WalkOffPixelCustomColor, WalkOffPixelRandomColorPixel, WalkOffPixelRandomColorStrand, WalkPixelCustomColor, WalkPixelRandomColorPixel, WalkPixelRandomColorStrand, Wheel, TurnOff } from './modes/index.js';

(async () => {
  const response = await prompts(questions);
  const { blueValue, brightnessValue, color, colorChangeInterval, command, greenValue, interval, mode, numLeds, pixelState, randomColorMode, redValue } = response;

  const config = {
    numPixels: numLeds,
    dma: 10,
    brightness: brightnessValue,
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
  const customColor = color === 'custom';
  const randomColor = color === 'random';
  const everyPixelChangeInterval = colorChangeInterval === 'everyPixel';
  const everyLoopChangeInterval = colorChangeInterval === 'everyLoop'
  const pixelOn = pixelState === 1;
  const pixelOff = pixelState === 0;

  const manager = new EffectManager(config);

  const handleMode = () => {
    // Solid Mode
    if (solidMode && customColor) {
      const solidCustomColor = new SolidCustomColor(config.numPixels, redValue, greenValue, blueValue);
      manager.start(solidCustomColor);
    };

    if (solidMode && randomColor) {
      const solidRandomColor = new SolidRandomColor(config.numPixels);
      manager.start(solidRandomColor);
    };

    // Change Mode
    if (changeMode) {
      const change = new Change(config.numPixels, interval);
      manager.start(change);
    };

    // Blink Mode
    if (blinkMode && customColor) {
      const blinkCustomColor = new BlinkCustomColor(config.numPixels, interval, redValue, greenValue, blueValue);
      manager.start(blinkCustomColor);
    };

    if (blinkMode && randomColor && staticRandomColorMode) {
      const blinkRandomColorStatic = new BlinkRandomColorStatic(config.numPixels, interval);
      manager.start(blinkRandomColorStatic);
    };

    if (blinkMode && randomColor && changeRandomColorMode) {
      const blinkRandomColorChange = new BlinkRandomColorChange(config.numPixels, interval);
      manager.start(blinkRandomColorChange);
    };

    // Breathe Mode
    if (breatheMode && customColor) {
      const breatheCustomColor = new BreatheCustomColor(config.numPixels, config.brightness, redValue, greenValue, blueValue, interval);
      manager.start(breatheCustomColor);
    };

    // Creep Mode
    if (creepMode && customColor) {
      const creepCustomColor = new CreepCustomColor(config.numPixels, interval, redValue, greenValue, blueValue);
      manager.start(creepCustomColor);
    };

    if (creepMode && randomColor && staticRandomColorMode) {
      const creepRandomColorStatic = new CreepRandomColorStatic(config.numPixels, interval);
      manager.start(creepRandomColorStatic);
    };

    if (creepMode && randomColor && changeRandomColorMode && everyPixelChangeInterval) {
      const creepRandomColorChangePixel = new CreepRandomColorChangePixel(config.numPixels, interval);
      manager.start(creepRandomColorChangePixel);
    };

    if (creepMode && randomColor && changeRandomColorMode && everyLoopChangeInterval) {
      const creepRandomColorChangeStrand = new CreepRandomColorChangeStrand(config.numPixels, interval);
      manager.start(creepRandomColorChangeStrand);
    };

    // Wheel Mode
    if (wheelMode) {
      const wheel = new Wheel(config.numPixels, interval);
      manager.start(wheel);
    };

    // Walk Pixel Mode
    if (walkPixelMode && pixelOn && customColor) {
      const walkPixelCustomColor = new WalkPixelCustomColor(config.numPixels, interval, redValue, greenValue, blueValue);
      manager.start(walkPixelCustomColor);
    };

    if (walkPixelMode && pixelOn && randomColor && everyLoopChangeInterval) {
      const walkPixelRandomColorPixel = new WalkPixelRandomColorPixel(config.numPixels, interval);
      manager.start(walkPixelRandomColorPixel);
    };

    if (walkPixelMode && pixelOn && randomColor && everyLoopChangeInterval) {
      const walkPixelRandomColorStrand = new WalkPixelRandomColorStrand(config.numPixels, interval);
      manager.start(walkPixelRandomColorStrand);
    };

    if (walkPixelMode && pixelOff && customColor) {
      const walkOffPixelCustomColor = new WalkOffPixelCustomColor(config.numPixels, interval, redValue, greenValue, blueValue);
      manager.start(walkOffPixelCustomColor);
    };

    if (walkPixelMode && pixelOff && randomColor && everyPixelChangeInterval) {
      const walkOffPixelRandomColorPixel = new WalkOffPixelRandomColorPixel(config.numPixels, interval);
      manager.start(walkOffPixelRandomColorPixel);
    };

    if (walkPixelMode && pixelOff && randomColor && everyLoopChangeInterval) {
      const walkOffPixelRandomColorStrand = new WalkOffPixelRandomColorStrand(config.numPixels, interval);
      manager.start(walkOffPixelRandomColorStrand);
    };
  };

  const handleCommand = () => {
    if (turnOn) {
      handleMode();
    };

    if (turnOff) {
      const turnOff = new TurnOff(config);
      manager.start(turnOff);
    };
  };

  setTimeout(handleCommand, timeout);
})();
