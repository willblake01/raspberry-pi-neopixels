import { safeRender } from '../ledRuntime.js';
import { framesEqual } from './utils/color.js';
import { IntervalRunner } from './utils/index.js';
import {
    PHASE_LABELS,
    buildPomodoroFrame,
    pomodoroState,
    type PomodoroConfig,
} from '../timers/pomodoro.js';
import type { Effect } from '../types/index.js';

export const POMODORO_TICK_MS = 250; // fast enough for the start-of-phase flash

export class Pomodoro implements Effect {
    private startedAt: number | null = null;
    private lastFrame: Uint32Array | null = null;
    private lastPhaseStart: number | null = null;
    private active = false;
    private readonly runner: IntervalRunner;

    constructor(
        private readonly leds: number,
        private readonly config: PomodoroConfig,
        private readonly now: () => number = Date.now,
        tickMs = POMODORO_TICK_MS,
        private readonly log: (message: string) => void = console.log,
    ) {
        this.runner = new IntervalRunner(tickMs, () => this.render());
    }

    private render() {
        if (!this.active || this.startedAt === null) return;

        const state = pomodoroState(this.now() - this.startedAt, this.config);

        if (state.phaseStart !== this.lastPhaseStart) {
            this.lastPhaseStart = state.phaseStart;
            const minutes = Math.round(state.phaseMs / 60_000);
            const round = state.phase === 'work' ? ` ${state.round}/${this.config.rounds}` : '';
            this.log(`${PHASE_LABELS[state.phase]}${round}: ${minutes} min`);
        }

        const frame = buildPomodoroFrame(this.leds, state);
        if (this.lastFrame && framesEqual(frame, this.lastFrame)) return;

        this.lastFrame = frame;
        safeRender(frame);
    }

    run() {
        this.active = true;
        this.startedAt ??= this.now(); // keep counting across restarts (e.g. motion overrides)
        this.lastFrame = null;
        this.runner.start();
    }

    stop() {
        this.active = false;
        this.runner.stop();
    }
}