import type { RGB } from './colors.js';
import type { WeatherAlert } from './api.js';

export interface AlertStyle {
    level: 'warning' | 'watch';
    rgb: RGB;
    periodMs: number; // breathe speed: faster = more urgent
}

export const WARNING_STYLE: AlertStyle = { level: 'warning', rgb: [255, 0, 0], periodMs: 1500 };
export const WATCH_STYLE: AlertStyle = { level: 'watch', rgb: [255, 120, 0], periodMs: 4000 };

/** Most urgent style among active alerts. Advisories and statements are ignored. */
export const alertStyle = (alerts: WeatherAlert[]): AlertStyle | null => {
    if (alerts.some((a) => /warning$/i.test(a.event) || a.severity === 'Extreme')) return WARNING_STYLE;
    if (alerts.some((a) => /watch$/i.test(a.event))) return WATCH_STYLE;
    return null;
};