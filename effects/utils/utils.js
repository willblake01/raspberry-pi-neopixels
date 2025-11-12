export const setPixelColor = (pixelCount, color1, offset, color2) => {
  const pixels = new Uint32Array(pixelCount);

    if (typeof offset !== 'undefined') {
      if (typeof color2 !== 'undefined') {
        pixels[this.offset] = color1;
        return;
      };

      for (let i = 0; i <= offset; i++) {
        pixels[i] = color1;
      };

      for (let i = offset; i < pixelCount; i++) {
        pixels[i] = color2;
      };
    } else {
      for (let i = 0; i < pixelCount; i++) {
        pixels[i] = color1;
      };
    };

    return pixels;
};
