import ws281x from 'rpi-ws281x';
import { randomColorValue } from '../utils/index.js';

export class BlinkCustomColor {
  constructor(config, interval, redValue, greenValue, blueValue) {
    this.config = config;
    this.interval = interval;
    this.redValue = redValue;
    this.greenValue = greenValue;
    this.blueValue = blueValue;
    this.on = false;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    let red, green, blue;

    if (!this.on) {
      red = this.redValue, green = this.greenValue, blue = this.blueValue;
    } else {
      red = 0, green = 0, blue = 0;
    };

    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class BlinkRandomColor {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.on = false;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);
    let red, green, blue;

    if (!this.on) {
      red = randomColorValue(255), green = randomColorValue(255), blue = randomColorValue(255);
    } else {
      red = 0, green = 0, blue = 0;
    };

    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};
