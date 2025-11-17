import { randomNumber } from '../utils/index.js';
import { safeRender } from '../ledRuntime.js';
import { Config, Interval } from '../types/index.js';

export class CreepCustom {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _offset: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this._offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.config.leds);

    for (let i = 0; i < this._offset; i++) {
      pixels[i] = color;
    };

    // Set pixel at offset to color
    for (let i = 0; i < this.config.leds; i++) {
      pixels[this._offset] = color;
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;
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

export class CreepRandomStatic {
  config: Config;
  interval: Interval;
  _offset: number;
  _red: number;
  _green: number;
  _blue: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval) {
    this.config = config;
    this.interval = interval;
    this._offset = 0;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set pixels up to and including offset to color
    for (let i = 0; i <= this._offset; i++) {
      pixels[i] = color;
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;
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

export class CreepRandomChangePixel {
  config: Config;
  interval: Interval;
  _offset: number;
  _red: number;
  _green: number;
  _blue: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval) {
    this.config = config;
    this.interval = interval;
    this._offset = 0;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.config.leds);
    
    // Set pixels up to and including offset to color
    for (let i = 0; i <= this._offset; i++) {
      pixels[i] = color;
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;

      // Change color every pixel
      this._red = randomNumber(255);
      this._green = randomNumber(255);
      this._blue = randomNumber(255);
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

export class CreepRandomChangeLoop {
  config: Config;
  interval: Interval;
  _offset: number;
  _red: number;
  _green: number;
  _blue: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval) {
    this.config = config;
    this.interval = interval;
    this._offset = 0;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set pixels up to and including offset to color
    for (let i = 0; i <= this._offset; i++) {
      pixels[i] = color;
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;

      // Change color every loop
      if (this._offset === 0) {
        this._red = randomNumber(255);
        this._green = randomNumber(255);
        this._blue = randomNumber(255);
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
