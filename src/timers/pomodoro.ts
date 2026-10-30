import { mixColors, packRGB, scaleColor } from '../effects/utils/color.js';
import type { RGB } from '../weather/colors.js';

export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroConfig {
    workMs: number;
    shortBreakMs: number;
    longBreakMs: number;
    /** Focus sessions before a long break. */
    rounds: number;
}

export interface PomodoroState {
    phase: PomodoroPhase;
    round: number;       // 1-based focus session within the set
    msIntoPhase: number;
    phaseMs: number;
    phaseStart: number;  // elapsed ms when this phase began (unique per phase)
}

export const POMODORO_COLORS: Record<PomodoroPhase, RGB> = {
    work: [255, 40, 0],       // tomato red
    shortBreak: [0, 255, 60], // green
    longBreak: [0, 120, 255], // blue
};

/** Flash at the start of each phase. */
export const FLASH_MS = 3000;
export const FLASH_PERIOD_MS = 500;
/** Brightness of the unlit part of the bar, so its full length stays visible. */
export const TRACK_LEVEL = 0.06;

interface Step {
    phase: PomodoroPhase;
    round: number;
    ms: number;
}

/** One full set: focus, short break, …, focus, long break. */
export const pomodoroSchedule = ({ workMs, shortBreakMs, longBreakMs, rounds }: PomodoroConfig): Step[] => {
    const steps: Step[] = [];
    for (let round = 1; round <= rounds; round++) {
        steps.push({ phase: 'work', round, ms: workMs });
        steps.push(
            round < rounds
                ? { phase: 'shortBreak', round, ms: shortBreakMs }
                : { phase: 'longBreak', round, ms: longBreakMs },
        );
    }
    return steps;
};

/** Where the timer is after `elapsedMs`. The schedule repeats indefinitely. */
export const pomodoroState = (elapsedMs: number, config: PomodoroConfig): PomodoroState => {
    const steps = pomodoroSchedule(config);
    const cycleMs = steps.reduce((total, step) => total + step.ms, 0);
    const elapsed = Math.max(0, elapsedMs);
    const cycleStart = Math.floor(elapsed / cycleMs) * cycleMs;

    let t = elapsed - cycleStart;
    let phaseStart = cycleStart;
    for (const step of steps) {
        if (t < step.ms) {
            return { phase: step.phase, round: step.round, msIntoPhase: t, phaseMs: step.ms, phaseStart };
        }
        t -= step.ms;
        phaseStart += step.ms;
    }

    // Not reachable with positive durations; fall back to the start of the cycle
    const first = steps[0];
    return { phase: first.phase, round: first.round, msIntoPhase: 0, phaseMs: first.ms, phaseStart: cycleStart };
};

/** Pure: flash at the start of a phase, then a bar draining toward the start of the strip. */
export const buildPomodoroFrame = (leds: number, state: PomodoroState): Uint32Array => {
    const color = packRGB(...POMODORO_COLORS[state.phase]);

    if (state.msIntoPhase < FLASH_MS) {
        const on = Math.floor(state.msIntoPhase / FLASH_PERIOD_MS) % 2 === 0;
        return new Uint32Array(leds).fill(on ? color : 0);
    }

    const track = scaleColor(color, TRACK_LEVEL);
    const remaining = Math.max(0, 1 - state.msIntoPhase / state.phaseMs);
    const exact = remaining * leds;
    const full = Math.floor(exact);
    const edge = exact - full;

    const pixels = new Uint32Array(leds).fill(track);
    pixels.fill(color, 0, full);
    if (edge > 0 && full < leds) pixels[full] = mixColors(track, color, edge);

    return pixels;
};

export const PHASE_LABELS: Record<PomodoroPhase, string> = {
    work: '🍅 Focus',
    shortBreak: '☕ Short break',
    longBreak: '🌴 Long break',
};