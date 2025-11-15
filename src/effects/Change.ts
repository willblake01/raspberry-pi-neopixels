import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { Config, Interval } from '../types/index.js';

export class Change {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;


  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this.red = randomNumber(255);
      this.green = randomNumber(255);
      this.blue = randomNumber(255);
    };

    const color = (this.red << 16) | (this.green << 8) | this.blue;

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
