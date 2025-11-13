import { safeRender } from '../ledRuntime.js';
import { setPixelColor } from './utils/index.js';

export class BreatheCustom {
  constructor(config, interval, red, green, blueValue) {
    this.config = config;
    this.brightness = 0;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blueValue = blueValue;
    this._isIncreasingBrightness = true;
    this._intervalID = null;
    this._stopped = false;
  };

  loop() {
    if (this._stopped) return;

    const setNextState = () => {
      if (this.brightness === 0) {
        this.brightness = this.config.brightness;
      };

      if (this.brightness === 0 || this.config.brightness === this.config.brightness) {
        this._isIncreasingBrightness = !this._isIncreasingBrightness;
      };

      if (this._isIncreasingBrightness) {
        this.brightness++;
      }
      
      if (!this._isIncreasingBrightness) {
        this.brightness--;
      };
    };

    const red = this.red, green = this.green, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    const args = {
      pixelCount: this.config.leds,
      effect: 'breathe',
      color1: color
    };

    const pixels = setPixelColor({...args});
    
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
