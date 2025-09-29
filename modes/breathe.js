import ws281x from 'rpi-ws281x';

export class BreatheCustomColor {
  constructor(config, interval, redValue, greenValue, blueValue) {
    this.config = config;
    this.interval = interval;
    this.redValue = redValue;
    this.greenValue = greenValue;
    this.blueValue = blueValue;
    this.maxBrightness = this.config.brightness;
    this.isIncreasingBrightness = true;

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const red = this.redValue, green = this.greenValue, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);

    if (this.config.brightness === 0) {
      this.config.brightness = this.maxBrightness;
    };

    const gettingBrighter = this.config.brightness < this.maxBrightness && this.isIncreasingBrightness;
    const gettingDimmer = this.config.brightness < this.maxBrightness && !this.isIncreasingBrightness;

    if (gettingBrighter) {
      this.config.brightness++;
    }
    
    if (gettingDimmer) {
      this.config.brightness--;
    };
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};
