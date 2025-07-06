import ws281x from 'rpi-ws281x';
import { randomColorValue } from '../utils/index.js';

export class WalkPixelCustomColor {
    constructor(config, interval, redValue, greenValue, blueValue) {
      this.config = config;
      this.interval = interval;
      this.redValue = redValue;
      this.greenValue = greenValue;
      this.blueValue = blueValue;
      this.offset = 0;

      ws281x.configure(this.config);
    };

    loop() {
      const pixels = new Uint32Array(this.config.leds);

      const red = this.redValue, green = this.greenValue, blue = this.blueValue;
      const color = (red << 16) | (green << 8) | blue;

      pixels[this.offset] = color;

      this.offset = (this.offset + 1) % this.config.leds;

      ws281x.render(pixels);
    };

    run() {
      setInterval(this.loop.bind(this), this.interval);
    };
  };

export class WalkPixelRandomColor {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = randomColorValue(255), green = randomColorValue(255), blue = randomColorValue(255);
    const color = (red << 16) | (green << 8) | blue;

    pixels[this.offset] = color;

    this.offset = (this.offset + 1) % this.config.leds;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class WalkOffPixelCustomColor {
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
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class WalkOffPixelRandomColor {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);
    const red = randomColorValue(255), green = randomColorValue(255), blue = randomColorValue(255);
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
    setInterval(this.loop.bind(this), this.interval);
  };
};
