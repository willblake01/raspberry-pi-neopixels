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
    name: 'mode',
    message: 'Enter the mode (solid, walk pixel)'
  },
  {
    type: 'text',
    name: 'leds',
    message: 'Enter the number of LEDs (1-100)',
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

  class SolidColor {
    constructor() {
      ws281x.configure(config)
    };

    run() {
      const pixels = new Uint32Array(config.leds);

      const red = redValue, green = greenValue, blue = blueValue;
      const color = (red << 16) | (green << 8) | blue;

      for (let i = 0; i < pixelCount; i++) {
        pixels[i] = color;
      };

      ws281x.render(pixels);
    };
  };

  class WalkPixel {
    constructor() {
      this.offset = 0;

      ws281x.configure(config);
    };

    loop() {
      const pixels = new Uint32Array(config.leds);

      pixels[this.offset] = 0xFFBF00

      this.offset = (this.offset + 1) % leds;

      ws281x.render(pixels);
    };

    run() {
      setInterval(this.loop.bind(this), 100);
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
    if (mode === 'solid') {
      await setTimeout(timeout);
      const solidColor = new SolidColor();
      solidColor.run();
    };

    if (mode === 'walk pixel') {
      await setTimeout(timeout);
      const walkPixel = new WalkPixel();
      walkPixel.run();
    };
  };

  if (command === 'off') {
    await setTimeout(timeout);
    const turnOff = new TurnOff();
    turnOff.run();
  };
})()
