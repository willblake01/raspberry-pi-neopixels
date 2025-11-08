import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class CreepCustomColor {
  constructor(numPixels, interval, redValue, greenValue, blueValue) {
    this.numPixels = numPixels;
    this.interval = interval;
    this.redValue = redValue;
    this.greenValue = greenValue;
    this.blueValue = blueValue;
    this.offset = 0;
  };

  loop() {
    const pixels = new Uint32Array(this.numPixels);

    const red = this.redValue, green = this.greenValue, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    for (let i = 0; i < this.numPixels; i++) {
      pixels[this.offset] = color;
    };

    this.offset = (this.offset + 1) % this.numPixels;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class CreepRandomColorChangePixel {
  constructor(numPixels, interval) {
    this.numPixels = numPixels;
    this.interval = interval;
    this.offset = 0;
  };

  loop() {
    const pixels = new Uint32Array(this.numPixels);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    pixels[this.offset] = color;

    this.offset = (this.offset + 1) % this.numPixels;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class CreepRandomColorChangeStrand {
  constructor(numPixels, interval) {
    this.numPixels = numPixels;
    this.interval = interval;
    this.offset = 0;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
  };

  loop() {
    const pixels = new Uint32Array(this.numPixels);

    const red = this.red, green = this.green, blue = this.blue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    for (let i = 0; i < this.numPixels; i++) {
      if (this.offset === this.numPixels - 1) {
        this.red = randomNumber(255);
        this.green = randomNumber(255);
        this.blue = randomNumber(255);
      };

      pixels[this.offset] = color;
    };

    this.offset = (this.offset + 1) % this.numPixels;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class CreepRandomColorStatic {
  constructor(numPixels, interval) {
    this.numPixels = numPixels;
    this.interval = interval;
    this.offset = 0;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
  };

  loop() {
    const pixels = new Uint32Array(this.numPixels);

    const red = this.red, green = this.green, blue = this.blue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    this.offset = (this.offset + 1) % this.numPixels;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};
