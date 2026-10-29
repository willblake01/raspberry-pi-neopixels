import { safeRender } from '../ledRuntime.js';
import { fillSolid, packRGB } from './utils/color.js';
import { IntervalRunner } from './utils/index.js';
import { daylightRGB } from '../weather/daylight.js';
import {
    locateByIp,
    locateByName,
    fetchSunTimes,
    type Location,
    type SunDay,
} from '../weather/api.js';
import type { Effect } from '../types/index.js';

export const SUN_REFRESH_MS = 6 * 60 * 60 * 1000; // re-fetch sun times every 6 hours
export const SUN_TICK_MS = 60 * 1000;             // recompute the color every minute
const MIN_REFETCH_GAP_MS = 60 * 60 * 1000;        // skip re-fetching on quick restarts

export interface SunriseSunsetDeps {
    locate: () => Promise<Location>;
    fetchSunTimes: (location: Location) => Promise<SunDay[]>;
    now?: () => number;
    log?: (message: string) => void;
}

const formatTime = (ms: number) =>
    new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export class SunriseSunset implements Effect {
    private locationPromise: Promise<Location> | null = null;
    private days: SunDay[] | null = null;
    private fetchedAt = 0;
    private lastColor: number | null = null;
    private active = false;
    private refreshing = false;
    private readonly refreshRunner: IntervalRunner;
    private readonly tickRunner: IntervalRunner;

    constructor(
        private readonly leds: number,
        private readonly deps: SunriseSunsetDeps,
        refreshMs = SUN_REFRESH_MS,
        tickMs = SUN_TICK_MS,
    ) {
        this.refreshRunner = new IntervalRunner(refreshMs, () => void this.refresh());
        this.tickRunner = new IntervalRunner(tickMs, () => this.render());
    }

    private get log() {
        return this.deps.log ?? console.log;
    }

    private now() {
        return (this.deps.now ?? Date.now)();
    }

    private getLocation(): Promise<Location> {
        this.locationPromise ??= this.deps.locate().catch((err) => {
            this.locationPromise = null; // retry next time
            throw err;
        });
        return this.locationPromise;
    }

    private async refresh() {
        if (this.refreshing) return;
        // Restarting (e.g. after a motion override) shouldn't re-fetch every time
        if (this.days && this.now() - this.fetchedAt < MIN_REFETCH_GAP_MS) return;

        this.refreshing = true;
        try {
            const location = await this.getLocation();
            this.days = await this.deps.fetchSunTimes(location);
            this.fetchedAt = this.now();

            const today = this.days[0];
            this.log(`🌅 ${location.name}: sunrise ${formatTime(today.sunrise)}, sunset ${formatTime(today.sunset)}`);
            this.render();
        } catch (err) {
            // Keep the previous sun times; try again next refresh
            this.log(`⚠️ Sunrise/Sunset times update failed: ${(err as Error).message}`);
        } finally {
            this.refreshing = false;
        }
    }

    private render() {
        if (!this.active || !this.days) return;

        const color = packRGB(...daylightRGB(this.now(), this.days));
        if (color === this.lastColor) return; // no visible change this minute

        this.lastColor = color;
        safeRender(fillSolid(this.leds, color));
    }

    run() {
        this.active = true;
        this.lastColor = null; // always draw on (re)start
        this.refreshRunner.start();
        this.tickRunner.start();
    }

    stop() {
        this.active = false;
        this.refreshRunner.stop();
        this.tickRunner.stop();
    }
}

export const createSunriseSunset = (leds: number, mode: 'auto' | 'manual' = 'auto', query?: string) =>
    new SunriseSunset(leds, {
        locate: mode === 'manual' && query ? () => locateByName(query) : locateByIp,
        fetchSunTimes,
    });