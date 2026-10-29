import { safeRender } from '../ledRuntime.js';
import { packRGB } from './utils/color.js';
import type { Effect } from '../types/index.js';

export interface PixelSpec {
    start: number; // 0-based, inclusive
    end: number;   // 0-based, inclusive
    color: number;
}

const channel = (raw: string, name: string): number => {
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 0 || n > 255) throw new Error(`${name} must be 0–255, got "${raw}"`);
    return n;
};

const pixelNumber = (raw: string, leds: number): number => {
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > leds) throw new Error(`Pixel must be 1–${leds}, got "${raw}"`);
    return n - 1; // to 0-based
};

/** Parses "target, r, g, b; ..." where target is N, N-M or "all". Throws with a readable message. */
export const parsePixelSpecs = (input: string, leds: number): PixelSpec[] => {
    const entries = input.split(';').map((e) => e.trim()).filter(Boolean);
    if (entries.length === 0) throw new Error('Enter at least one entry, e.g. "99, 255, 255, 255"');

    return entries.map((entry, i) => {
        const parts = entry.split(',').map((p) => p.trim());
        if (parts.length !== 4) {
            throw new Error(`Entry ${i + 1} ("${entry}") needs 4 values: pixel, red, green, blue`);
        }

        const [target, r, g, b] = parts;
        const color = packRGB(channel(r, 'Red'), channel(g, 'Green'), channel(b, 'Blue'));

        if (target.toLowerCase() === 'all') return { start: 0, end: leds - 1, color };

        const range = target.split('-');
        if (range.length === 2) {
            const start = pixelNumber(range[0], leds);
            const end = pixelNumber(range[1], leds);
            if (start > end) throw new Error(`Range "${target}" must go low to high`);
            return { start, end, color };
        }

        const index = pixelNumber(target, leds);
        return { start: index, end: index, color };
    });
};

/** Pure: applies specs in order, so later entries override earlier ones. */
export const buildCustomPixels = (leds: number, specs: PixelSpec[]): Uint32Array => {
    const pixels = new Uint32Array(leds);
    for (const { start, end, color } of specs) {
        pixels.fill(color, start, end + 1);
    }
    return pixels;
};

/** Static effect: renders once; the strip holds the frame. */
export class CustomPixels implements Effect {
    private readonly frame: Uint32Array;

    constructor(leds: number, input: string) {
        this.frame = buildCustomPixels(leds, parsePixelSpecs(input, leds));
    }

    run() {
        safeRender(this.frame);
    }
}