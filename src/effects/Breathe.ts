import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import type { Effect, Options } from '../types/index.js';

export class BreatheCustom implements Effect {
  public leds: Options['leds'];
  public interval: Options['interval'];
  public red: Options['red'];
  public green: Options['green'];
  public blue: Options['blue'];
  public floor: number;
  public gamma: number;
  public fps: number;
  private _t0: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Options['leds'], interval: Options['interval'], red: Options['red'], green: Options['green'], blue: Options['blue'], floor: number = 0.08, gamma: number = 2, fps: number = 60) {
    this.leds = leds;
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

    const red = Math.max(0, Math.min(255, Math.round(this.red * scale)));
    const green = Math.max(0, Math.min(255, Math.round(this.green * scale)));
    const blue = Math.max(0, Math.min(255, Math.round(this.blue * scale)));

    const color = (red << 16) | (green << 8) | blue;

    const pixels = new Uint32Array(this.leds);

    // Set strand to color
    for (let i = 0; i < this.leds; i++) {
      pixels[i] = color;
    };
    
    safeRender(pixels);
  };

  run() {
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };

    this._stopped = false;

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

export class BreatheRandom implements Effect {
  public leds: Options['leds'];
  public interval: Options['interval'];
  public floor: number;
  public gamma: number;
  public fps: number;
  private _red: Options['red'];
  private _green: Options['green'];
  private _blue: Options['blue'];
  private _t0: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Options['leds'], interval: Options['interval'], floor: number = 0.08, gamma: number = 2, fps: number = 60) {
    this.leds = leds;
    this.interval = interval;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
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

  const red = Math.max(0, Math.min(255, Math.round(this._red * scale)));
  const green = Math.max(0, Math.min(255, Math.round(this._green * scale)));
  const blue = Math.max(0, Math.min(255, Math.round(this._blue * scale)));

  const color = (red << 16) | (green << 8) | blue;
  const pixels = new Uint32Array(this.leds);

  for (let i = 0; i < this.leds; i++) {
    pixels[i] = color;
  }

  safeRender(pixels);
}

  run() {
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };

    this._stopped = false;

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
