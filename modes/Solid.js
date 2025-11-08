import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class SolidCustomColor {
  constructor(leds, redValue, greenValue, blueValue) {
    this.leds = leds;
    this.redValue = redValue;
    this.greenValue = greenValue;
    this.blueValue = blueValue;
  };

  run() {
    const pixels = new Uint32Array(this.leds);

    const red = this.redValue, green = this.greenValue, blue = this.blueValue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.leds; i++) {
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
  constructor(leds) {
    this.leds = leds;
  };

  run() {
    const pixels = new Uint32Array(this.leds);

    const red = randomNumber(255), green = randomNumber(255), blue = randomNumber(255);
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.leds; i++) {
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
