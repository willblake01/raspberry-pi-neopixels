import { safeRender } from "../ledRuntime.js";
import { randomNumber } from '../utils/index.js';

export class SolidCustomColor {
  constructor(config, red, green, blue) {
    this.config = config;
    this.red = red;
    this.green = green;
    this.blue = blue;
  };

  run() {
    const pixels = new Uint32Array(this.config.leds);

    const color = (this.red << 16) | (this.green << 8) | this.blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    safeRender(pixels);
  };
};

export class SolidRandomColor {
  constructor(config) {
    this.config = config;
  };

  run() {
    const pixels = new Uint32Array(this.config.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    safeRender(pixels);
  };
};
