import { randomNumber } from '../utils/index.js';
import { safeRender } from '../ledRuntime.js';
import type { Effect, Options } from '../types/index.js';

export class CreepCustom implements Effect {
  public leds: Options['leds'];
  public interval: Options['interval'];
  public red: Options['red'];
  public green: Options['green'];
  public blue: Options['blue'];
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Options['leds'], interval: Options['interval'], red: Options['red'], green: Options['green'], blue: Options['blue']) {
    this.leds = leds;
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

    const pixels = new Uint32Array(this.leds);

    for (let i = 0; i < this._offset; i++) {
      pixels[i] = color;
    };

    // Set pixel at offset to color
    for (let i = 0; i < this.leds; i++) {
      pixels[this._offset] = color;
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;
    };

    safeRender(pixels);
    setNextState();
  };

  run() {
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };

    this._stopped = false;

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

export class CreepRandomStatic implements Effect {
  public leds: Options['leds'];
  public interval: Options['interval'];
  private _red: Options['red'];
  private _green: Options['green'];
  private _blue: Options['blue'];
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Options['leds'], interval: Options['interval']) {
    this.leds = leds;
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

    const pixels = new Uint32Array(this.leds);

    // Set pixels up to and including offset to color
    for (let i = 0; i <= this._offset; i++) {
      pixels[i] = color;
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;
    };

    safeRender(pixels);
    setNextState();
  };

  run() {
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };

    this._stopped = false;

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

export class CreepRandomChangePixel implements Effect {
  public leds: Options['leds'];
  public interval: Options['interval'];
  private _red: Options['red'];
  private _green: Options['green'];
  private _blue: Options['blue'];
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Options['leds'], interval: Options['interval']) {
    this.leds = leds;
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

    const pixels = new Uint32Array(this.leds);
    
    // Set pixels up to and including offset to color
    for (let i = 0; i <= this._offset; i++) {
      pixels[i] = color;
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;

      // Change color every pixel
      this._red = randomNumber(255);
      this._green = randomNumber(255);
      this._blue = randomNumber(255);
    };

    safeRender(pixels);
    setNextState();
  };

  run() {
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };

    this._stopped = false;

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

export class CreepRandomChangeLoop implements Effect {
  public leds: Options['leds'];
  public interval: Options['interval'];
  private _red: Options['red'];
  private _green: Options['green'];
  private _blue: Options['blue'];
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Options['leds'], interval: Options['interval']) {
    this.leds = leds;
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

    const pixels = new Uint32Array(this.leds);

    // Set pixels up to and including offset to color
    for (let i = 0; i <= this._offset; i++) {
      pixels[i] = color;
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;

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
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };

    this._stopped = false;

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
