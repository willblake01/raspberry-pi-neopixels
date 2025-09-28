import ws281x from 'rpi-ws281x';
import { randomNumber } from '../utils/index.js';

export class BlinkCustomColor {
  constructor(config, interval, redValue, greenValue, blueValue) {
    this.config = config;
    this.interval = interval;
    this.redValue = redValue;
    this.greenValue = greenValue;
    this.blueValue = blueValue;
    this.on = false;

    ws281x.configure(config);
  };

  handlePixelState = () => {
    this.red = this.on ? this.red : 0, this.green = this.on ? this.green : 0, this.blue = this.on ? this.blue : 0;
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);
    this.handlePixelState();
    
    let red = this.red, green = this.green, blue = this.blue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class BlinkRandomColorChange {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
    this.on = false;

    ws281x.configure(config);
  };

  handlePixelState = () => {
    this.red = this.on ? randomNumber(255) : 0, this.green = this.on ? randomNumber(255) : 0, this.blue = this.on ? randomNumber(255) : 0;
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);
    this.handlePixelState();
    
    let red = this.red, green = this.green, blue = this.blue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};

export class BlinkRandomColorStatic {
  constructor(config, interval) {
    this.config = config;
    this.interval = interval;
    this.red = randomNumber(255);
    this.green = randomNumber(255);
    this.blue = randomNumber(255);
    this.on = false;

    ws281x.configure(config);
  };

  handlePixelState = () => {
    this.red = this.on ? this.red : 0, this.green = this.on ? this.green : 0, this.blue = this.on ? this.blue : 0;
  };

  loop() {
    const pixels = new Uint32Array(this.config.leds);
    this.handlePixelState();

    let red = this.red, green = this.green, blue = this.blue;
    const color = (red << 16) | (green << 8) | blue;

    for (let i = 0; i < this.config.leds; i++) {
      pixels[i] = color;
    };

    ws281x.render(pixels);
    this.on = !this.on;
  };

  run() {
    this.loop();
    setInterval(this.loop.bind(this), this.interval);
  };
};
