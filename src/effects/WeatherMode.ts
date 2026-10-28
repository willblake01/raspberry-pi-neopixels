import { safeRender } from '../ledRuntime.js';
import { fillSolid } from './utils/color.js';
import { IntervalRunner } from './utils/index.js';
import { weatherToColor, isRaining } from '../weather/colors.js';
import {
    locateByIp,
    locateByName,
    fetchCurrentWeather,
    type Location,
    type CurrentWeather,
} from '../weather/api.js';
import type { Effect } from '../types/index.js';

export const DEFAULT_POLL_MS = 10 * 60 * 1000; // 10 minutes

export interface WeatherModeDeps {
    locate: () => Promise<Location>;
    fetchWeather: (location: Location) => Promise<CurrentWeather>;
    log?: (message: string) => void;
}

export class WeatherMode implements Effect {
    private location: Location | null = null;
    private active = false;
    private inFlight = false;
    private readonly runner: IntervalRunner;

    constructor(
        private readonly leds: number,
        private readonly deps: WeatherModeDeps,
        pollMs = DEFAULT_POLL_MS,
    ) {
        this.runner = new IntervalRunner(pollMs, () => {
            void this.update();
        });
    }

    private async update() {
        if (this.inFlight) return; // never overlap slow requests
        this.inFlight = true;
        const log = this.deps.log ?? console.log;

        try {
            this.location ??= await this.deps.locate(); // look up once, then cache
            const weather = await this.deps.fetchWeather(this.location);

            if (!this.active) return; // stopped while waiting on the network

            safeRender(fillSolid(this.leds, weatherToColor(weather)));
            log(
                `🌡️ ${this.location.name}: ${Math.round(weather.temperatureF)}°F` +
                (isRaining(weather) ? ', raining' : ''),
            );
        } catch (err) {
            // Keep the last color; try again on the next poll
            log(`⚠️ Weather update failed: ${(err as Error).message}`);
        } finally {
            this.inFlight = false;
        }
    }

    run() {
        this.active = true;
        this.runner.start();
    }

    stop() {
        this.active = false;
        this.runner.stop();
    }
}

/** Wires the real APIs based on the prompt answers. */
export const createWeatherMode = (
    leds: number,
    mode: 'auto' | 'manual' = 'auto',
    query?: string,
) =>
    new WeatherMode(leds, {
        locate: mode === 'manual' && query ? () => locateByName(query) : locateByIp,
        fetchWeather: fetchCurrentWeather,
    });