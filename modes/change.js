import ws281x from 'rpi-ws281x';
import { randomColorValue } from '../utils/index.js';

export class ChangeColor {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = randomColorValue(255), green = randomColorValue(255), blue = randomColorValue(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};
