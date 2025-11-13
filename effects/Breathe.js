import { safeRender } from '../ledRuntime.js';
import { setPixelColor } from './utils/index.js';

export class BreatheCustom {
  /**
   * @param {object} config { leds, ... }
   * @param {number} interval full in+out cycle duration (e.g., 2000)
   * @param {number} red 0..255
   * @param {number} green 0..255
   * @param {number} blue 0..255
   * @param {number} floor 0..1 minimum scalar (avoid total black)
   * @param {number} gamma perceptual gamma (2.0–2.4 feels nice)
   * @param {number} fps frames per second
   */

  constructor(config, interval, red, green, blue, floor = 0.08, gamma = 2, fps = 60) {
    this.config = config;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.floor = Math.min(Math.max(floor, 0), 1);
    this.gamma = gamma;
    this.fps = fps;
    this._t0 = Date.now();
    this._intervalID = null;
    this._stopped = false;
  };

  _scalar(nowMs) {
    const t = (nowMs - this._t0) / this.interval;
    const phase = t - Math.floor(t);
    const eased = (1 - Math.cos(2 * Math.PI * phase)) / 2;
    const perceptual = Math.pow(eased, this.gamma);
    
    return this.floor + (1 - this.floor) * perceptual;
  };

  loop() {
    if (this._stopped) return;

    const scale = this._scalar(Date.now());

    const red = (Math.round(this.red|0 * scale)) & 0xFF, green = (Math.round(this.green|0 * scale)) & 0xFF, blue = (Math.round(this.blue|0 * scale)) & 0xFF;
    const color = (red << 16) | (green << 8) | blue;

    const args = {
      pixelCount: this.config.leds,
      effect: 'breathe',
      color1: color
    };

    const pixels = setPixelColor({...args});
    
    safeRender(pixels);
  };

  run() {
    if (this._intervalID || this._stopped) return;

    const frameMs = Math.max(5, Math.round(1000 / this.fps));

    this.loop();
    this._intervalID = setInterval(() => this.loop(), frameMs);
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
