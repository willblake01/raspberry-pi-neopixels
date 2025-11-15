import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { Config, Interval } from '../types/index.js';

export class BlinkCustom {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _on: boolean;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
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

    const red = this._on ? this.red : 0;
    const green = this._on ? this.green : 0;
    const blue = this._on ? this.blue : 0;

    const color = (red << 16) | (green << 8) | blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set strand to color
    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
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

export class BlinkRandomStatic {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _on: boolean;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
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

    const red = this._on ? this.red : 0;
    const green = this._on ? this.green : 0;
    const blue = this._on ? this.blue : 0;

    const color = (red << 16) | (green << 8) | blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set strand to color
    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
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

export class BlinkRandomChange {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _on: boolean;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
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

      if (this._on) {
        // Change color every cycle
        this.red = randomNumber(255);
        this.green = randomNumber(255)
        this.blue = randomNumber(255);
      };
    };
    
    const red = this._on ? this.red : 0;
    const green = this._on ? this.green : 0;
    const blue = this._on ? this.blue : 0;

    const color = (red << 16) | (green << 8) | blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set strand to color
    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
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
