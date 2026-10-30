import { PolledLocationEffect, type PolledLocationEffectConfig } from './utils/index.js';
import { fillSolid, packRGB } from './utils/color.js';
import { AQI_LABELS, aqiLevel, aqiToRGB } from '../weather/airQuality.js';
import {
    fetchAirQuality,
    locateByIp,
    locateByName,
    type AirQualityReading,
    type Location,
} from '../weather/api.js';

export const AQI_REFRESH_MS = 30 * 60 * 1000;    // the model updates about hourly
const AQI_MIN_REFETCH_GAP_MS = 10 * 60 * 1000;    // skip re-fetching on quick restarts

export interface AirQualityDeps {
    locate: () => Promise<Location>;
    fetchAirQuality: (location: Location) => Promise<AirQualityReading>;
    now?: () => number;
    log?: (message: string) => void;
}

export const airQualityConfig = (
    leds: number,
    deps: AirQualityDeps,
): PolledLocationEffectConfig<AirQualityReading> => ({
    name: 'Air quality',
    locate: deps.locate,
    fetch: deps.fetchAirQuality,
    buildFrame: (reading) => fillSolid(leds, packRGB(...aqiToRGB(reading.usAqi))),
    describe: (reading, location) =>
        `🌫️ ${location.name}: AQI ${Math.round(reading.usAqi)} (${AQI_LABELS[aqiLevel(reading.usAqi)]})`,
    refreshMs: AQI_REFRESH_MS,
    minRefetchGapMs: AQI_MIN_REFETCH_GAP_MS,
    now: deps.now,
    log: deps.log,
});

export const createAirQuality = (leds: number, mode: 'auto' | 'manual' = 'auto', query?: string) =>
    new PolledLocationEffect(
        airQualityConfig(leds, {
            locate: mode === 'manual' && query ? () => locateByName(query) : locateByIp,
            fetchAirQuality,
        }),
    );