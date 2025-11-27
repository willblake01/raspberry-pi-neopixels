import { safeRender } from '../ledRuntime.js';
import { Options } from '../types/index.js';
import { randomNumber } from '../utils/index.js';

export class SolidCustom {
  leds: Options['leds'];
  red: Options['red'];
  green: Options['green'];
  blue: Options['blue'];

  constructor(leds: Options['leds'], red: Options['red'], green: Options['green'], blue: Options['blue']) {
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
  leds: Options['leds'];
  private _red: Options['red'];
  private _green: Options['green'];
  private _blue: Options['blue'];

  constructor(leds: Options['leds']) {
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
