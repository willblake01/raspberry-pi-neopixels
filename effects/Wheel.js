import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { setPixelColor } from './utils/index.js';

export class Wheel {
  /**
   * @param {object} config { leds, ... }
   * @param {number} interval full in+out cycle duration (e.g., 2000)
   */

  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._offset = 0;
    this._red1 = randomNumber(255);
    this._green1 = randomNumber(255);
    this._blue1 = randomNumber(255);
    this._red2 = 0;
    this._green2 = 0;
    this._blue2 = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;

      if (this._offset === this.config.leds - 1) {
        color2 = color1;

        // Change color every loop
        this._red1 = randomNumber(255);
        this._green1 = randomNumber(255);
        this._blue1 = randomNumber(255);
      };
    };

    let color1 = (this._red1 << 16) | (this._green1 << 8) | this._blue1;
    let color2 = (this._red2 << 16) | (this._green2 << 8) | this._blue2;

    const args = {
      pixelCount: this.config.leds,
      effect: 'wheel',
      color1: color1,
      offset: this._offset,
      color2: color2
    };

    const pixels = setPixelColor({...args});

    safeRender(pixels);
    setNextState();
  };

  run() {
    if (this._intervalID || this._stopped) return;
    this.loop();
    this._intervalID = setInterval(() => this.loop(), this.interval);
  };

  stop() {
    if (this._stopped) return;
    this._stopped = true;
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };
  };
};
