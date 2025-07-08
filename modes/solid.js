import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class SolidCustomColor {
  constructor(config, redValue, greenValue, blueValue) {
    this.config = config;
    this.redValue = redValue;
    this.greenValue = greenValue;
    this.blueValue = blueValue;

    ws281x.configure(config)
  };

  run() {
    const pixels = new Uint32Array(this.config.leds);

    const red = this.redValue, green = this.greenValue, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
  };
};

export class SolidRandomColor {
  constructor(config) {
    this.config = config;

    ws281x.configure(config);
  };

  run() {
    const pixels = new Uint32Array(this.config.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
  };
};
