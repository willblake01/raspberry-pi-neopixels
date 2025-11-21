import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { Config, Interval } from '../types/index.js';

export class Wheel {
  config: Config;
  interval: Interval;
  private _red1: number;
  private _green1: number;
  private _blue1: number;
  private _red2: number;
  private _green2: number;
  private _blue2: number;
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(config: Config, interval: Interval) {
    this.config = config;
    this.interval = interval;
    this._red1 = randomNumber(255);
    this._green1 = randomNumber(255);
    this._blue1 = randomNumber(255);
    this._red2 = 0;
    this._green2 = 0;
    this._blue2 = 0;
    this._offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    let color1 = (this._red1 << 16) | (this._green1 << 8) | this._blue1;
    let color2 = (this._red2 << 16) | (this._green2 << 8) | this._blue2;

    const pixels = new Uint32Array(this.config.leds);

    // Set pixels up to and including offset to color1
    for (let i = 0; i <= this._offset; i++) {
      pixels[i] = color1;
    };

    // Set rest of strand to color2
    for (let i = this._offset + 1; i < this.config.leds; i++) {
      pixels[i] = color2;
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;

      if (this._offset === 0) {
        color2 = color1;

        // Change color every loop
        this._red1 = randomNumber(255);
        this._green1 = randomNumber(255);
        this._blue1 = randomNumber(255);
      };
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
