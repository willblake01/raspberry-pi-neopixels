import { safeRender } from '../ledRuntime.js';
import { Config } from '../types/index.js';
import { randomNumber } from '../utils/index.js';

export class SolidCustom {
  leds: Config['leds'];
  red: number;
  green: number;
  blue: number;

  constructor(leds: Config['leds'], red: number, green: number, blue: number) {
    this.leds = leds;
    this.red = red;
    this.green = green;
    this.blue = blue;
  };

  run() {
    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.leds);

    // Set strand to color
    for (let i = 0; i < this.leds; i++) {
      pixels[i] = color;
    };

    safeRender(pixels);
  };
};

export class SolidRandom {
  leds: Config['leds'];
  private _red: number;
  private _green: number;
  private _blue: number;

  constructor(leds: Config['leds']) {
    this.leds = leds;

    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
  };

  run() {
    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.leds);

    // Set strand to color
    for (let i = 0; i < this.leds; i++) {
      pixels[i] = color;
    };

    safeRender(pixels);
  };
};
