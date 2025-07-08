import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class Wheel {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.pixelIndex = 0;
    this.red = randomColorValue(255);
    this.green = randomColorValue(255);
    this.blue = randomColorValue(255);

    ws281x.configure(config);
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);

    const color = (this.red << 16) | (this.green) | this.blue;

    for (let i = 0; i < this.pixelIndex; i++) {
      pixels[i] = color;
    };

    for (let i = 0; i < this.config.leds; i++) {
      if (this.pixelIndex === this.config.leds) {
        this.pixelIndex = 0;

        this.red = randomNumber(255);
        this.green = randomNumber(255);
        this.blue = randomNumber(255);
      };

      pixels[this.pixelIndex] = color;
    };

    this.pixelIndex++;
    ws281x.render(pixels);
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};
