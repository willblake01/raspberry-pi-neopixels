import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class CreepCustomColor {
  constructor(config, interval, redValue, greenValue, blueValue) {
    this.config = config;
    this.interval = interval;
    this.redValue = redValue;
    this.greenValue = greenValue;
    this.blueValue = blueValue;
    this.offset = 0;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = this.redValue, green = this.greenValue, blue = this.blueValue;
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
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class CreepRandomColor {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);

    ws281x.configure(config);
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
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};
