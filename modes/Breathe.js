import ws281x from 'rpi-ws281x';

export class BreatheCustomColor {
  constructor(config, interval, red, green, blueValue) {
    this.config = config;
    this.brightness = 0;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blueValue = blueValue;
    this.isIncreasingBrightness = true;
    this._intervalID = null;
    this._stopped = false;
    this._rendering = false;
  };

  loop() {
    if (this._stopped) return;
    this._rendering = true;

    const setNextState = () => {
      if (this.brightness === 0) {
        this.brightness = this.config.brightness;
      };

      if (this.brightness === 0 || this.config.brightness === this.config.brightness) {
        this.isIncreasingBrightness = !this.isIncreasingBrightness;
      };

      if (this.isIncreasingBrightness) {
        this.brightness++;
      }
      
      if (!this.isIncreasingBrightness) {
        this.brightness--;
      };
    };

    const pixels = new Uint32Array(this.config.leds);

    const red = this.red, green = this.green, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    try {
      ws281x.render(pixels);
    } finally {
      this._rendering = false;
    };

    setNextState();
  };

  run() {
    if (this._intervalID) return;
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
