import type { Answers } from 'prompts';
import { EFFECTS } from '../constants/index.js';
import { NormalizeAnswers } from '../types/index.js';

export const normalizeAnswers = (response: Answers<string>): NormalizeAnswers => {
  const {
    command,
    leds,
    brightness,
    effect,
    interval,
    red,
    green,
    blue,
    colorMode,
    randomColorMode,
    colorChangeInterval,
    pixelState,
  } = response;

  return {
    command,
    leds,
    brightness,
    effect,
    interval,
    red,
    green,
    blue,
    colorMode,
    randomColorMode,
    colorChangeInterval,
    pixelState,

    isOn: command === 1,
    isOff: command === 0,
    isSolid: effect === EFFECTS.SOLID,
    isChange: effect === EFFECTS.CHANGE,
    isBlink: effect === EFFECTS.BLINK,
    isBreathe: effect === EFFECTS.BREATHE,
    isCreep: effect === EFFECTS.CREEP,
    isWheel: effect === EFFECTS.WHEEL,
    isWalkPixel: effect === EFFECTS.WALK_PIXEL,
    isCustomColorMode: colorMode === "custom",
    isRandomColorMode: colorMode === "random",
    isStaticRandomColorMode: randomColorMode === "static",
    isChangeRandomColorMode: randomColorMode === "change",
    everyPixelColorChangeInterval: colorChangeInterval === "everyPixel",
    everyLoopColorChangeInterval: colorChangeInterval === "everyLoop",
  };
};
