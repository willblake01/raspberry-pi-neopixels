export class WalkPixel {
    constructor(config, redValue, greenValue, blueValue) {
      this.config = config;
      this.redValue = redValue;
      this.greenValue = greenValue;
      this.blueValue = blueValue;
      this.offset = 0;

      ws281x.configure(this.config);
    };

    loop() {
      const pixels = new Uint32Array(this.config.leds);

      const red = this.redValue, green = this.greenValue, blue = this.blueValue;
      const color = (red << 16) | (green << 8) | blue;

      pixels[this.offset] = color;

      this.offset = (this.offset + 1) % leds;

      ws281x.render(pixels);
    };

    run() {
      setInterval(this.loop.bind(this), 100);
    };
  };
