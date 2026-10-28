import { packRGB } from '../effects/utils/color.js';
import type { CurrentWeather } from './api.js';

export type RGB = readonly [number, number, number];

export const RAIN_COLOR: RGB = [0, 0, 255];

/**
 * Cold → hot gradient. Colder is a pale icy white (distinct from rain blue),
 * warming through soft white and amber to red. Temperatures outside the
 * range use the end colors.
 */
export const TEMPERATURE_STOPS: readonly { tempF: number; rgb: RGB }[] = [
    { tempF: 20,  rgb: [200, 230, 255] }, // icy white
    { tempF: 50,  rgb: [255, 240, 190] }, // soft warm white
    { tempF: 70,  rgb: [255, 180, 60] },  // amber
    { tempF: 85,  rgb: [255, 90, 20] },   // orange-red
    { tempF: 100, rgb: [255, 0, 0] },     // red
];

// WMO weather codes: drizzle, freezing drizzle, rain, freezing rain, showers, thunderstorms
const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
// Snow and snow showers count as "not rain"; the cold color shows instead
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);

export const isRaining = ({ weatherCode, precipitationIn }: CurrentWeather) =>
    RAIN_CODES.has(weatherCode) || (precipitationIn > 0 && !SNOW_CODES.has(weatherCode));

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

export const temperatureToRGB = (
    tempF: number,
    stops: readonly { tempF: number; rgb: RGB }[] = TEMPERATURE_STOPS,
): RGB => {
    if (tempF <= stops[0].tempF) return stops[0].rgb;
    const last = stops[stops.length - 1];
    if (tempF >= last.tempF) return last.rgb;

    const i = stops.findIndex((s) => s.tempF > tempF);
    const lo = stops[i - 1];
    const hi = stops[i];
    const t = (tempF - lo.tempF) / (hi.tempF - lo.tempF);

    return [lerp(lo.rgb[0], hi.rgb[0], t), lerp(lo.rgb[1], hi.rgb[1], t), lerp(lo.rgb[2], hi.rgb[2], t)];
};

export const weatherToColor = (weather: CurrentWeather): number =>
    packRGB(...(isRaining(weather) ? RAIN_COLOR : temperatureToRGB(weather.temperatureF)));