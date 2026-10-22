import { packRGB } from './utils/color.js';
import { OffsetAnimation } from './utils/OffsetAnimation.js';
import {
  fixedColor,
  randomStaticColor,
  randomEveryPixelColor,
  randomEveryLoopColor,
} from './utils/colorSources.js';
import type { Options } from '../types/index.js';

/** Pure: lights pixels 0 through `offset` (inclusive). */
export const buildGrowingBar = (leds: number, offset: number, color: number) => {
  const pixels = new Uint32Array(leds);
  if (offset >= 0) pixels.fill(color, 0, offset + 1); // fill clamps the end to leds
  return pixels;
};

// < - - - - - - Public API (unchanged signatures) - - - - - - >

export class GrowingBarCustom extends OffsetAnimation {
  constructor(
      leds: Options['leds'], interval: Options['interval'],
      red: Options['red'], green: Options['green'], blue: Options['blue'],
  ) {
    super(leds, interval, buildGrowingBar, fixedColor(packRGB(red, green, blue)));
  }
}

export class GrowingBarRandomStatic extends OffsetAnimation {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, buildGrowingBar, randomStaticColor());
  }
}

export class GrowingBarRandomChangePixel extends OffsetAnimation {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, buildGrowingBar, randomEveryPixelColor());
  }
}

export class GrowingBarRandomChangeLoop extends OffsetAnimation {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, buildGrowingBar, randomEveryLoopColor());
  }
}