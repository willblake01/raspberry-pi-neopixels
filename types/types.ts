export interface Config {
  leds: number;
  dma: number;
  brightness: number;
  gpio: number,
  stripType: string;
};

export interface Options {
  // Base config
  leds: number;
  brightness: number;
  interval: number;
  red: number;
  green: number;
  blue: number;
  command: number;
  effect: string;

  // Color mode
  colorMode: 'custom' | 'random';
  randomColorMode: 'static' | 'change';
  colorChangeInterval: number;

  // Pixel state
  pixelState: 0 | 1;

  // Effect flags
  isSolid: boolean;
  isChange: boolean;
  isBlink: boolean;
  isBreathe: boolean;
  isCreep: boolean;
  isWheel: boolean;
  isWalkPixel: boolean;
  isOff: boolean;

  // Derived color-mode flags used in 'when'
  isCustomColorMode: boolean;
  isRandomColorMode: boolean;
  isStaticRandomColorMode: boolean;
  isChangeRandomColorMode: boolean;

  everyPixelColorChangeInterval: boolean;
  everyLoopColorChangeInterval: boolean;
};
