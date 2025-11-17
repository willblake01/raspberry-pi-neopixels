import { safeRender } from '../ledRuntime.js';
import { Config, Interval } from '../types/index.js';
import { randomNumber } from '../utils/index.js';

export class BreatheCustom {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  floor: number;
  gamma: number;
  fps: number;
  _t0: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number, floor: number = 0.08, gamma: number = 2, fps: number = 60) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.floor = Math.min(Math.max(floor, 0), 1);
    this.gamma = gamma;
    this.fps = fps;
    this._t0 = Date.now();
    this._intervalID = null;
    this._stopped = false;
  };

  _scalar(nowMs: number) {
    const t = (nowMs - this._t0) / this.interval;
    const phase = t - Math.floor(t);
    const eased = (1 - Math.cos(2 * Math.PI * phase)) / 2;
    const perceptual = Math.pow(eased, this.gamma);
    
    return this.floor + (1 - this.floor) * perceptual;
  };

  loop() {
    if (this._stopped) return;

    const scale = this._scalar(Date.now());

    const red = Math.round(this.red | 0) * scale & 0xFF;
    const green = Math.round(this.green | 0) * scale & 0xFF;
    const blue = Math.round(this.blue | 0) * scale & 0xFF;

    const color = (red << 16) | (green << 8) | blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set strand to color
    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };
    
    safeRender(pixels);
  };

  run() {
    if (this._intervalID || this._stopped) return;

    const frameMs: number = Math.max(5, Math.round(1000 / this.fps));

    this.loop();
    this._intervalID = setInterval(() => this.loop(), frameMs);

    
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

export class BreatheRandom {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  floor: number;
  gamma: number;
  fps: number;
  _t0: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number, floor: number = 0.08, gamma: number = 2, fps: number = 60) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.floor = Math.min(Math.max(floor, 0), 1);
    this.gamma = gamma;
    this.fps = fps;
    this._t0 = Date.now();
    this._intervalID = null;
    this._stopped = false;
  };

  _scalar(nowMs: number) {
    const t = (nowMs - this._t0) / this.interval;
    const phase = t - Math.floor(t);
    const eased = (1 - Math.cos(2 * Math.PI * phase)) / 2;
    const perceptual = Math.pow(eased, this.gamma);
    
    return this.floor + (1 - this.floor) * perceptual;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this.red = randomNumber(255);
      this.green = randomNumber(255);
      this.blue = randomNumber(255);
    };

    const scale = this._scalar(Date.now());

    const red = Math.round(this.red | 0) * scale & 0xFF;
    const green = Math.round(this.green | 0) * scale & 0xFF;
    const blue = Math.round(this.blue | 0) * scale & 0xFF;

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

    const frameMs: number = Math.max(5, Math.round(1000 / this.fps));

    this.loop();
    this._intervalID = setInterval(() => this.loop(), frameMs);

    
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
