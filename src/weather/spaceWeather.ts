import type { RGB } from './colors.js';

export type KpLevel = 'quiet' | 'active' | 'storm' | 'strongStorm' | 'severeStorm';

export interface KpStyle {
    rgb: RGB;
    /** Breathe period in ms; omitted for a steady color. */
    pulseMs?: number;
}

export const KP_STYLES: Record<KpLevel, KpStyle> = {
    quiet: { rgb: [0, 100, 80] },                         // dim teal
    active: { rgb: [0, 180, 70] },                        // soft green
    storm: { rgb: [0, 255, 80], pulseMs: 6000 },          // aurora green, G1–G2
    strongStorm: { rgb: [120, 0, 255], pulseMs: 3000 },   // violet, G3
    severeStorm: { rgb: [255, 0, 90], pulseMs: 1500 },    // magenta-red, G4–G5
};

export const KP_LABELS: Record<KpLevel, string> = {
    quiet: 'quiet',
    active: 'active',
    storm: 'geomagnetic storm',
    strongStorm: 'strong geomagnetic storm',
    severeStorm: 'severe geomagnetic storm',
};

/** NOAA G-scale: Kp 5 = G1 … Kp 9 = G5. */
export const gScale = (kp: number): number => Math.max(0, Math.round(kp) - 4);

export const kpLevel = (kp: number): KpLevel => {
    const rounded = Math.round(Math.max(0, kp));
    if (rounded <= 3) return 'quiet';
    if (rounded === 4) return 'active';
    if (rounded <= 6) return 'storm';
    if (rounded === 7) return 'strongStorm';
    return 'severeStorm';
};

export const kpStyle = (kp: number): KpStyle => KP_STYLES[kpLevel(kp)];