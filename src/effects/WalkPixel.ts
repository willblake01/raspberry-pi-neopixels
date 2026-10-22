import { safeRender } from '../ledRuntime.js';
import { packRGB } from './utils/color.js';
import { IntervalRunner } from './utils/IntervalRunner.js';
import {
  fixedColor,
  randomStaticColor,
  randomEveryPixelColor,
  randomEveryLoopColor,
  type ColorSource,
} from './utils/colorSources.js';
import type { Effect, Options } from '../types/index.js';

/**
 * Pure: pixelOn = one lit pixel on a dark strip;
 * !pixelOn = one dark pixel on a lit strip.
 */
export const buildWalkPixel = (leds: number, offset: number, color: number, pixelOn: boolean) => {
  const pixels = new Uint32Array(leds);
  if (!pixelOn) pixels.fill(color);
  if (offset >= 0 && offset < leds) pixels[offset] = pixelOn ? color : 0;
  return pixels;
};

// < - - - - - - Core behavior - - - - - - >

class WalkPixel implements Effect {
  private offset = 0;
  private readonly runner: IntervalRunner;

  constructor(
      protected readonly leds: number,
      interval: number,
      private readonly pixelOn: boolean,
      private readonly colors: ColorSource,
  ) {
    this.runner = new IntervalRunner(interval, () => this.step());
  }

  private step() {
    safeRender(buildWalkPixel(this.leds, this.offset, this.colors.current(), this.pixelOn));

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

// < - - - - - - Public API (unchanged signatures) - - - - - - >

// Pixel on

export class WalkPixelOnCustom extends WalkPixel {
  constructor(
      leds: Options['leds'], interval: Options['interval'],
      red: Options['red'], green: Options['green'], blue: Options['blue'],
  ) {
    super(leds, interval, true, fixedColor(packRGB(red, green, blue)));
  }
}

export class WalkPixelOnRandomStatic extends WalkPixel {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, true, randomStaticColor());
  }
}

export class WalkPixelOnRandomChangePixel extends WalkPixel {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, true, randomEveryPixelColor());
  }
}

export class WalkPixelOnRandomChangeLoop extends WalkPixel {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, true, randomEveryLoopColor());
  }
}

// Pixel off

export class WalkPixelOffCustomStatic extends WalkPixel {
  constructor(
      leds: Options['leds'], interval: Options['interval'],
      red: Options['red'], green: Options['green'], blue: Options['blue'],
  ) {
    super(leds, interval, false, fixedColor(packRGB(red, green, blue)));
  }
}

export class WalkPixelOffRandomStatic extends WalkPixel {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, false, randomStaticColor());
  }
}

export class WalkPixelOffRandomChangePixel extends WalkPixel {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, false, randomEveryPixelColor());
  }
}

export class WalkPixelOffRandomChangeLoop extends WalkPixel {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, false, randomEveryLoopColor());
  }
}