import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { Config, Interval } from '../types/index.js';

export class WalkPixelOnCustom {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _offset: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
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

    const pixels = new Uint32Array(this.config.leds);

    // Set pixel at offset to color
    pixels[this._offset] = color;

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

export class WalkPixelOnRandomStatic {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _offset: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
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

    const pixels = new Uint32Array(this.config.leds);

    // Set pixel at offset to color
    pixels[this._offset] = color;

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

export class WalkPixelOnRandomChangePixel {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _offset: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this._offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;

      // Change color every pixel
      this.red = randomNumber(255);
      this.green = randomNumber(255);
      this.blue = randomNumber(255);
    };

    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set pixel at offset to color
    pixels[this._offset] = color;

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

export class WalkPixelOnRandomChangeLoop {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _offset: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this._offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;

      // Reset offset and change color every loop
      if (this._offset === this.config.leds - 1) {
        this._offset = 0;
        this.red = randomNumber(255);
        this.green = randomNumber(255);
        this.blue = randomNumber(255);
      };
    };

    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set pixel at offset to color
    pixels[this._offset] = color;

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

export class WalkPixelOffCustomStatic {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _offset: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
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

    const pixels = new Uint32Array(this.config.leds);

    // Set pixel at index to 0 and rest of strand to color
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

export class WalkPixelOffRandomChangePixel {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _offset: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this._offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;
  
    const setNextState = () => {
      this._offset = (this._offset + 1) % this.config.leds;

      // Change color every pixel
      this.red = randomNumber(255);
      this.green = randomNumber(255);
      this.blue = randomNumber(255);
    };

    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set pixel at index to 0 and rest of strand to color
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

export class WalkPixelOffRandomChangeLoop {
  config: Config;
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  _offset: number;
  _intervalID: NodeJS.Timeout | null;
  _stopped: boolean;

  constructor(config: Config, interval: Interval, red: number, green: number, blue: number) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this._offset = 0;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    // Update offset and change color every loop
    const setNextState = () => {
      if (this._offset === 0) {
        this.red = randomNumber(255);
        this.green = randomNumber(255);
        this.blue = randomNumber(255);
      };

      this._offset = (this._offset + 1) % this.config.leds;
    };

    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.config.leds);

    // Set pixel at index to 0 and rest of strand to color
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
