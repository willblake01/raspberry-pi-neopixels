import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class Change {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._intervalID = null;
    this._stopped = false;
    this._rendering = false;
  };

  loop() {
    if (this._stopped) return;
    this._rendering = true;

    const pixels = new Uint32Array(this.config.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    try {
      ws281x.render(pixels);
    } finally {
      this._rendering = false;
    };
  };

  run() {
    if (this._intervalID) return;
    this.loop();
    this._intervalID = setInterval(this.loop.bind(this), this.interval);
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
