import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { setPixelColor } from './utils/index.js';

export class SolidCustom {
  /**
   * @param {object} config { leds, ... }
   * @param {number} red 0..255
   * @param {number} green 0..255
   * @param {number} blue 0..255
   */

  constructor(config, red, green, blue) {
    this.config = config;
    this.red = red;
    this.green = green;
    this.blue = blue;
  };

  run() {
    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const args = {
      pixelCount: this.config.leds,
      effect: EFFECTS.SOLID,
      color1: color
    };

    const pixels = setPixelColor({...args});

    safeRender(pixels);
  };
};

export class SolidRandom {
  constructor(config) {
    this.config = config;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
  };

  run() {
    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const args = {
      pixelCount: this.config.leds,
      effect: EFFECTS.SOLID,
      color1: color
    };

    const pixels = setPixelColor({...args});
    safeRender(pixels);
  };
};
