import { scaleColor } from '../effects/utils/color.js';
import type { RGB } from '../weather/colors.js';

/** Cool moonlight white. */
export const MOON_COLOR: RGB = [180, 200, 255];

/** Average length of a lunar cycle (new moon to new moon), in days. */
export const SYNODIC_MONTH_DAYS = 29.530588853;

/** A known new moon used as the reference point for the cycle. */
export const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

const DAY_MS = 86_400_000;

/** 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter. */
export const moonPhase = (now: number): number => {
    const cycles = (now - KNOWN_NEW_MOON) / (SYNODIC_MONTH_DAYS * DAY_MS);
    return cycles - Math.floor(cycles);
};

/** Fraction of the visible disc that's lit, 0 (new) to 1 (full). */
export const moonIllumination = (phase: number): number =>
    (1 - Math.cos(2 * Math.PI * phase)) / 2;

/** True from new moon up to (not including) full moon. */
export const isWaxing = (phase: number): boolean => phase < 0.5;

const PHASE_NAMES = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent',
] as const;

/** Name of the nearest of the eight standard phases. */
export const moonPhaseName = (phase: number): string =>
    PHASE_NAMES[Math.round(phase * 8) % 8];

/**
 * Pure: the strip as the moon. Waxing lights from the end of the strip;
 * waning keeps the start lit. The terminator pixel is partially lit.
 */
export const buildMoonFrame = (
    leds: number,
    illumination: number,
    waxing: boolean,
    color: number,
): Uint32Array => {
    const pixels = new Uint32Array(leds);
    const exact = Math.min(1, Math.max(0, illumination)) * leds;
    const full = Math.floor(exact);
    const edge = exact - full;

    if (waxing) {
        pixels.fill(color, leds - full);
        if (edge > 0 && full < leds) pixels[leds - full - 1] = scaleColor(color, edge);
    } else {
        pixels.fill(color, 0, full);
        if (edge > 0 && full < leds) pixels[full] = scaleColor(color, edge);
    }

    return pixels;
};