import ws281x from 'rpi-ws281x';

export class BreatheCustomColor {
  constructor(leds, brightness, interval, red, green, blueValue) {
    this.leds = leds;
    this.brightness = brightness;
    this.interval = interval;
    this.red = red;
    this.green = green;
    this.blueValue = blueValue;
    this.brightness = brightness;
    this.isIncreasingBrightness = true;
  };

  setInitialState() {
    this.brightness = 0;
  };

  loop() {
    const setNextState = () => {
      if (this.brightness === 0) {
        this.brightness = this.brightness;
      };

      if (this.brightness === 0 || this.brightness === this.brightness) {
        this.isIncreasingBrightness = !this.isIncreasingBrightness;
      };

      if (this.isIncreasingBrightness) {
        this.brightness++;
      }
      
      if (!this.isIncreasingBrightness) {
        this.brightness--;
      };
    };

    const pixels = new Uint32Array(this.leds);

    const red = this.red, green = this.green, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
    setNextState();
  };

  run() {
    this.setInitialState();
    setInterval(this.loop.bind(this), this.interval);
  };
};
