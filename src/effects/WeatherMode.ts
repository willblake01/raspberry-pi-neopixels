import { safeRender } from '../ledRuntime.js';
import { fillSolid } from './utils/color.js';
import { IntervalRunner } from './utils/index.js';
import { BreatheCustom } from './Breathe.js';
import { weatherToColor, isRaining } from '../weather/colors.js';
import { alertStyle, type AlertStyle } from '../weather/alerts.js';
import {
    locateByIp,
    locateByName,
    fetchCurrentWeather,
    fetchActiveAlerts,
    type Location,
    type CurrentWeather,
    type WeatherAlert,
} from '../weather/api.js';
import type { Effect } from '../types/index.js';

export const DEFAULT_POLL_MS = 15 * 60 * 1000;
export const DEFAULT_ALERT_POLL_MS = 5 * 60 * 1000;

export interface WeatherModeDeps {
    locate: () => Promise<Location>;
    fetchWeather: (location: Location) => Promise<CurrentWeather>;
    /** Omit to disable alerts. */
    fetchAlerts?: (location: Location) => Promise<WeatherAlert[]>;
    makeAlertEffect?: (style: AlertStyle) => Effect;
    log?: (message: string) => void;
}

export class WeatherMode implements Effect {
    private locationPromise: Promise<Location> | null = null;
    private weather: CurrentWeather | null = null;
    private style: AlertStyle | null = null;
    private alertEffect: Effect | null = null;
    private alertEffectStyle: AlertStyle | null = null;
    private active = false;
    private weatherInFlight = false;
    private alertsInFlight = false;
    private readonly weatherRunner: IntervalRunner;
    private readonly alertRunner: IntervalRunner | null;

    constructor(
        private readonly leds: number,
        private readonly deps: WeatherModeDeps,
        weatherPollMs = DEFAULT_POLL_MS,
        alertPollMs = DEFAULT_ALERT_POLL_MS,
    ) {
        this.weatherRunner = new IntervalRunner(weatherPollMs, () => void this.updateWeather());
        this.alertRunner = deps.fetchAlerts
            ? new IntervalRunner(alertPollMs, () => void this.updateAlerts())
            : null;
    }

    private get log() {
        return this.deps.log ?? console.log;
    }

    /** Shared by both pollers, so the location is looked up only once. */
    private getLocation(): Promise<Location> {
        this.locationPromise ??= this.deps.locate().catch((err) => {
            this.locationPromise = null; // retry on the next poll
            throw err;
        });
        return this.locationPromise;
    }

    private async updateWeather() {
        if (this.weatherInFlight) return;
        this.weatherInFlight = true;
        try {
            const location = await this.getLocation();
            this.weather = await this.deps.fetchWeather(location);
            this.log(
                `🌡️ ${location.name}: ${Math.round(this.weather.temperatureF)}°F` +
                (isRaining(this.weather) ? ', raining' : ''),
            );
            this.render();
        } catch (err) {
            this.log(`⚠️ Weather update failed: ${(err as Error).message}`);
        } finally {
            this.weatherInFlight = false;
        }
    }

    private async updateAlerts() {
        if (this.alertsInFlight || !this.deps.fetchAlerts) return;
        this.alertsInFlight = true;
        try {
            const location = await this.getLocation();
            const alerts = await this.deps.fetchAlerts(location);
            const next = alertStyle(alerts);
            if (next?.level !== this.style?.level) {
                this.log(next ? `🚨 Active ${next.level}: ${alerts.map((a) => a.event).join(', ')}` : '✅ Alerts cleared');
            }
            this.style = next;
            this.render();
        } catch (err) {
            // Keep the current alert state; try again next poll
            this.log(`⚠️ Alert update failed: ${(err as Error).message}`);
        } finally {
            this.alertsInFlight = false;
        }
    }

    /** Alert pulse beats rain/temperature color. */
    private render() {
        if (!this.active) return;

        if (this.style) {
            if (this.alertEffectStyle !== this.style) {
                this.alertEffect?.stop?.();
                this.alertEffect = this.makeAlertEffect(this.style);
                this.alertEffectStyle = this.style;
                this.alertEffect.run();
            }
            return;
        }

        this.stopAlertEffect();
        if (this.weather) {
            safeRender(fillSolid(this.leds, weatherToColor(this.weather)));
        }
    }

    private makeAlertEffect(style: AlertStyle): Effect {
        return (
            this.deps.makeAlertEffect?.(style) ??
            new BreatheCustom(this.leds, style.periodMs, ...style.rgb, 0.15)
        );
    }

    private stopAlertEffect() {
        this.alertEffect?.stop?.();
        this.alertEffect = null;
        this.alertEffectStyle = null;
    }

    run() {
        this.active = true;
        this.weatherRunner.start();
        this.alertRunner?.start();
    }

    stop() {
        this.active = false;
        this.weatherRunner.stop();
        this.alertRunner?.stop();
        this.stopAlertEffect();
    }
}

export const createWeatherMode = (
    leds: number,
    mode: 'auto' | 'manual' = 'auto',
    query?: string,
    alertsEnabled = false,
) =>
    new WeatherMode(leds, {
        locate: mode === 'manual' && query ? () => locateByName(query) : locateByIp,
        fetchWeather: fetchCurrentWeather,
        fetchAlerts: alertsEnabled ? fetchActiveAlerts : undefined,
    });