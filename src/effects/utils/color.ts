import { randomNumber } from '../../utils/index.js';

export const packRGB = (r: number, g: number, b: number): number =>
    ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);

export const randomColor = (): number =>
    packRGB(randomNumber(255), randomNumber(255), randomNumber(255));