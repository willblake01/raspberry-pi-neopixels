import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { setPixelColor } from './utils/index.js';

export class SolidCustom {
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
      type: 'solid',
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
      type: 'solid',
      color1: color
    };

    const pixels = setPixelColor({...args});
    safeRender(pixels);
  };
};
