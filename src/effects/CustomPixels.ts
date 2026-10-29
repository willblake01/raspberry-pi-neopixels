import { safeRender } from '../ledRuntime.js';
import type { Effect, PixelSegment } from '../types/index.js';

const pixelNumber = (raw: string, leds: number): number => {
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > leds) throw new Error(`Pixel must be 1–${leds}, got "${raw}"`);
    return n - 1; // to 0-based
};

/** Parses "5" or "10-20" (1-based) into a 0-based inclusive range. */
export const parsePixelTarget = (raw: string, leds: number): { start: number; end: number } => {
    const target = raw.trim();
    if (!target) throw new Error('Enter a pixel like "5" or a range like "10-20"');

    const parts = target.split('-').map((p) => p.trim());
    if (parts.length === 1) {
        const index = pixelNumber(parts[0], leds);
        return { start: index, end: index };
    }
    if (parts.length === 2) {
        const start = pixelNumber(parts[0], leds);
        const end = pixelNumber(parts[1], leds);
        if (start > end) throw new Error(`Range "${target}" must go low to high`);
        return { start, end };
    }
    throw new Error('Enter a pixel like "5" or a range like "10-20"');
};

/** Pure: applies segments in order, so later segments override earlier ones. */
export const buildCustomPixels = (leds: number, segments: PixelSegment[]): Uint32Array => {
    const pixels = new Uint32Array(leds);
    for (const { start, end, color } of segments) {
        pixels.fill(color, start, end + 1);
    }
    return pixels;
};

/** Static effect: renders once; the strip holds the frame. */
export class CustomPixels implements Effect {
    private readonly frame: Uint32Array;

    constructor(leds: number, segments: PixelSegment[]) {
        this.frame = buildCustomPixels(leds, segments);
    }

    run() {
        safeRender(this.frame);
    }
}