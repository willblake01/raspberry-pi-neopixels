import type { RGB } from './colors.js';

export type AqiLevel =
    | 'good'
    | 'moderate'
    | 'sensitive'
    | 'unhealthy'
    | 'veryUnhealthy'
    | 'hazardous';

/** US EPA AQI categories, as LED colors. */
export const AQI_COLORS: Record<AqiLevel, RGB> = {
    good: [0, 255, 0],             // 0–50
    moderate: [255, 200, 0],       // 51–100
    sensitive: [255, 100, 0],      // 101–150
    unhealthy: [255, 0, 0],        // 151–200
    veryUnhealthy: [150, 0, 255],  // 201–300
    hazardous: [128, 0, 32],       // 301+
};

export const AQI_LABELS: Record<AqiLevel, string> = {
    good: 'good',
    moderate: 'moderate',
    sensitive: 'unhealthy for sensitive groups',
    unhealthy: 'unhealthy',
    veryUnhealthy: 'very unhealthy',
    hazardous: 'hazardous',
};

export const aqiLevel = (aqi: number): AqiLevel => {
    const rounded = Math.round(Math.max(0, aqi));
    if (rounded <= 50) return 'good';
    if (rounded <= 100) return 'moderate';
    if (rounded <= 150) return 'sensitive';
    if (rounded <= 200) return 'unhealthy';
    if (rounded <= 300) return 'veryUnhealthy';
    return 'hazardous';
};

export const aqiToRGB = (aqi: number): RGB => AQI_COLORS[aqiLevel(aqi)];