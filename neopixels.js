import prompts from 'prompts';
import { setTimeout } from 'timers/promises';
import { questions } from './prompts/questions.js';
import { SolidColor } from './modes/solidColor.js';
import { WalkPixel } from './modes/walkPixel.js';
import { TurnOff } from './modes/turnOff.js';

(async () => {
  const response = await prompts(questions);
  const { command, mode, leds, brightness, red, green, blue } = response;

  const pixelCount = parseInt(leds, 10);
  const brightnessValue = parseInt(brightness, 10);
  let redValue = parseInt(red, 10);
  let greenValue = parseInt(green, 10);
  let blueValue = parseInt(blue, 10);

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
    if (mode === 'solid color') {
      await setTimeout(timeout);
      const solidColor = new SolidColor(config, redValue, greenValue, blueValue);
      solidColor.run();
    };

    if (mode === 'walk pixel') {
      await setTimeout(timeout);
      const walkPixel = new WalkPixel(config, redValue, greenValue, blueValue);
      walkPixel.run();
    };
  };

  if (command === 0) {
    await setTimeout(timeout);
    const turnOff = new TurnOff(config);
    turnOff.run();
  };
})()
