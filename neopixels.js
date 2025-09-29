import prompts from 'prompts';
import { questions } from './prompts/questions.js';
import { BlinkCustomColor, BlinkRandomColorChange, BlinkRandomColorStatic, BreatheCustomColor, Change, CreepCustomColor, CreepRandomColorChangePixel, CreepRandomColorChangeStrand, CreepRandomColorStatic, SolidCustomColor, SolidRandomColor, WalkOffPixelCustomColor, WalkOffPixelRandomColorPixel, WalkOffPixelRandomColorStrand, WalkPixelCustomColor, WalkPixelRandomColorPixel, WalkPixelRandomColorStrand, Wheel, TurnOff } from './modes/index.js';

(async () => {
  const response = await prompts(questions);
  const { blue, brightness, color, colorChangeInterval, command, green, interval, leds, mode, pixel, randomColorMode, red } = response;

  const pixelState = parseInt(pixel, 10);
  const pixelCount = parseInt(leds, 10);
  const brightnessValue = parseInt(brightness, 10);
  const intervalValue = parseInt(interval, 10);
  const redValue = parseInt(red, 10);
  const greenValue = parseInt(green, 10);
  const blueValue = parseInt(blue, 10);

  const config = {
    leds: pixelCount,
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

  const handleMode = () => {
    // Solid Mode
    if (solidMode && customColor) {
      const solidCustomColor = new SolidCustomColor(config, redValue, greenValue, blueValue);
      solidCustomColor.run();
    };

    if (solidMode && randomColor) {
      const solidRandomColor = new SolidRandomColor(config);
      solidRandomColor.run();
    };

    // Change Mode
    if (changeMode) {
      const change = new Change(config, intervalValue);
      change.run();
    };

    // Blink Mode
    if (blinkMode && customColor) {
      const blinkCustomColor = new BlinkCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      blinkCustomColor.run();
    };

    if (blinkMode && randomColor && staticRandomColorMode) {
      const blinkRandomColorStatic = new BlinkRandomColorStatic(config, intervalValue);
      blinkRandomColorStatic.run();
    };

    if (blinkMode && randomColor && changeRandomColorMode) {
      const blinkRandomColorChange = new BlinkRandomColorChange(config, intervalValue);
      blinkRandomColorChange.run();
    };

    // Breathe Mode
    if (breatheMode && customColor) {
      const breatheCustomColor = new BreatheCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      breatheCustomColor.run();
    };

    // Creep Mode
    if (creepMode && customColor) {
      const creepCustomColor = new CreepCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      creepCustomColor.run();
    };

    if (creepMode && randomColor && staticRandomColorMode) {
      const creepRandomColorStatic = new CreepRandomColorStatic(config, intervalValue);
      creepRandomColorStatic.run();
    };

    if (creepMode && randomColor && changeRandomColorMode && everyPixelChangeInterval) {
      const creepRandomColorChangePixel = new CreepRandomColorChangePixel(config, intervalValue);
      creepRandomColorChangePixel.run();
    };

    if (creepMode && randomColor && changeRandomColorMode && everyLoopChangeInterval) {
      const creepRandomColorChangeStrand = new CreepRandomColorChangeStrand(config, interval);
      creepRandomColorChangeStrand.run();
    };

    // Wheel Mode
    if (wheelMode) {
      const wheel = new Wheel(config, intervalValue);
      wheel.run();
    };

    // Walk Pixel Mode
    if (walkPixelMode && pixelOn && customColor) {
      const walkPixelCustomColor = new WalkPixelCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      walkPixelCustomColor.run();
    };

    if (walkPixelMode && pixelOn && randomColor && everyLoopChangeInterval) {
      const walkPixelRandomColorPixel = new WalkPixelRandomColorPixel(config, intervalValue);
      walkPixelRandomColorPixel.run();
    };

    if (walkPixelMode && pixelOn && randomColor && everyLoopChangeInterval) {
      const walkPixelRandomColorStrand = new WalkPixelRandomColorStrand(config, intervalValue);
      walkPixelRandomColorStrand.run();
    };

    if (walkPixelMode && pixelOff && customColor) {
      const walkOffPixelCustomColor = new WalkOffPixelCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      walkOffPixelCustomColor.run();
    };

    if (walkPixelMode && pixelOff && randomColor && everyPixelChangeInterval) {
      const walkOffPixelRandomColorPixel = new WalkOffPixelRandomColorPixel(config, intervalValue);
      walkOffPixelRandomColorPixel.run();
    };

    if (walkPixelMode && pixelOff && randomColor && everyLoopChangeInterval) {
      const walkOffPixelRandomColorStrand = new WalkOffPixelRandomColorStrand(config, intervalValue);
      walkOffPixelRandomColorStrand.run();
    };
  };

  const handleCommand = () => {
    if (turnOn) {
      handleMode();
    };

    if (turnOff) {
      const turnOff = new TurnOff(config);
      turnOff.run();
    };
  };

  setTimeout(handleCommand, timeout);
})();
