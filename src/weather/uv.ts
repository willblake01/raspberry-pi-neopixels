import type { RGB } from './colors.js';
import type { UVHour } from './api.js';

export type UvLevel = 'none' | 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';

/** Standard UV categories, as saturated LED colors. */
export const UV_COLORS: Record<UvLevel, RGB> = {
    none: [0, 60, 0],         // faint green glow when UV is 0 (night)
    low: [0, 255, 0],         // 1–2
    moderate: [255, 200, 0],  // 3–5
    high: [255, 80, 0],       // 6–7
    veryHigh: [255, 0, 0],    // 8–10
    extreme: [140, 0, 255],   // 11+
};

export const UV_LABELS: Record<UvLevel, string> = {
    none: 'none',
    low: 'low',
    moderate: 'moderate',
    high: 'high',
    veryHigh: 'very high',
    extreme: 'extreme',
};

/** UV index is reported as a whole number, so round before categorizing. */
export const uvLevel = (uv: number): UvLevel => {
    const rounded = Math.round(Math.max(0, uv));
    if (rounded === 0) return 'none';
    if (rounded <= 2) return 'low';
    if (rounded <= 5) return 'moderate';
    if (rounded <= 7) return 'high';
    if (rounded <= 10) return 'veryHigh';
    return 'extreme';
};

export const uvToRGB = (uv: number): RGB => UV_COLORS[uvLevel(uv)];

/** UV for the hour containing `now` (the latest reading at or before now). */
export const uvAt = (now: number, hours: UVHour[]): number | null => {
    let current: UVHour | null = null;
    for (const hour of hours) {
        if (hour.time > now) break;
        current = hour;
    }
    return current?.uv ?? null;
};