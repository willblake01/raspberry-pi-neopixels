import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';

export class WalkPixelCustomColor {
    constructor(config, interval, red, green, blueValue) {
      this.config = config;
      this.interval = interval;
      this.red = red;
      this.green = green;
      this.blueValue = blueValue;
      this.offset = 0;
      this._intervalID = null;
      this._stopped = false;
    };

    loop() {
      if (this._stopped) return;

      const pixels = new Uint32Array(this.config.leds);

      const red = this.red, green = this.green, blue = this.blueValue;
      const color = (red << 16) | (green << 8) | blue;

      pixels[this.offset] = color;

      this.offset = (this.offset + 1) % this.config.leds;

      safeRender(pixels);
    };

    run() {
      if (this._intervalID || this._stopped) return;
      this.loop();
      this._intervalID = setInterval(() => this.loop(), this.interval);
    };

    stop() {
      if (this._stopped) return;
      this._stopped = true;
      if (this._intervalID) {
        clearInterval(this._intervalID);
        this._intervalID = null;
      };
    };
  };

export class WalkPixelRandomColorPixel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const pixels = new Uint32Array(this.config.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    pixels[this.offset] = color;

    this.offset = (this.offset + 1) % this.config.leds;

    safeRender(pixels);
  };

  run() {
    if (this._intervalID || this._stopped) return;
    this.loop();
    this._intervalID = setInterval(() => this.loop(), this.interval);
  };

  stop() {
    if (this._stopped) return;
    this._stopped = true;
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };
  };
};

export class WalkPixelRandomColorLoop {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

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

    safeRender(pixels);
  };

  run() {
    if (this._intervalID || this._stopped) return;
    this.loop();
    this._intervalID = setInterval(() => this.loop(), this.interval);
  };

  stop() {
    if (this._stopped) return;
    this._stopped = true;
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };
  };
};

export class WalkOffPixelCustomColor {
  constructor(config, interval, red, green, blueValue) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blueValue = blueValue;
    this.offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const pixels = new Uint32Array(this.config.leds);

    const red = this.red, green = this.green, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      if (i === this.offset) {
        pixels[this.offset] = 0;
      } else {
        pixels[i] = color;
      };
    };

    this.offset = (this.offset + 1) % this.config.leds;

    safeRender(pixels);
  };

  run() {
    if (this._intervalID || this._stopped) return;
    this.loop();
    this._intervalID = setInterval(() => this.loop(), this.interval);
  };

  stop() {
    if (this._stopped) return;
    this._stopped = true;
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };
  };
};

export class WalkOffPixelRandomColorPixel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;
    this._rendering = true;

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

    safeRender(pixels);
  };

  run() {
    if (this._intervalID || this._stopped) return;
    this.loop();
    this._intervalID = setInterval(() => this.loop(), this.interval);
  };

  stop() {
    if (this._stopped) return;
    this._stopped = true;
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };
  };
};

export class WalkOffPixelRandomColorLoop {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

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

    safeRender(pixels);
  };

  run() {
    if (this._intervalID || this._stopped) return;
    this.loop();
    this._intervalID = setInterval(() => this.loop(), this.interval);
  };

  stop() {
    if (this._stopped) return;
    this._stopped = true;
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    };
  };
};
