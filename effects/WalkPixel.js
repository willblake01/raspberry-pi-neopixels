import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { setPixelColor } from './utils/index.js';

export class WalkPixelOnCustomColor {
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

      const color = (this.red << 16) | (this.green << 8) | this.blue;
      const pixels = setPixelColor(this.config.leds, color, this._offset);

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

export class WalkPixelOnRandomColorPixel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
    this._offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
        this._offset = (this._offset + 1) % this.config.leds;
      };

    const color = (this._red << 16) | (this._green << 8) | this._blue;
    const pixels = setPixelColor(this.config.leds, color, this._offset);

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

export class WalkPixelOnRandomColorLoop {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._red = 0;
    this._green = 0;
    this._blue = 0;
    this._offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
        this._offset = (this._offset + 1) % this.config.leds;
      };

    if (this._offset === 0) {
      this._red = randomNumber(255);
      this._green = randomNumber(255);
      this._blue = randomNumber(255);
    };

    const color = (this._red << 16) | (this._green << 8) | this._blue;
    const pixels = setPixelColor(this.config.leds, color, this._offset);

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

export class WalkPixelOffCustomColor {
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

    for (let i = 0; i < this.config.leds; i++) {
      if (i === this._offset) {
        pixels[this._offset] = 0;
      } else {
        pixels[i] = color;
      };
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

export class WalkPixelOffRandomColorPixel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._red = randomNumber(255);
    this._green = randomNumber(255);
    this._blue = randomNumber(255);
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

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    for (let i = 0; i < this.config.leds; i++) {
      if (i === this._offset) {
        pixels[this._offset] = 0;
      } else {
        pixels[i] = color;
      };
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

export class WalkPixelOffRandomColorLoop {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this._red = 0;
    this._green = 0;
    this._blue = 0;
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

    if (this._offset === 0) {
      this._red = randomNumber(255);
      this._green = randomNumber(255);
      this._blue = randomNumber(255);
    };

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    for (let i = 0; i < this.config.leds; i++) {
      if (i === this._offset) {
        pixels[this._offset] = 0;
      } else {
        pixels[i] = color;
      };
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
