import { packRGB } from './utils/color.js';
import { OffsetAnimation, type OffsetAnimationOptions } from './utils/OffsetAnimation.js';
import { fixedColor, randomStaticColor, randomEveryLoopColor } from './utils/index.js';
import type { Options } from '../types/index.js';

const ON = 0;

/** Pure: step 0 lights the whole strip; any other step is dark. */
export const buildBlink = (leds: number, step: number, color: number) => {
  const pixels = new Uint32Array(leds);
  if (step === ON) pixels.fill(color);
  return pixels;
};

/** On, off, repeat, always starting from "on" when run. */
const BLINK: OffsetAnimationOptions = { steps: 2, resetOnRun: true };

export class BlinkCustom extends OffsetAnimation {
  constructor(
      leds: Options['leds'], interval: Options['interval'],
      red: Options['red'], green: Options['green'], blue: Options['blue'],
  ) {
    super(leds, interval, buildBlink, fixedColor(packRGB(red, green, blue)), BLINK);
  }
}

export class BlinkRandomStatic extends OffsetAnimation {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, buildBlink, randomStaticColor(), BLINK);
  }
}

/** New random color each time the strip turns back on. */
export class BlinkRandomChange extends OffsetAnimation {
  constructor(leds: Options['leds'], interval: Options['interval']) {
    super(leds, interval, buildBlink, randomEveryLoopColor(), BLINK);
  }
}