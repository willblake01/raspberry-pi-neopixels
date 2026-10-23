import { safeRender } from '../ledRuntime.js';
import { packRGB, randomColor, scaleColor, fillSolid } from './utils/color.js';
import { IntervalRunner } from './utils/index.js';
import type { Effect, Options } from '../types/index.js';

const MIN_FRAME_MS = 5;

/**
 * Pure: brightness multiplier (floor–1) for a moment in the cycle.
 * Smooth cosine ease in and out over one `period`.
 * `curve` > 1 lingers near the floor; 1 is a plain cosine.
 */
export const breatheScale = (elapsedMs: number, period: number, floor: number, curve = 1) => {
  const t = elapsedMs / period;
  const phase = t - Math.floor(t);
  const eased = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  return floor + (1 - floor) * Math.pow(eased, curve);
};

interface BreatheOptions {
  floor?: number;
  curve?: number;
  fps?: number;
}

// < - - - - - - Core behavior - - - - - - >

class Breathe implements Effect {
  private readonly t0 = Date.now();
  private readonly floor: number;
  private readonly curve: number;
  private readonly runner: IntervalRunner;

  constructor(
      protected readonly leds: number,
      private readonly period: number,
      private readonly color: number,
      { floor = 0.08, curve = 1, fps = 60 }: BreatheOptions = {},
  ) {
    this.floor = Math.min(Math.max(floor, 0), 1);
    this.curve = curve;
    const frameMs = Math.max(MIN_FRAME_MS, Math.round(1000 / fps));
    this.runner = new IntervalRunner(frameMs, () => this.frame());
  }

  private frame() {
    const scale = breatheScale(Date.now() - this.t0, this.period, this.floor, this.curve);
    safeRender(fillSolid(this.leds, scaleColor(this.color, scale)));
  }

  run() {
    this.runner.start();
  }

  stop() {
    this.runner.stop();
  }
}

// < - - - - - - Public API (unchanged signatures) - - - - - - >

export class BreatheCustom extends Breathe {
  constructor(
      leds: Options['leds'], interval: Options['interval'],
      red: Options['red'], green: Options['green'], blue: Options['blue'],
      floor = 0.08, curve = 1, fps = 60,
  ) {
    super(leds, interval, packRGB(red, green, blue), { floor, curve, fps });
  }
}

export class BreatheRandom extends Breathe {
  constructor(
      leds: Options['leds'], interval: Options['interval'],
      floor = 0.08, curve = 1, fps = 60,
  ) {
    super(leds, interval, randomColor(), { floor, curve, fps });
  }
}