import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { setPixelColor } from './utils/index.js';

export class BlinkCustom {
  /**
   * @param {object} config { leds, ... }
   * @param {number} interval Effect loop interval
   * @param {number} red 0..255
   * @param {number} green 0..255
   * @param {number} blue 0..255
   */

  constructor(config, interval, red, green, blue) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this._on = true;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this._on = !this._on;
    };

    const red = this._on ? this.red : 0, green = this._on ? this.green : 0, blue = this._on ? this.blue : 0;

    const color = (red << 16) | (green << 8) | blue;

    const args = {
      pixelCount: this.config.leds,
      effect: 'blink',
      color1: color
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

export class BlinkRandomStatic {
  /**
   * @param {object} config { leds, ... }
   * @param {number} interval Effect loop interval
   */

  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._on = true;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this._on = !this._on;
    };

    const red = this._on ? this._red : 0, green = this._on ? this._green : 0, blue = this._on ? this._blue : 0;

    const color = (red << 16) | (green << 8) | blue;

    const args = {
      pixelCount: this.config.leds,
      effect: 'blink',
      color1: color
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

export class BlinkRandomChange {
  /**
   * @param {object} config { leds, ... }
   * @param {number} interval Effect loop interval
   */

  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._on = true;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this._on = !this._on;

      if (this._on) {
        // Change color every cycle
        this._red = randomNumber(255);
        this._green = randomNumber(255)
        this._blue = randomNumber(255);
      };
    };
    
    const red = this._on ? this._red : 0, green = this._on ? this._green : 0, blue = this._on ? this._blue : 0;

    const color = (red << 16) | (green << 8) | blue;

    const args = {
      pixelCount: this.config.leds,
      effect: 'blink',
      color1: color
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
