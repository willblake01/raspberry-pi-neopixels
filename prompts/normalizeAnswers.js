export const normalizeAnswers = (res) => {
  const {blue, brightness, colorMode, colorcolorChangeInterval, command, effect, green, interval, leds, pixelState, randomColorMode, red} = res;

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
    colorcolorChangeInterval,
    pixelState,
    isOn: command === 1,
    isOff: command === 0,
    isSolid: effect === 'solid',
    isChange: effect === 'change',
    isBlink: effect === 'blink',
    isBreathe: effect === 'breathe',
    isCreep: effect === 'creep',
    isWheel: effect === 'wheel',
    isWalkPixel: effect === 'walk pixel',
    isCustomColorMode: colorMode === 'custom',
    isRandomColorMode: colorMode === 'random',
    isStaticRandomColorMode: randomColorMode === 'static',
    isChangeRandomColorMode: randomColorMode === 'change',
    everyPixelColorcolorChangeInterval: colorcolorChangeInterval === 'everyPixel',
    everyLoopColorcolorChangeInterval: colorcolorChangeInterval === 'everyLoop',
    pixelOn: pixelState === 1,
    pixelOff: pixelState === 0 
  };
};
