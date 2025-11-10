export const setPixelColor = (pixelCount, color) => {
  const pixels = new Uint32Array(pixelCount);

    for (let i = 0; i < pixelCount; i++) {
      pixels[i] = color;
    };

    return pixels;
};