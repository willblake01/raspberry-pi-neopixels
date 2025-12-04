import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import type { Effect, Options } from '../types/index.js';

export class BlinkCustom implements Effect {
  public leds: Options['leds'];
  public interval: Options['interval'];
  public red: Options['red'];
  public green: Options['green'];
  public blue: Options['blue'];
  private _on: boolean;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Options['leds'], interval: Options['interval'], red: Options['red'], green: Options['green'], blue: Options['blue']) {
    this.leds = leds;
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

    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.leds);

    // Set strand to color if 'on' phase else set to 0 
    for (let i = 0; i < this.leds; i++) {
      this._on ? pixels[i] = color : pixels[i] = 0;
    };

    const setNextState = () => {
      this._on = !this._on;
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
    this._on = true;

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

export class BlinkRandomStatic implements Effect {
  public leds: Options['leds'];
  public interval: Options['interval'];
  private _red: Options['red'];
  private _green: Options['green'];
  private _blue: Options['blue'];
  private _on: boolean;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Options['leds'], interval: Options['interval']) {
    this.leds = leds;
    this.interval = interval;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._on = true;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.leds);

    // Set strand to color if 'on' phase else set to 0
    for (let i = 0; i < this.leds; i++) {
      this._on ? pixels[i] = color : pixels[i] = 0;
    };

    const setNextState = () => {
      this._on = !this._on;
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
    this._on = true;

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

export class BlinkRandomChange implements Effect {
  public leds: Options['leds'];
  public interval: Options['interval'];
  private _red: Options['red'];
  private _green: Options['green'];
  private _blue: Options['blue'];
  private _on: boolean;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Options['leds'], interval: Options['interval']) {
    this.leds = leds;
    this.interval = interval;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._on = true;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.leds);

    // Set strand to color if 'on' phase else set to 0
    for (let i = 0; i < this.leds; i++) {
      this._on ? pixels[i] = color : pixels[i] = 0;
    };

    const setNextState = () => {
      this._on = !this._on;

      // Change color every cycle
      if (this._on) {
        this._red = randomNumber(255);
        this._green = randomNumber(255)
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
    this._on = true;

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
