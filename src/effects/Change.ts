import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import type { Effect, Options } from '../types/index.js';

export class Change implements Effect {
  public leds: Options['leds'];
  public interval: Options['interval'];
  private _red: Options['red'];
  private _green: Options['green'];
  private _blue: Options['blue'];
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;


  constructor(leds: Options['leds'], interval: Options['interval']) {
    this.leds = leds;
    this.interval = interval;
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

    // Set strand to color
    for (let i = 0; i < this.leds; i++) {
      pixels[i] = color;
    };

    const setNextState = () => {

      // Change color every cycle
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
