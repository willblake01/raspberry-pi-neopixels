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
    CUSTOM_PIXELS: 'custom_pixels',
    SUNRISE_SUNSET: 'sunrise_sunset'
} as const;

// 1.0 - Off (no correction), 2.2 - sRGB (matches screen color), 2.5 - Middle ground, 2.8 (Adafruit's NeoPixel default), 3.0 - Upper practical limit (beyond which color is distorted)
export const GAMMA = { MIN: 1.0, MAX: 3.0, DEFAULT: 2.2 } as const;

export const LEDS = { MIN: 1, MAX: 100, DEFAULT: 100 } as const;