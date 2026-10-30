import { safeRender } from '../ledRuntime.js';
import { randomColor } from './utils/color.js';
import { IntervalRunner } from './utils/index.js';
import type { Effect, Options } from '../types/index.js';

/** Pure: the new color fills pixels 0 through `offset`; the previous color fills the rest. */
export const buildWheel = (leds: number, offset: number, color: number, previous: number): Uint32Array => {
  const pixels = new Uint32Array(leds).fill(previous);
  pixels.fill(color, 0, offset + 1);
  return pixels;
};

/** A new random color sweeps down the strip over the previous one, every revolution. */
export class Wheel implements Effect {
  private offset = 0;
  private color = randomColor();
  private previous = 0; // the first pass sweeps over a dark strip
  private readonly runner: IntervalRunner;

  constructor(
      private readonly leds: Options['leds'],
      interval: Options['interval'],
  ) {
    this.runner = new IntervalRunner(interval, () => this.step());
  }

  private step() {
    safeRender(buildWheel(this.leds, this.offset, this.color, this.previous));

    if (this.leds === 0) return;
    this.offset = (this.offset + 1) % this.leds;

    if (this.offset === 0) {
      this.previous = this.color; // the finished color becomes the background
      this.color = randomColor();
    }
  }

  run() {
    this.runner.start();
  }

  stop() {
    this.runner.stop();
  }
}