const ws281x = require('rpi-ws281x');
const prompts = require('prompts');
const { setTimeout } = require('timers/promises');

const questions = [
  {
    type: 'text',
    name: 'command',
    message: 'Enter a command (on, off)'
  },
  {
    type: 'text',
    name: 'leds',
    message: 'Enter the number of LEDs (1-50)',
  },
  {
    type: 'text',
    name: 'brightness',
    message: 'Enter the brightness (0-255)',
  },
  {
    type: 'text',
    name: 'red',
    message: 'Enter the red value (0-255)',
  },
  {
    type: 'text',
    name: 'green',
    message: 'Enter the green value (0-255)',
  },
  {
    type: 'text',
    name: 'blue',
    message: 'Enter the blue value (0-255)',
  }
];

(async () => {
  const response = await prompts(questions);
  const { command, leds, brightness, red, green, blue } = response;

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

  class SolidColor {
    constructor() {
      ws281x.configure(config)
    };

    run() {
      const pixels = new Uint32Array(config.leds);

      const red = redValue, green = greenValue, blue=blueValue;
      const color = (red << 16) | (green << 8) | blue;

      for (let i = 0; i < pixelCount; i++) {
        pixels[i] = color;
      };

      ws281x.render(pixels);
    };
  };

  class TurnOff {
    constructor() {
      ws281x.configure(config);
    };

    run() {
      const pixels = new Uint32Array(config.leds);

      const red = 0, green = 0, blue = 0;
      const color = (red << 16) | (green << 8) | blue;

      for (let i = 0; i < pixelCount; i++) {
        pixels[i] = color;
      };

      ws281x.render(pixels);
    };
  };

  if (command === 'on') {
    await setTimeout(1000);
    const solidColor = new SolidColor();
    solidColor.run();
  } else if (command === 'off') {
    await setTimeout(1000);
    const turnOff = new TurnOff();
    redValue = 0, greenValue = 0, blueValue = 0;
    turnOff.run();
  }
})()
