import prompts from 'prompts';
import { setInterval, setTimeout } from 'timers/promises';
import { questions } from './prompts/questions.js';
import { BlinkCustomColor, BlinkRandomColor, SolidCustomColor, SolidRandomColor, WalkSingleOffPixelCustomColor, WalkSingleOffPixelRandomColor, WalkSinglePixelCustomColor, WalkSinglePixelRandomColor, TurnOff } from './modes/index.js';

(async () => {
  const response = await prompts(questions);
  const { color, command, interval, mode, pixel, leds, brightness, red, green, blue } = response;

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

    if (mode === 'blink' && color === 'custom') {
      const blinkCustomColor = new BlinkCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      blinkCustomColor.run();
    };

    if (mode === 'blink' && color === 'random') {
      const blinkRandomColor = new BlinkRandomColor(config, intervalValue);
      blinkRandomColor.run();
    };

    if (mode === 'walk pixel' && pixelState === 1 && color === 'custom') {
      const walkSinglePixelCustomColor = new WalkSinglePixelCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      walkSinglePixelCustomColor.run();
    };

    if (mode === 'walk pixel' && pixelState === 1 && color === 'random') {
      const walkSinglePixelRandomColor = new WalkSinglePixelRandomColor(config, intervalValue);
      walkSinglePixelRandomColor.run();
    };

    if (mode === 'walk pixel' && pixelState === 0 && color === 'custom') {
      const walkSingleOffPixelCustomColor = new WalkSingleOffPixelCustomColor(config, intervalValue, redValue, greenValue, blueValue);
      walkSingleOffPixelCustomColor.run();
    };

    if (mode === 'walk pixel' && pixelState === 0 && color === 'random') {
      const walkSingleOffPixelRandomColor = new WalkSingleOffPixelRandomColor(config, intervalValue);
      walkSingleOffPixelRandomColor.run();
    };
  };

  if (command === 0) {
    await setTimeout(timeout);
    const turnOff = new TurnOff(config);
    turnOff.run();
  };
})()
