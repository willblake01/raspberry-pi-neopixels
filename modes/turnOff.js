export class TurnOff {
    constructor(config) {
      this.config = config;

      ws281x.configure(this.config);
    };

    run() {
      const pixels = new Uint32Array(this.config.leds);

      const red = 0, green = 0, blue = 0;
      const color = (red << 16) | (green << 8) | blue;

      for (let i = 0; i < this.config.leds; i++) {
        pixels[i] = color;
      };

      ws281x.render(pixels);
    };
  };
