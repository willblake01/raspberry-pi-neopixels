export const setPixelColor = (pixelCount, offset, color1, color2) => {
  const pixels = new Uint32Array(pixelCount);

    if (offset !== undefined) {
      for (let i = 0; i < offset; i++) {
        pixels[i] = color1;
      };

      for (let i = offset; i < pixelCount; i++) {
        pixels[i] = color2;
      };

      pixels[offset] = color1;
    } else {
      for (let i = 0; i < pixelCount; i++) {
        pixels[i] = color1;
      };
    };

    return pixels;
};