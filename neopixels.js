import prompts from 'prompts';
import { setInterval, setTimeout } from 'timers/promises';
import { questions } from './prompts/questions.js';
import { BlinkCustomColor, BlinkRandomColorChange, BlinkRandomColorStatic, Change, CreepCustomColor, CreepRandomColorChangePixel, CreepRandomColorChangeStrand, CreepRandomColorStatic, SolidCustomColor, SolidRandomColor, WalkOffPixelCustomColor, WalkOffPixelRandomColorPixel, WalkOffPixelRandomColorStrand, WalkPixelCustomColor, WalkPixelRandomColorPixel, WalkPixelRandomColorStrand, Wheel, TurnOff } from './modes/index.js';

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

  if (command === 1) {
    if (mode === 'solid' && color === 'custom') {
      await setTimeout(timeout);
      const solidCustomColor = new SolidCustomColor(config, redValue, greenValue, blueValue);
      solidCustomColor.run();
    };

    if (mode === 'solid' && color === 'random') {
      await setTimeout(timeout);
      const solidRandomColor = new SolidRandomColor(config);
      solidRandomColor.run();
    };

    if (mode === 'change') {
      await setTimeout(timeout);
      const change = new Change(config, intervalValue);
      change.run();
    };

    if (mode === 'blink' && color === 'custom') {
      await setTimeout(timeout);
      const blinkCustomColor = new BlinkCustomColor(config, intervalValue);
      blinkCustomColor.run();
    };

    if (mode === 'blink' && color === 'random' && randomColorMode === 'static') {
      await setTimeout(timeout);
      const blinkRandomColorStatic = new BlinkRandomColorStatic(config, intervalValue);
      blinkRandomColorStatic.run();
    };

    if (mode === 'blink' && color === 'random' && randomColorMode === 'change') {
      await setTimeout(timeout);
      const blinkRandomColorChange = new BlinkRandomColorChange(config, intervalValue);
      blinkRandomColorChange.run();
    };

    if (mode === 'creep' && color === 'custom') {
      await setTimeout(timeout);
      const creepCustomColor = new CreepCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      creepCustomColor.run();
    };

    if (mode === 'creep' && color === 'random' && randomColorMode === 'static') {
      await setTimeout(timeout);
      const creepRandomColorStatic = new CreepRandomColorStatic(config, intervalValue);
      creepRandomColorStatic.run();
    };

    if (mode === 'creep' && color === 'random' && randomColorMode === 'change' && colorChangeInterval === 'everyPixel') {
      await setTimeout(timeout);
      const creepRandomColorChangePixel = new CreepRandomColorChangePixel(config, intervalValue);
      creepRandomColorChangePixel.run();
    };

    if (mode === 'creep' && color === 'random' && randomColorMode === 'change' && colorChangeInterval === 'everyLoop') {
      await setTimeout(timeout);
      const creepRandomColorChangeStrand = new CreepRandomColorChangeStrand(config, interval);
      creepRandomColorChangeStrand.run();
    };

    if (mode === 'wheel') {
      await setTimeout(timeout);
      const wheel = new Wheel(config, intervalValue);
      wheel.run();
    };

    if (mode === 'walk pixel' && pixelState === 1 && color === 'custom') {
      await setTimeout(timeout);
      const walkPixelCustomColor = new WalkPixelCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      walkPixelCustomColor.run();
    };

    if (mode === 'walk pixel' && pixelState === 1 && color === 'random' && colorChangeInterval === 'everyPixel') {
      await setTimeout(timeout);
      const walkPixelRandomColorPixel = new WalkPixelRandomColorPixel(config, intervalValue);
      walkPixelRandomColorPixel.run();
    };

    if (mode === 'walk pixel' && pixelState === 1 && color === 'random' && colorChangeInterval === 'everyLoop') {
      await setTimeout(timeout);
      const walkPixelRandomColorStrand = new WalkPixelRandomColorStrand(config, intervalValue);
      walkPixelRandomColorStrand.run();
    };

    if (mode === 'walk pixel' && pixelState === 0 && color === 'custom') {
      await setTimeout(timeout);
      const walkOffPixelCustomColor = new WalkOffPixelCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      walkOffPixelCustomColor.run();
    };

    if (mode === 'walk pixel' && pixelState === 0 && color === 'random' && colorChangeInterval === 'everyPixel') {
      await setTimeout(timeout);
      const walkOffPixelRandomColorPixel = new WalkOffPixelRandomColorPixel(config, intervalValue);
      walkOffPixelRandomColorPixel.run();
    };

    if (mode === 'walk pixel' && pixelState === 0 && color === 'random' && colorChangeInterval === 'everyLoop') {
      await setTimeout(timeout);
      const walkOffPixelRandomColorStrand = new WalkOffPixelRandomColorStrand(config, intervalValue);
      walkOffPixelRandomColorStrand.run();
    };
  };

  if (command === 0) {
    await setTimeout(timeout);
    const turnOff = new TurnOff(config);
    turnOff.run();
  };
})()
