import { mixRGB, type RGB } from './colors.js';
import type { DiurnalCycle } from './api.js';

export const SUN_COLORS: Record<'NIGHT' | 'DAWN' | 'GOLD' | 'WARM' | 'DAY', RGB> = {
    NIGHT: [40, 12, 0],    // very dim amber
    DAWN: [255, 60, 0],    // deep orange
    GOLD: [255, 150, 40],  // golden hour
    WARM: [255, 205, 140], // warm white
    DAY: [255, 240, 220],  // neutral daylight
};

const MIN = 60_000;

interface Keyframe {
    at: number;
    rgb: RGB;
}

/** Twilight extends this far before sunrise and after sunset. */
export const TWILIGHT_MS = 45 * MIN;
/** How long the moon takes to fade in after dusk and out before dawn. */
export const NIGHT_FADE_MS = 30 * MIN;

/** Color keyframes for one day, relative to its sunrise and sunset. */
export const dayKeyframes = ({ sunrise, sunset }: DiurnalCycle): Keyframe[] => {
    const { NIGHT, DAWN, GOLD, WARM, DAY } = SUN_COLORS;
    const midday = (sunrise + sunset) / 2;

    return [
        { at: sunrise - TWILIGHT_MS, rgb: NIGHT },
        { at: sunrise - 15 * MIN, rgb: DAWN },
        { at: sunrise + 15 * MIN, rgb: GOLD },
        { at: sunrise + 75 * MIN, rgb: WARM },
        // Full daylight plateau; clamped to midday so short winter days still reach it
        { at: Math.min(sunrise + 120 * MIN, midday), rgb: DAY },
        { at: Math.max(sunset - 120 * MIN, midday), rgb: DAY },
        { at: sunset - 60 * MIN, rgb: WARM },
        { at: sunset - 15 * MIN, rgb: GOLD },
        { at: sunset + 15 * MIN, rgb: DAWN },
        { at: sunset + TWILIGHT_MS, rgb: NIGHT },
    ];
};

/** Color for a moment in time, blended between the surrounding keyframes. */
export const daylightRGB = (now: number, days: DiurnalCycle[]): RGB => {
    const frames = days.flatMap(dayKeyframes).sort((a, b) => a.at - b.at);
    const last = frames[frames.length - 1];

    if (frames.length === 0 || now <= frames[0].at || now >= last.at) {
        return SUN_COLORS.NIGHT;
    }

    const i = frames.findIndex((f) => f.at > now);
    const lo = frames[i - 1];
    const hi = frames[i];
    const span = hi.at - lo.at;

    return span <= 0 ? hi.rgb : mixRGB(lo.rgb, hi.rgb, (now - lo.at) / span);
};

/**
 * 0 during the day and twilight, rising to 1 within NIGHT_FADE_MS of full night.
 * Used to fade the moon in after dusk and out before dawn.
 */
export const nightDepth = (now: number, days: DiurnalCycle[]): number => {
    const windows = days.map(({ sunrise, sunset }) => ({
        start: sunrise - TWILIGHT_MS,
        end: sunset + TWILIGHT_MS,
    }));

    if (windows.some((w) => now > w.start && now < w.end)) return 0;

    const distance = Math.min(
        ...windows.flatMap((w) => [Math.abs(now - w.start), Math.abs(now - w.end)]),
    );
    return Math.min(1, distance / NIGHT_FADE_MS);
};