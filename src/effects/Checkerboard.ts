import { safeRender } from '../ledRuntime.js';
import { packRGB, randomColor } from './utils/color.js';
import { IntervalRunner } from './utils/IntervalRunner.js';
import type { Effect, Options } from '../types/index.js';

/** Pure: easy to unit test without mocking the renderer. */
export const buildCheckerboard = (leds: number, color1: number, color2: number, shifted = false) => {
  const pixels = new Uint32Array(leds);
  const offset = shifted ? 1 : 0;
  for (let i = 0; i < leds; i++) {
    pixels[i] = (i + offset) % 2 === 0 ? color1 : color2;
  }
  return pixels;
};

// < - - - - - - Core behaviors - - - - - - >

class StaticCheckerboard implements Effect {
  constructor(
      protected readonly leds: number,
      protected readonly color1: number,
      protected readonly color2: number,
  ) {}

  run() {
    safeRender(buildCheckerboard(this.leds, this.color1, this.color2));
  }
}

class ShiftingCheckerboard implements Effect {
  private shifted = false;
  private readonly runner: IntervalRunner;

  constructor(
      protected readonly leds: number,
      interval: number,
      protected readonly color1: number,
      protected readonly color2: number,
  ) {
    this.runner = new IntervalRunner(interval, () => this.step());
  }

  private step() {
    safeRender(buildCheckerboard(this.leds, this.color1, this.color2, this.shifted));
    this.shifted = !this.shifted;
  }

  run() {
    this.shifted = false;
    this.runner.start();
  }

  stop() {
    this.runner.stop();
  }
}

// < - - - - - - Public API (unchanged signatures) - - - - - - >

export class CheckerboardCustom extends StaticCheckerboard {
  constructor(
      leds: Options['leds'],
      red: Options['red'], green: Options['green'], blue: Options['blue'],
      red2: Options['red2'], green2: Options['green2'], blue2: Options['blue2'],
  ) {
    super(leds, packRGB(red, green, blue), packRGB(red2, green2, blue2));
  }
}

export class CheckerboardCustomShift extends ShiftingCheckerboard {
  constructor(
      leds: Options['leds'], interval: Options['interval'],
      red: Options['red'], green: Options['green'], blue: Options['blue'],
      red2: Options['red2'], green2: Options['green2'], blue2: Options['blue2'],
  ) {
    super(leds, interval, packRGB(red, green, blue), packRGB(red2, green2, blue2));
  }
}

export class CheckerboardRandom extends StaticCheckerboard {
  constructor(leds: Options['leds']) {
    super(leds, randomColor(), randomColor());
  }
}

export class CheckerboardRandomShift extends ShiftingCheckerboard {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, randomColor(), randomColor());
  }
}