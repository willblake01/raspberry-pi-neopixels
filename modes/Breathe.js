import ws281x from 'rpi-ws281x';

export class BreatheCustomColor {
  constructor(numPixels, brightness, interval, redValue, greenValue, blueValue) {
    this.numPixels = numPixels;
    this.brightness = brightness;
    this.interval = interval;
    this.redValue = redValue;
    this.greenValue = greenValue;
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

    const pixels = new Uint32Array(this.numPixels);

    const red = this.redValue, green = this.greenValue, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.numPixels; i++) {
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
