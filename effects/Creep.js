import { randomNumber } from '../utils/index.js';
import { safeRender } from '../ledRuntime.js';
import { setPixelColor } from './utils/index.js';

export class CreepCustom {
  constructor(config, interval, red, green, blueValue) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blueValue = blueValue;
    this._offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;
    };

    const pixels = new Uint32Array(this.config.leds);

    const color = (this.red << 16) | (this.green << 8) | this.blue;

    for (let i = 0; i < this._offset; i++) {
      pixels[i] = color;
    };

    for (let i = 0; i < this.config.leds; i++) {
      pixels[this._offset] = color;
    };

    safeRender(pixels);
    setNextState();
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

export class CreepRandomStatic {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._offset = 0;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;
    };

    const color = (this._red << 16) | (this._green << 8) | this._blue;
    const pixelCount = this._offset;
    const pixels = setPixelColor(pixelCount, color);

    safeRender(pixels);
    setNextState();
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

export class CreepRandomChangePixel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._offset = 0;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;

      // Change color every pixel
      this._red = randomNumber(255);
      this._green = randomNumber(255);
      this._blue = randomNumber(255);
    };

    const color = (this._red << 16) | (this._green << 8) | this._blue;
    const pixelCount = this._offset;
    const pixels = setPixelColor(pixelCount, color);

    safeRender(pixels);
    setNextState();
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

export class CreepRandomChangeLoop {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._offset = 0;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;

      // Change color every loop
      if (this._offset === this.config.leds - 1) {
        this._red = randomNumber(255);
        this._green = randomNumber(255);
        this._blue = randomNumber(255);
      };
    };

    const color = (this._red << 16) | (this._green << 8) | this._blue;
    const pixelCount = this._offset;
    const pixels = setPixelColor(pixelCount, color);

    safeRender(pixels);
    setNextState();
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
