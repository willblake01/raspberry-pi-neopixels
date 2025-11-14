import { EFFECTS } from '../../constants/index.js'

export const setPixelColor = ({ pixelCount, effect, color1, offset, color2 }) => {
  const pixels = new Uint32Array(pixelCount);

  switch (effect) {
    case EFFECTS.CREEP:

      // Set pixels up to and including offset to color
      for (let i = 0; i <= offset; i++) {
        pixels[i] = color1;
      };
      break;
    case EFFECTS.WALK_PIXEL:

      if (EFFECTS.WALK_PIXEL.PIXEL_STATE === 0) {

        // Set pixel at index to 0 and rest of strand to color
        for (let i = 0; i < pixelCount; i++) {
          if (i === offset) {
            pixels[offset] = 0;
          } else {
            pixels[i] = color1;
          };
        };
      } else {

        // Set pixel at offset to color
        pixels[offset] = color1;
      };
      break;
    case EFFECTS.WHEEL:

      // Set pixels up to and including offset to color1 and rest of strand to color2
      for (let i = 0; i <= offset; i++) {
        pixels[i] = color1;
      };

      for (let i = offset + 1; i < pixelCount; i++) {
        pixels[i] = color2;
      };
      break;
    default:

      // Set strand to color i.g., Solid, Change, Blink, Breathe
      for (let i = 0; i < pixelCount; i++) {
        pixels[i] = color1;
      };
  };

    return pixels;
};
