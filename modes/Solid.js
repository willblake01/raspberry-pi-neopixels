import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class SolidCustomColor {
  constructor(numPixels, redValue, greenValue, blueValue) {
    this.numPixels = numPixels;
    this.redValue = redValue;
    this.greenValue = greenValue;
    this.blueValue = blueValue;
  };

  run() {
    const pixels = new Uint32Array(this.numPixels);

    const red = this.redValue, green = this.greenValue, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.numPixels; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);

    process.on('SIGINT', () => {
      ws281x.reset();
      ws281x.finalize();

      process.nextTick(() => {
        process.exit(0);
      });
    });
  };
};

export class SolidRandomColor {
  constructor(config) {
    this.config = config;

    ws281x.configure(config);
  };

  run() {
    const pixels = new Uint32Array(this.config.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);

    process.on('SIGINT', () => {
      ws281x.reset();
      ws281x.finalize();

      process.nextTick(() => {
        process.exit(0);
      });
    });
  };
};
