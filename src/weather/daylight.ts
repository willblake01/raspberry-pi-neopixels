import { mixRGB, type RGB } from './colors.js';
import type { SunDay } from './api.js';

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

/** Color keyframes for one day, relative to its sunrise and sunset. */
export const dayKeyframes = ({ sunrise, sunset }: SunDay): Keyframe[] => {
    const { NIGHT, DAWN, GOLD, WARM, DAY } = SUN_COLORS;
    const midday = (sunrise + sunset) / 2;

    return [
        { at: sunrise - 45 * MIN, rgb: NIGHT },
        { at: sunrise - 15 * MIN, rgb: DAWN },
        { at: sunrise + 15 * MIN, rgb: GOLD },
        { at: sunrise + 75 * MIN, rgb: WARM },
        // Full daylight plateau; clamped to midday so short winter days still reach it
        { at: Math.min(sunrise + 120 * MIN, midday), rgb: DAY },
        { at: Math.max(sunset - 120 * MIN, midday), rgb: DAY },
        { at: sunset - 60 * MIN, rgb: WARM },
        { at: sunset - 15 * MIN, rgb: GOLD },
        { at: sunset + 15 * MIN, rgb: DAWN },
        { at: sunset + 45 * MIN, rgb: NIGHT },
    ];
};

/** Color for a moment in time, blended between the surrounding keyframes. */
export const daylightRGB = (now: number, days: SunDay[]): RGB => {
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