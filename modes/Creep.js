import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class CreepCustomColor {
  constructor(leds, interval, red, green, blueValue) {
    this.leds = leds;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blueValue = blueValue;
    this.offset = 0;
  };

  loop() {
    const pixels = new Uint32Array(this.leds);

    const red = this.red, green = this.green, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    for (let i = 0; i < this.leds; i++) {
      pixels[this.offset] = color;
    };

    this.offset = (this.offset + 1) % this.leds;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class CreepRandomColorChangePixel {
  constructor(leds, interval) {
    this.leds = leds;
    this.interval = interval;
    this.offset = 0;
  };

  loop() {
    const pixels = new Uint32Array(this.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    pixels[this.offset] = color;

    this.offset = (this.offset + 1) % this.leds;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class CreepRandomColorChangeStrand {
  constructor(leds, interval) {
    this.leds = leds;
    this.interval = interval;
    this.offset = 0;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
  };

  loop() {
    const pixels = new Uint32Array(this.leds);

    const red = this.red, green = this.green, blue = this.blue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    for (let i = 0; i < this.leds; i++) {
      if (this.offset === this.leds - 1) {
        this.red = randomNumber(255);
        this.green = randomNumber(255);
        this.blue = randomNumber(255);
      };

      pixels[this.offset] = color;
    };

    this.offset = (this.offset + 1) % this.leds;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class CreepRandomColorStatic {
  constructor(leds, interval) {
    this.leds = leds;
    this.interval = interval;
    this.offset = 0;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
  };

  loop() {
    const pixels = new Uint32Array(this.leds);

    const red = this.red, green = this.green, blue = this.blue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    this.offset = (this.offset + 1) % this.leds;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};
