import { PolledLocationEffect, type PolledLocationEffectConfig } from './utils/index.js';
import { breatheScale } from './Breathe.js';
import { fillSolid, packRGB, scaleColor } from './utils/color.js';
import { KP_LABELS, gScale, kpLevel, kpStyle } from '../weather/spaceWeather.js';
import { fetchKp, type Location, type SpaceWeatherReading } from '../weather/api.js';

export const KP_REFRESH_MS = 5 * 60 * 1000;      // Kp changes slowly
const KP_MIN_REFETCH_GAP_MS = 2 * 60 * 1000;     // skip re-fetching on quick restarts
const KP_TICK_MS = 50;                           // smooth pulsing during storms
const PULSE_FLOOR = 0.3;

/** Kp is global, so there's no real location to look up. */
const EARTH: Location = { latitude: 0, longitude: 0, name: 'Earth' };

export interface SpaceWeatherDeps {
    fetchKp: () => Promise<SpaceWeatherReading>;
    now?: () => number;
    log?: (message: string) => void;
}

export const spaceWeatherConfig = (
    leds: number,
    deps: SpaceWeatherDeps,
): PolledLocationEffectConfig<SpaceWeatherReading> => ({
    name: 'Space weather',
    locate: async () => EARTH,
    fetch: () => deps.fetchKp(),
    buildFrame: ({ kp }, now) => {
        const { rgb, pulseMs } = kpStyle(kp);
        const level = pulseMs ? breatheScale(now, pulseMs, PULSE_FLOOR) : 1;
        return fillSolid(leds, scaleColor(packRGB(...rgb), level));
    },
    describe: ({ kp }) => {
        const g = gScale(kp);
        return `🌌 Space weather: ${KP_LABELS[kpLevel(kp)]} (Kp ${Math.round(kp)}${g > 0 ? `, G${g}` : ''})`;
    },
    refreshMs: KP_REFRESH_MS,
    tickMs: KP_TICK_MS,
    minRefetchGapMs: KP_MIN_REFETCH_GAP_MS,
    now: deps.now,
    log: deps.log,
});

export const createSpaceWeather = (leds: number) =>
    new PolledLocationEffect(spaceWeatherConfig(leds, { fetchKp }));