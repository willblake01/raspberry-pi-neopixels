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
  };

  loop() {
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

    ws281x.render(pixels);
    setNextState();
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};
