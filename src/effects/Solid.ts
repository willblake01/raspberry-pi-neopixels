import { safeRender } from '../ledRuntime.js';
import { Config } from '../types/index.js';
import { randomNumber } from '../utils/index.js';

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
  private _red: number;
  private _green: number;
  private _blue: number;

  constructor(config: Config) {
    this.config = config;

    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
  };

  run() {
    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set strand to color
    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    safeRender(pixels);
  };
};
