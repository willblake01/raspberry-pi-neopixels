import prompts from 'prompts';
import { setInterval, setTimeout } from 'timers/promises';
import { questions } from './prompts/questions.js';
import { BlinkCustomColor, BlinkRandomColor, Change, CreepCustomColor, CreepRandomColorPixel, CreepRandomColorStrand, SolidCustomColor, SolidRandomColor, WalkOffPixelCustomColor, WalkOffPixelRandomColorPixel, WalkOffPixelRandomColorStrand, WalkPixelCustomColor, WalkPixelRandomColorPixel, WalkPixelRandomColorStrand, Wheel, TurnOff } from './modes/index.js';

(async () => {
  const response = await prompts(questions);
  const { blue, brightness, color, colorChangeInterval, command, green, interval, leds, mode, pixel, red } = response;

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
      const change = new Change(config, intervalValue);
      change.run();
    };

    if (mode === 'creep' && color === 'custom') {
      const creepCustomColor = new CreepCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      creepCustomColor.run();
    };

    if (mode === 'creep' && color === 'random' && colorChangeInterval === 'everyPixel') {
      const creepRandomColorPixel = new CreepRandomColorPixel(config, intervalValue);
      creepRandomColorPixel.run();
    };

    if (mode === 'creep' && color === 'random' && colorChangeInterval === 'everyLoop') {
      const creepRandomColorStrand = new CreepRandomColorStrand(config, interval);
      creepRandomColorStrand.run();
    };

    if (mode === 'blink' && color === 'custom') {
      const blinkCustomColor = new BlinkCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      blinkCustomColor.run();
    };

    if (mode === 'blink' && color === 'random') {
      const blinkRandomColor = new BlinkRandomColor(config, intervalValue);
      blinkRandomColor.run();
    };

    if (mode === 'walk pixel' && pixelState === 1 && color === 'custom') {
      const walkPixelCustomColor = new WalkPixelCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      walkPixelCustomColor.run();
    };

    if (mode === 'walk pixel' && pixelState === 1 && color === 'random' && colorChangeInterval === 'everyPixel') {
      const walkPixelRandomColorPixel = new WalkPixelRandomColorPixel(config, intervalValue);
      walkPixelRandomColorPixel.run();
    };

    if (mode === 'walk pixel' && pixelState === 1 && color === 'random' && colorChangeInterval === 'everyLoop') {
      const walkPixelRandomColorStrand = new WalkPixelRandomColorStrand(config, intervalValue);
      walkPixelRandomColorStrand.run();
    };

    if (mode === 'walk pixel' && pixelState === 0 && color === 'custom') {
      const walkOffPixelCustomColor = new WalkOffPixelCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      walkOffPixelCustomColor.run();
    };

    if (mode === 'walk pixel' && pixelState === 0 && color === 'random' && colorChangeInterval === 'everyPixel') {
      const walkOffPixelRandomColorPixel = new WalkOffPixelRandomColorPixel(config, intervalValue);
      walkOffPixelRandomColorPixel.run();
    };

    if (mode === 'walk pixel' && pixelState === 0 && color === 'random' && colorChangeInterval === 'everyLoop') {
      const walkOffPixelRandomColorStrand = new WalkOffPixelRandomColorStrand(config, intervalValue);
      walkOffPixelRandomColorStrand.run();
    };

    if (mode === 'wheel') {
      const wheel = new Wheel(config, intervalValue);
      wheel.run();
    };

    if (mode === 'sparkle' && sparkleMode === 'creep') {
      const sparkleCreep = new SparkleCreep(config, intervalValue);
      sparkleCreep.run();
    };

    if (mode === 'sparkle' && sparkleMode === 'walk off pixel') {
      const sparkleOffPixel = new SparkleOffPixel(config, intervalValue);
      sparkleOffPixel.run();
    };
  };

  if (command === 0) {
    await setTimeout(timeout);
    const turnOff = new TurnOff(config);
    turnOff.run();
  };
})()
