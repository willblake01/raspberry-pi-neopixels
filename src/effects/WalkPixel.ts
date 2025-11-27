import { safeRender } from '../ledRuntime.js';
import { randomNumber } from '../utils/index.js';
import { Config, Interval } from '../types/index.js';

export class WalkPixelOnCustom {
  leds: Config['leds'];
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Config['leds'], interval: Interval, red: number, green: number, blue: number) {
    this.leds = leds;
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

    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.leds);

    // Set pixel at offset to color
    pixels[this._offset] = color;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;
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

export class WalkPixelOnRandomStatic {
  leds: Config['leds'];
  interval: Interval;
  private _red: number;
  private _green: number;
  private _blue: number;
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Config['leds'], interval: Interval) {
    this.leds = leds;
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

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.leds);

    // Set pixel at offset to color
    pixels[this._offset] = color;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;
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

export class WalkPixelOnRandomChangePixel {
  leds: Config['leds'];
  interval: Interval;
  private _red: number;
  private _green: number;
  private _blue: number;
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Config['leds'], interval: Interval) {
    this.leds = leds;
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

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.leds);

    // Set pixel at offset to color
    pixels[this._offset] = color;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;

      // Change color every pixel
      this._red = randomNumber(255);
      this._green = randomNumber(255);
      this._blue = randomNumber(255);
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

export class WalkPixelOnRandomChangeLoop {
  leds: Config['leds'];
  interval: Interval;
  private _red: number;
  private _green: number;
  private _blue: number;
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Config['leds'], interval: Interval) {
    this.leds = leds;
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

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.leds);

    // Set pixel at offset to color
    pixels[this._offset] = color;

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;

      // Change color every loop
      if (this._offset === 0) {
        this._red = randomNumber(255);
        this._green = randomNumber(255);
        this._blue = randomNumber(255);
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

export class WalkPixelOffCustomStatic {
  leds: Config['leds'];
  interval: Interval;
  red: number;
  green: number;
  blue: number;
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Config['leds'], interval: Interval, red: number, green: number, blue: number) {
    this.leds = leds;
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

    const color = (this.red << 16) | (this.green << 8) | this.blue;

    const pixels = new Uint32Array(this.leds);

    // Set pixel at index to 0 and rest of strand to color
    for (let i = 0; i < this.leds; i++) {
      if (i === this._offset) {
        pixels[this._offset] = 0;
      } else {
        pixels[i] = color;
      };
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;
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

export class WalkPixelOffRandomStatic {
  leds: Config['leds'];
  interval: Interval;
  private _red: number;
  private _green: number;
  private _blue: number;
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Config['leds'], interval: Interval) {
    this.leds = leds;
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

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.leds);

    // Set pixel at index to 0 and rest of strand to color
    for (let i = 0; i < this.leds; i++) {
      if (i === this._offset) {
        pixels[this._offset] = 0;
      } else {
        pixels[i] = color;
      };
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;
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
  leds: Config['leds'];
  interval: Interval;
  private _red: number;
  private _green: number;
  private _blue: number;
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Config['leds'], interval: Interval) {
    this.leds = leds;
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

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.leds);

    // Set pixel at index to 0 and rest of strand to color
    for (let i = 0; i < this.leds; i++) {
      if (i === this._offset) {
        pixels[this._offset] = 0;
      } else {
        pixels[i] = color;
      };
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;

      // Change color every pixel
      this._red = randomNumber(255);
      this._green = randomNumber(255);
      this._blue = randomNumber(255);
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
  leds: Config['leds'];
  interval: Interval;
  private _red: number;
  private _green: number;
  private _blue: number;
  private _offset: number;
  private _intervalID: NodeJS.Timeout | null;
  private _stopped: boolean;

  constructor(leds: Config['leds'], interval: Interval) {
    this.leds = leds;
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

    const color = (this._red << 16) | (this._green << 8) | this._blue;

    const pixels = new Uint32Array(this.leds);

    // Set pixel at index to 0 and rest of strand to color
    for (let i = 0; i < this.leds; i++) {
      if (i === this._offset) {
        pixels[this._offset] = 0;
      } else {
        pixels[i] = color;
      };
    };

    const setNextState = () => {
      this._offset = (this._offset + 1) % this.leds;

      // Change color every loop
      if (this._offset === 0) {
        this._red = randomNumber(255);
        this._green = randomNumber(255);
        this._blue = randomNumber(255);
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
