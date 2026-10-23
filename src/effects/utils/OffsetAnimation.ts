import { safeRender } from '../../ledRuntime.js';
import { IntervalRunner } from './IntervalRunner.js';
import type { ColorSource } from './colorSources.js';
import type { Effect } from '../../types/index.js';

export type FrameBuilder = (leds: number, step: number, color: number) => Uint32Array;

export interface OffsetAnimationOptions {
    /** Steps per cycle before wrapping to 0. Defaults to `leds`. */
    steps?: number;
    /** Restart at step 0 whenever run() is called. Defaults to false (resume). */
    resetOnRun?: boolean;
}

export class OffsetAnimation implements Effect {
    private step = 0;
    private readonly steps: number;
    private readonly resetOnRun: boolean;
    private readonly runner: IntervalRunner;

    constructor(
        protected readonly leds: number,
        interval: number,
        private readonly buildFrame: FrameBuilder,
        private readonly colors: ColorSource,
        { steps = leds, resetOnRun = false }: OffsetAnimationOptions = {},
    ) {
        this.steps = steps;
        this.resetOnRun = resetOnRun;
        this.runner = new IntervalRunner(interval, () => this.tick());
    }

    private tick() {
        safeRender(this.buildFrame(this.leds, this.step, this.colors.current()));
        if (this.steps > 0) this.step = (this.step + 1) % this.steps;
        this.colors.advance(this.step === 0);
    }

    run() {
        if (this.resetOnRun) this.step = 0;
        this.runner.start();
    }

    stop() {
        this.runner.stop();
    }
}