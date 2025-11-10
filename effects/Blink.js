import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';

export class BlinkCustomColor {
  constructor(config, interval, red, green, blueValue) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blueValue = blueValue;
    this.on = true;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const pixels = new Uint32Array(this.config.leds);

    const red = this.on ? this.red : 0, green = this.on ? this.green : 0, blue = this.on ? this.blueValue : 0;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    safeRender(pixels);
    this.on = !this.on;
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

export class BlinkRandomColorChange {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.on = true;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const pixels = new Uint32Array(this.config.leds);
    
    const red = this.on ? randomNumber(255) : 0, green = this.on ? randomNumber(255) : 0, blue = this.on ? randomNumber(255) : 0;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    safeRender(pixels);
    this.on = !this.on;
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

export class BlinkRandomColorStatic {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
    this.on = true;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const pixels = new Uint32Array(this.config.leds);

    const red = this.on ? this.red : 0, green = this.on ? this.green : 0, blue = this.on ? this.blue : 0;

    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    safeRender(pixels);
    this.on = !this.on;
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
