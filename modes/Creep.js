import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class CreepCustomColor {
  constructor(config, interval, red, green, blueValue) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blueValue = blueValue;
    this.offset = 0;
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = this.red, green = this.green, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    for (let i = 0; i < this.config.leds; i++) {
      pixels[this.offset] = color;
    };

    this.offset = (this.offset + 1) % this.config.leds;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class CreepRandomColorChangePixel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;
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
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class CreepRandomColorChangeStrand {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = this.red, green = this.green, blue = this.blue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    for (let i = 0; i < this.config.leds; i++) {
      if (this.offset === this.config.leds - 1) {
        this.red = randomNumber(255);
        this.green = randomNumber(255);
        this.blue = randomNumber(255);
      };

      pixels[this.offset] = color;
    };

    this.offset = (this.offset + 1) % this.config.leds;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class CreepRandomColorStatic {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = this.red, green = this.green, blue = this.blue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.offset; i++) {
      pixels[i] = color;
    };

    this.offset = (this.offset + 1) % this.config.leds;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};
