import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class Change {
  constructor(leds, interval) {
    this.leds = leds;
    this.interval = interval;
  };

  loop() {
    const pixels = new Uint32Array(this.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};
