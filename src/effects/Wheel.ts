import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { Config, Interval } from '../types/index.js';

export class Wheel {
  config: Config;
  interval: Interval;
  red1: number;
  green1: number;
  blue1: number;
  _red2: number;
  _green2: number;
  _blue2: number;
  _offset: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red1: number, green1: number, blue1: number) {
    this.config = config;
    this.interval = interval;
    this.red1 = randomNumber(255);
    this.green1 = randomNumber(255);
    this.blue1 = randomNumber(255);
    this._red2 = 0;
    this._green2 = 0;
    this._blue2 = 0;
    this._offset = 0;
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
        this.red1 = randomNumber(255);
        this.green1 = randomNumber(255);
        this.blue1 = randomNumber(255);
      };
    };

    let color1 = (this.red1 << 16) | (this.green1 << 8) | this.blue1;
    let color2 = (this._red2 << 16) | (this._green2 << 8) | this._blue2;

    const pixels = new Uint32Array(this.config.leds);

    // Set pixels up to and including offset to color1 and rest of strand to color2
    for (let i = 0; i <= this._offset; i++) {
      pixels[i] = color1;
    };

    for (let i = this._offset + 1; i < this.config.leds; i++) {
      pixels[i] = color2;
    };

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
