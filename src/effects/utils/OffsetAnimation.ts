import { safeRender } from '../../ledRuntime.js';
import { IntervalRunner } from './IntervalRunner.js';
import type { ColorSource } from './colorSources.js';
import type { Effect } from '../../types/index.js';

/** Builds one frame from the current offset and color. Should be pure. */
export type FrameBuilder = (leds: number, offset: number, color: number) => Uint32Array;

/**
 * An effect whose state is an offset that advances one step per interval
 * and wraps at `leds`, with colors supplied by a ColorSource.
 */
export class OffsetAnimation implements Effect {
    private offset = 0;
    private readonly runner: IntervalRunner;

    constructor(
        protected readonly leds: number,
        interval: number,
        private readonly buildFrame: FrameBuilder,
        private readonly colors: ColorSource,
    ) {
        this.runner = new IntervalRunner(interval, () => this.step());
    }

    private step() {
        safeRender(this.buildFrame(this.leds, this.offset, this.colors.current()));

        if (this.leds > 0) {
            this.offset = (this.offset + 1) % this.leds;
        }
        this.colors.advance(this.offset === 0);
    }

    run() {
        this.runner.start();
    }

    stop() {
        this.runner.stop();
    }
}