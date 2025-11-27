import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import type { Effect, Options } from '../types/index.js';

export class SolidCustom implements Effect {
  public leds: Options['leds'];
  public red: Options['red'];
  public green: Options['green'];
  public blue: Options['blue'];

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

export class SolidRandom implements Effect {
  public leds: Options['leds'];
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
