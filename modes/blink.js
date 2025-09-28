import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

const setColor = (red, green, blue, leds, pixels) => {
  const color = (red << 16) | (green << 8) | blue;

  for (let i = 0; i < leds; i++) {
    pixels[i] = color;
  };
};

export class BlinkCustomColor {
  constructor(config, interval, redValue, greenValue, blueValue) {
    this.config = config;
    this.interval = interval;
    this.redValue = this.on ? redValue : 0;
    this.greenValue = this.on ? greenValue : 0;
    this.blueValue = this.on ? blueValue : 0;
    this.on = false;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);
    setColor(this.red, this.green, this.blue, this.config.leds, pixels);
    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class BlinkRandomColorChange {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.on = false;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);
    let red = this.on ? randomNumber(255) : 0, green = this.on ? randomNumber(255) : 0, blue = this.on ? randomNumber(255) : 0;
    setColor(red, green, blue, this.config.leds, pixels);
    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class BlinkRandomColorStatic {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.red = this.on ? randomNumber(255) : 0;
    this.green = this.on ? randomNumber(255) : 0;
    this.blue = this.on ? randomNumber(255) : 0;
    this.on = false;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);
    setColor(this.red, this.green, this.blue, this.config.leds, pixels);
    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};
