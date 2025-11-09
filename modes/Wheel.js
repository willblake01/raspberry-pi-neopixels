import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';

export class Wheel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
    this.red2 = 0;
    this.green2 = 0;
    this.blue2 = 0;
    this.color1 = (this.red << 16) | (this.green << 8) | this.blue;
    this.color2 = (this.red2 << 16) | (this.green2 << 8) | this.blue2;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const pixels = new Uint32Array(this.config.leds);

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = this.color1;
    };

    for (let i = this.offset; i < this.config.leds; i++) {
      pixels[i] = this.color2;
    };

    pixels[this.offset] = this.color1;

    if (this.offset === this.config.leds - 1) {
      this.color2 = this.color1;

      this.red = randomNumber(255);
      this.green = randomNumber(255);
      this.blue = randomNumber(255);

      this.color1 = (this.red << 16) | (this.green << 8) | this.blue;
    };

    this.offset = (this.offset + 1) % this.config.leds;

    safeRender(pixels);
  };

  run() {
    if (this._intervalID) return;
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
