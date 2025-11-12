export const setPixelColor = (pixelCount, type, color1, offset, color2) => {
  const pixels = new Uint32Array(pixelCount);

  const setStrand = type === 'solid' || 'change' || 'blink' || 'breathe';

  if (setStrand) {
    for (let i = 0; i < pixelCount; i++) {
      pixels[i] = color1;
    };
  };

  if (type === 'creep') {
    for (let i = 0; i <= offset; i++) {
      pixels[i] = color1;
    };
  };

  if (type === 'walkPixel') {
    pixels[offset] = color1;
  };

  if (type === 'wheel') {
    for (let i = 0; i < offset; i++) {
      pixels[i] = color1;
    };

    for (let i = offset; i < pixelCount; i++) {
      pixels[i] = color2;
    };
  };

    return pixels;
};
