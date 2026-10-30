import { safeRender } from '../../ledRuntime.js';
import { framesEqual } from './color.js';
import { IntervalRunner } from './IntervalRunner.js';
import type { Location } from '../../weather/api.js';
import type { Effect } from '../../types/index.js';

export interface PolledLocationEffectConfig<T> {
    /** Used in error messages, e.g. "Air quality". */
    name: string;
    locate: () => Promise<Location>;
    fetch: (location: Location) => Promise<T>;
    /** Pure: the frame to show for this data at this time, or null for nothing yet. */
    buildFrame: (data: T, now: number) => Uint32Array | null;
    /** Optional status line; logged only when it changes. */
    describe?: (data: T, location: Location, now: number) => string;
    refreshMs: number;
    /** Re-render from cached data between fetches (for time-dependent frames). */
    tickMs?: number;
    /** Skip fetching if the last success was this recent (e.g. on quick restarts). Keep below refreshMs. */
    minRefetchGapMs?: number;
    now?: () => number;
    log?: (message: string) => void;
}

/**
 * Fetches location-based data on an interval and renders it.
 * Looks up the location once, keeps the last frame on failure,
 * renders only when the frame changes, and redraws immediately on restart.
 */
export class PolledLocationEffect<T> implements Effect {
    private locationPromise: Promise<Location> | null = null;
    private location: Location | null = null;
    private data: T | null = null;
    private fetchedAt = 0;
    private lastFrame: Uint32Array | null = null;
    private lastMessage: string | null = null;
    private active = false;
    private refreshing = false;
    private readonly refreshRunner: IntervalRunner;
    private readonly tickRunner: IntervalRunner | null;

    constructor(private readonly config: PolledLocationEffectConfig<T>) {
        this.refreshRunner = new IntervalRunner(config.refreshMs, () => void this.refresh());
        this.tickRunner = config.tickMs
            ? new IntervalRunner(config.tickMs, () => this.render())
            : null;
    }

    private get log() {
        return this.config.log ?? console.log;
    }

    private now() {
        return (this.config.now ?? Date.now)();
    }

    private getLocation(): Promise<Location> {
        this.locationPromise ??= this.config.locate().catch((err) => {
            this.locationPromise = null; // retry next time
            throw err;
        });
        return this.locationPromise;
    }

    private async refresh() {
        if (this.refreshing) return;

        const gap = this.config.minRefetchGapMs ?? 0;
        if (this.data !== null && this.now() - this.fetchedAt < gap) return;

        this.refreshing = true;
        try {
            const location = await this.getLocation();
            this.data = await this.config.fetch(location);
            this.location = location;
            this.fetchedAt = this.now();
            this.render();
        } catch (err) {
            // Keep the previous data and frame; try again next refresh
            this.log(`⚠️ ${this.config.name} update failed: ${(err as Error).message}`);
        } finally {
            this.refreshing = false;
        }
    }

    private render() {
        if (!this.active || this.data === null) return;

        const now = this.now();

        if (this.config.describe && this.location) {
            const message = this.config.describe(this.data, this.location, now);
            if (message !== this.lastMessage) {
                this.lastMessage = message;
                this.log(message);
            }
        }

        const frame = this.config.buildFrame(this.data, now);
        if (!frame) return;
        if (this.lastFrame && framesEqual(frame, this.lastFrame)) return;

        this.lastFrame = frame;
        safeRender(frame);
    }

    run() {
        this.active = true;
        this.lastFrame = null; // always draw on (re)start
        this.refreshRunner.start();
        this.tickRunner?.start();
        this.render(); // redraw from cached data right away, even if the refresh is skipped
    }

    stop() {
        this.active = false;
        this.refreshRunner.stop();
        this.tickRunner?.stop();
    }
}