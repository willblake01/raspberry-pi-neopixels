export const normalizeAnswers = (res) => {
  const {blue, brightness, colorMode, colorChangeInterval, command, green, interval, mode, leds, pixelState, randomColorMode, red} = res;

  return {
    leds,
    brightness,
    interval,
    red,
    green,
    blue,
    command,
    mode,
    colorMode,
    randomColorMode,
    colorChangeInterval,
    pixelState,
    isOn: command === 1,
    isOff: command === 0,
    isSolid: mode === 'solid',
    isChange: mode === 'change',
    isBlink: mode === 'blink',
    isBreathe: mode === 'breathe',
    isCreep: mode === 'creep',
    isWheel: mode === 'wheel',
    isWalkPixel: mode === 'walk pixel',
    isCustom: colorMode === 'custom',
    isRandom: colorMode === 'random',
    isStaticRC: randomColorMode === 'static',
    isChangeRC: randomColorMode === 'change',
    everyPixel: colorChangeInterval === 'everyPixel',
    everyLoop: colorChangeInterval === 'everyLoop',
    pixelOn: pixelState === 1,
    pixelOff: pixelState === 0 
  };
};
