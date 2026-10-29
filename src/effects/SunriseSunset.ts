import { safeRender } from '../ledRuntime.js';
import { fillSolid, framesEqual, mixColors, packRGB } from './utils/color.js';
import { IntervalRunner } from './utils/index.js';
import { daylightRGB, nightDepth } from '../weather/daylight.js';
import {
    MOON_COLOR,
    buildMoonFrame,
    isWaxing,
    moonIllumination,
    moonPhase,
    moonPhaseName,
} from '../astronomy/moon.js';
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
    /** Show the moon phase at night. */
    showMoon?: boolean;
    now?: () => number;
    log?: (message: string) => void;
}

const formatTime = (ms: number) =>
    new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export class SunriseSunset implements Effect {
    private locationPromise: Promise<Location> | null = null;
    private days: SunDay[] | null = null;
    private fetchedAt = 0;
    private lastFrame: Uint32Array | null = null;
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

            if (this.deps.showMoon) {
                const phase = moonPhase(this.now());
                this.log(`🌙 ${moonPhaseName(phase)}, ${Math.round(moonIllumination(phase) * 100)}% illuminated`);
            }

            this.render();
        } catch (err) {
            // Keep the previous sun times; try again next refresh
            this.log(`⚠️ Sunrise/Sunset times update failed: ${(err as Error).message}`);
        } finally {
            this.refreshing = false;
        }
    }

    /** Daylight color, blended with the moon at night when enabled. */
    private buildFrame(now: number, days: SunDay[]): Uint32Array {
        const sky = fillSolid(this.leds, packRGB(...daylightRGB(now, days)));
        if (!this.deps.showMoon) return sky;

        const depth = nightDepth(now, days);
        if (depth === 0) return sky;

        const phase = moonPhase(now);
        const moon = buildMoonFrame(
            this.leds,
            moonIllumination(phase),
            isWaxing(phase),
            packRGB(...MOON_COLOR),
        );
        return moon.map((m, i) => mixColors(sky[i], m, depth));
    }

    private render() {
        if (!this.active || !this.days) return;

        const frame = this.buildFrame(this.now(), this.days);
        if (this.lastFrame && framesEqual(frame, this.lastFrame)) return;

        this.lastFrame = frame;
        safeRender(frame);
    }

    run() {
        this.active = true;
        this.lastFrame = null; // always draw on (re)start
        this.refreshRunner.start();
        this.tickRunner.start();
    }

    stop() {
        this.active = false;
        this.refreshRunner.stop();
        this.tickRunner.stop();
    }
}

export const createSunriseSunset = (
    leds: number,
    mode: 'auto' | 'manual' = 'auto',
    query?: string,
    showMoon = false,
) =>
    new SunriseSunset(leds, {
        locate: mode === 'manual' && query ? () => locateByName(query) : locateByIp,
        fetchSunTimes,
        showMoon,
    });