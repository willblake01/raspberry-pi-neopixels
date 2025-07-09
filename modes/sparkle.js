import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class SparkleCreep {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    pixels[this.offset] = color;

    this.offset = (this.offset + 1) % this.config.leds;

    ws281x.render(pixels);
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class SparkleOffPixel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      if (i === this.offset) {
        pixels[this.offset] = 0;
      } else {
        pixels[i] = color;
      };
    };

    this.offset = (this.offset + 1) % this.config.leds;

    ws281x.render(pixels);
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};
