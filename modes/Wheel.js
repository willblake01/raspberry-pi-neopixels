import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class Wheel {
  constructor(leds, interval) {
    this.leds = leds;
    this.interval = interval;
    this.offset = 0;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
    this.red2 = 0;
    this.green2 = 0;
    this.blue2 = 0;
    this.color1 = (this.red << 16) | (this.green << 8) | this.blue;
    this.color2 = (this.red2 << 16) | (this.green2 << 8) | this.blue2;
  };

  loop() {
    const pixels = new Uint32Array(this.leds);

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = this.color1;
    };

    for (let i = this.offset; i < this.leds; i++) {
      pixels[i] = this.color2;
    };

    pixels[this.offset] = this.color1;

    if (this.offset === this.leds - 1) {
      this.color2 = this.color1;

      this.red = randomNumber(255);
      this.green = randomNumber(255);
      this.blue = randomNumber(255);

      this.color1 = (this.red << 16) | (this.green << 8) | this.blue;
    };

    this.offset = (this.offset + 1) % this.leds;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};
