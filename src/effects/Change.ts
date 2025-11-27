import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { Config, Interval } from '../types/index.js';

export class Change {
  leds: Config['leds'];
  interval: Interval;
  private _red: number;
  private _green: number;
  private _blue: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;


  constructor(leds: Config['leds'], interval: Interval) {
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
