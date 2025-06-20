import prompts from 'prompts';
import { setTimeout } from 'timers/promises';
import { questions } from './prompts/questions.js';
import { SolidColor, RandomColor, WalkPixel, TurnOff } from './modes/index.js';

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
    switch (mode) {
      case 'solid color':
        await setTimeout(timeout);
        const solidColor = new SolidColor(config, redValue, greenValue, blueValue);
        solidColor.run();
        break;
      case 'random color':
        await setTimeout(timeout);
        const randomColor = new RandomColor(config);
        randomColor.run();
        break;
      case 'walk pixel':
        await setTimeout(timeout);
        const walkPixel = new WalkPixel(config, redValue, greenValue, blueValue);
        walkPixel.run();
        break;
      default:
        console.log(`Error: Mode '${mode}' is invalid`);
    };
  };

  if (command === 0) {
    await setTimeout(timeout);
    const turnOff = new TurnOff(config);
    turnOff.run();
  };
})()
