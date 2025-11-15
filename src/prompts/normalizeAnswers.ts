import { RawAnswers, NormalizeAnswers } from '../types/index.js'; 

export const normalizeAnswers = (res: RawAnswers): NormalizeAnswers => {
  const {
    blue,
    brightness,
    colorMode,
    colorChangeInterval,
    command,
    effect,
    green,
    interval,
    leds,
    pixelState,
    randomColorMode,
    red,
  } = res;

  return {
    leds,
    brightness,
    interval,
    red,
    green,
    blue,
    command,
    effect,
    colorMode,
    randomColorMode,
    colorChangeInterval,
    pixelState,
    isOn: command === 1,
    isOff: command === 0,
    isSolid: effect === "solid",
    isChange: effect === "change",
    isBlink: effect === "blink",
    isBreathe: effect === "breathe",
    isCreep: effect === "creep",
    isWheel: effect === "wheel",
    isWalkPixel: effect === "walk pixel",
    isCustomColorMode: colorMode === "custom",
    isRandomColorMode: colorMode === "random",
    isStaticRandomColorMode: randomColorMode === "static",
    isChangeRandomColorMode: randomColorMode === "change",
    everyPixelColorChangeInterval: colorChangeInterval === "everyPixel",
    everyLoopColorChangeInterval: colorChangeInterval === "everyLoop",
  };
};
