export const EFFECTS = {
    SOLID: 'solid',
    CHECKERBOARD: 'checkerboard',
    CHANGE: 'change',
    BLINK: 'blink',
    BREATHE: 'breathe',
    GROWING_BAR: 'growing_bar',
    WHEEL: 'wheel',
    WALK_PIXEL: 'walk pixel',
    WEATHER: 'weather',
  } as const;

// 1.0 - Off (no correction), 2.2 - sRGB (matches screen color), 2.5 - Middle ground, 2.8 (Adafruit's NeoPixel default), 3.0 - Upper practical limit (beyond which color is distorted)
export const GAMMA = { MIN: 1.0, MAX: 3.0, DEFAULT: 2.2 } as const;