export const setPixelColor = (pixelCount, offset, color1, color2) => {
  const pixels = new Uint32Array(pixelCount);

    if (offset) {
      for (let i = 0; i < this.offset; i++) {
        pixels[i] = color1;
      };

      for (let i = this.offset; i < this.config.leds; i++) {
        pixels[i] = color2;
      };

      pixels[this.offset] = this.color1;
    } else {
      for (let i = 0; i < pixelCount; i++) {
        pixels[i] = color1;
      };
    };

    return pixels;
};