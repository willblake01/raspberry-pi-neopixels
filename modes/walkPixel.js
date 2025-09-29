import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

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

export class WalkPixelRandomColorPixel {
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

    pixels[this.offset] = color;

    this.offset = (this.offset + 1) % this.config.leds;

    ws281x.render(pixels);
  };

  run() {
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class WalkPixelRandomColorStrand {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.offset = 0;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    if (this.offset === 0) {
      this.red = randomNumber(255);
      this.green = randomNumber(255);
      this.blue = randomNumber(255);
    };

    const red = this.red, green = this.green, blue = this.blue;
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

export class WalkOffPixelRandomColorPixel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = randomNumber(255), green = randomNumber(255) , blue = randomNumber(255);
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

export class WalkOffPixelRandomColorStrand {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.offset = 0;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    if (this.offset === 0) {
      this.red = randomNumber(255);
      this.green = randomNumber(255);
      this.blue = randomNumber(255);
    };

    const red = this.red, green = this.green, blue = this.blue;
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
