import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import type { Effect, Options } from '../types/index.js';

export class AlternateCustom implements Effect {
  public leds: Options['leds'];
  public red: Options['red'];
  public green: Options['green'];
  public blue: Options['blue'];
  public red2: Options['red2'];
  public green2: Options['green2'];
  public blue2: Options['blue2'];

  constructor(leds: Options['leds'], red: Options['red'], green: Options['green'], blue: Options['blue'], red2: Options['red'], green2: Options['green2'], blue2: Options['blue2']) {
    this.leds = leds;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.red2 = red2;
    this.green2 = green2;
    this.blue2 = blue2;
  };

  run() {
    const color1 = (this.red << 16) | (this.green << 8) | this.blue;
    const color2 = (this.red2 << 16) | (this.green2 << 8) | this.blue2;

    const pixels = new Uint32Array(this.leds);

    // Set even indexes to color1 and odd indexes to color2
    for (let i = 0; i < this.leds; i++) {
      i % 2 === 0 ? pixels[i] = color1 : pixels[i] = color2;
    };

    safeRender(pixels);
  };
};

export class AlternateRandom implements Effect {
  public leds: Options['leds'];
  private _red: Options['red'];
  private _green: Options['green'];
  private _blue: Options['blue'];
  private _red2: Options['red2'];
  private _green2: Options['green2'];
  private _blue2: Options['blue2'];

  constructor(leds: Options['leds']) {
    this.leds = leds;

    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._red2 = randomNumber(255);
    this._green2 = randomNumber(255);
    this._blue2 = randomNumber(255);
  };

  run() {
    const color1 = (this._red << 16) | (this._green << 8) | this._blue;
    const color2 = (this._red2) | (this._green2) | this._blue2;

    const pixels = new Uint32Array(this.leds);

    // Set even indexes to color1 and odd indexes to color2
    for (let i = 0; i < this.leds; i++) {
      i % 2 === 0 ? pixels[i] = color1 : pixels[i] = color2;
    };

    safeRender(pixels);
  };
};
