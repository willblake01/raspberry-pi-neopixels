import { safeRender } from '../ledRuntime.js';
import { Config } from '../types/index.js';

export class SolidCustom {
  config: Config;
  red: number;
  green: number;
  blue: number;

  constructor(config: Config, red: number, green: number, blue: number) {
    this.config = config;
    this.red = red;
    this.green = green;
    this.blue = blue;
  };

  run() {
    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set strand to color
    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    safeRender(pixels);
  };
};

export class SolidRandom {
  config: Config;
  red: number;
  green: number;
  blue: number;

  constructor(config: Config, red: number, green: number, blue: number) {
    this.config = config;

    this.red = red;
    this.green = green;
    this.blue = blue;
  };

  run() {
    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set strand to color
    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    safeRender(pixels);
  };
};
