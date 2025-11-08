import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class Change {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};
