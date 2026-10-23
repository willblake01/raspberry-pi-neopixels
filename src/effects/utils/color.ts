import { randomNumber } from '../../utils/index.js';

export const packRGB = (r: number, g: number, b: number): number =>
    ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);

export const randomColor = (): number =>
    packRGB(randomNumber(255), randomNumber(255), randomNumber(255));

/** Scale each channel of a packed color, clamped to 0–255. */
export const scaleColor = (color: number, scale: number): number => {
    const ch = (shift: number) =>
        Math.max(0, Math.min(255, Math.round(((color >> shift) & 0xff) * scale)));
    return packRGB(ch(16), ch(8), ch(0));
};

/** A strip filled with one color. */
export const fillSolid = (leds: number, color: number): Uint32Array =>
    new Uint32Array(leds).fill(color);