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

    };

    const makeScalar = () => {
      const t0 = Date.now();

      return () => {
        const t = (Date.now() - t0) / this.interval;
        const phase = t - Math.floor(t);
        const eased = (1 - Math.cost(2 * Math.PI * phase)) / 2;
        const perceptual = Math.pow(eased, gama);

        return floor + (1 - floor) * perceptual;
      };
    };

    const scale = makeScalar(this.interval);

    const red = (this.red * scale()) & 0xFF, green = (this.green * scale()) & 0xFF, blue = (this.blueValue * scale()) & 0xFF;
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

    const fps = 60;
    const frameMs = Math.max(5, Math.round(1000 / fps));

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
