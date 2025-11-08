import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class BlinkCustomColor {
  constructor(numPixels, interval, redValue, greenValue, blueValue) {
    this.numPixels = numPixels;
    this.interval = interval;
    this.redValue = redValue;
    this.greenValue = greenValue;
    this.blueValue = blueValue;
    this.on = true;
  };

  loop() {
    const pixels = new Uint32Array(this.numPixels);

    const red = this.on ? this.redValue : 0, green = this.on ? this.greenValue : 0, blue = this.on ? this.blueValue : 0;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.numPixels; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class BlinkRandomColorChange {
  constructor(numPixels, interval) {
    this.numPixels = numPixels;
    this.interval = interval;
    this.on = true;
  };

  loop() {
    const pixels = new Uint32Array(this.numPixels);
    
    const red = this.on ? randomNumber(255) : 0, green = this.on ? randomNumber(255) : 0, blue = this.on ? randomNumber(255) : 0;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.numPixels; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class BlinkRandomColorStatic {
  constructor(numPixels, interval) {
    this.numPixels = numPixels;
    this.interval = interval;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
    this.on = true;

  };

  loop() {
    const pixels = new Uint32Array(this.numPixels);

    const red = this.on ? this.red : 0, green = this.on ? this.green : 0, blue = this.on ? this.blue : 0;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.numPixels; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};
