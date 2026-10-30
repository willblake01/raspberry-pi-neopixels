import { safeRender } from '../ledRuntime.js';
import { fillSolid, packRGB } from './utils/color.js';
import { IntervalRunner } from './utils/index.js';
import { UV_LABELS, uvAt, uvLevel, uvToRGB, type UvLevel } from '../weather/uv.js';
import {
    fetchUvIndex,
    locateByIp,
    locateByName,
    type Location,
    type UVForecast,
} from '../weather/api.js';
import type { Effect } from '../types/index.js';

export const UV_REFRESH_MS = 3 * 60 * 60 * 1000; // re-fetch hourly data every 3 hours
export const UV_TICK_MS = 5 * 60 * 1000;         // pick up the new hour within 5 minutes
const MIN_REFETCH_GAP_MS = 30 * 60 * 1000;        // skip re-fetching on quick restarts

export interface UVIndexDeps {
    locate: () => Promise<Location>;
    fetchUv: (location: Location) => Promise<UVForecast>;
    now?: () => number;
    log?: (message: string) => void;
}

export class UVIndex implements Effect {
    private locationPromise: Promise<Location> | null = null;
    private forecast: UVForecast | null = null;
    private fetchedAt = 0;
    private lastColor: number | null = null;
    private lastLevel: UvLevel | null = null;
    private active = false;
    private refreshing = false;
    private readonly refreshRunner: IntervalRunner;
    private readonly tickRunner: IntervalRunner;

    constructor(
        private readonly leds: number,
        private readonly deps: UVIndexDeps,
        refreshMs = UV_REFRESH_MS,
        tickMs = UV_TICK_MS,
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
            this.locationPromise = null;
            throw err;
        });
        return this.locationPromise;
    }

    private async refresh() {
        if (this.refreshing) return;
        if (this.forecast && this.now() - this.fetchedAt < MIN_REFETCH_GAP_MS) return;

        this.refreshing = true;
        try {
            const location = await this.getLocation();
            this.forecast = await this.deps.fetchUv(location);
            this.fetchedAt = this.now();

            const peak = this.forecast.maxToday;
            this.log(`☀️ ${location.name}: UV peak today ${peak === null ? 'unknown' : Math.round(peak)}`);
            this.render();
        } catch (err) {
            // Keep the previous forecast; try again next refresh
            this.log(`⚠️ UV update failed: ${(err as Error).message}`);
        } finally {
            this.refreshing = false;
        }
    }

    private render() {
        if (!this.active || !this.forecast) return;

        const uv = uvAt(this.now(), this.forecast.hours);
        if (uv === null) return;

        const level = uvLevel(uv);
        if (level !== this.lastLevel) {
            this.lastLevel = level;
            this.log(`🕶️ UV ${Math.round(uv)} (${UV_LABELS[level]})`);
        }

        const color = packRGB(...uvToRGB(uv));
        if (color === this.lastColor) return;

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

export const createUVIndex = (leds: number, mode: 'auto' | 'manual' = 'auto', query?: string) =>
    new UVIndex(leds, {
        locate: mode === 'manual' && query ? () => locateByName(query) : locateByIp,
        fetchUv: fetchUvIndex,
    });