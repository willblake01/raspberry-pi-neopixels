import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { setPixelColor } from './utils/index.js';

export class Wheel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;
    this.red1 = randomNumber(255);
    this.green1 = randomNumber(255);
    this.blue1 = randomNumber(255);
    this.red2 = 0;
    this.green2 = 0;
    this.blue2 = 0;
    this.color1 = (this.red1 << 16) | (this.green1 << 8) | this.blue1;
    this.color2 = (this.red2 << 16) | (this.green2 << 8) | this.blue2;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const pixels = setPixelColor(this.config.leds, this.color1, this.offset, this.color2);
    safeRender(pixels);

    if (this.offset === this.config.leds - 1) {
      this.color2 = this.color1;

      this.red1 = randomNumber(255);
      this.green1 = randomNumber(255);
      this.blue1 = randomNumber(255);

      this.color1 = (this.red1 << 16) | (this.green1 << 8) | this.blue1;
    };

    this.offset = (this.offset + 1) % this.config.leds;
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
