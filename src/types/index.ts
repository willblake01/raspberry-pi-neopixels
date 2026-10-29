import { EFFECTS } from '../constants/index.js';
import type { Ws281xConfig } from '../hardware/ws281x.js';

// < - - - - - - Prompts - - - - - - >

// Types for the raw answers coming in
export type EffectName = (typeof EFFECTS) [keyof typeof EFFECTS];

export type ShiftMode = 0 | 1;
export type ColorMode = 'custom' | 'random';
export type RandomColorMode = 'static' | 'change';
export type ColorChangeInterval = 'everyPixel' | 'everyLoop';

export interface PixelSegment {
  start: number; // 0-based, inclusive
  end: number;   // 0-based, inclusive
  color: number;
}

export interface Options {
  // Base config
  weatherAlerts: number;
  command: number;
  leds: number;
  gamma?: number;
  brightness?: number;
  effect?: EffectName;
  interval: number;
  red: number;
  green: number;
  blue: number;
  red2: number;
  green2: number;
  blue2: number;

  // Command flags
  isOn: boolean;
  isOff: boolean;

  // Effect flags
  isSolid: boolean;
  isCheckerboard: boolean;
  isChange: boolean;
  isBlink: boolean;
  isBreathe: boolean;
  isGrowingBar: boolean;
  isWheel: boolean;
  isWalkPixel: boolean;

  // Shift mode
  shiftMode?: ShiftMode;

  // Shift mode flags
  isShiftMode: boolean;

  // Color mode
  colorMode?: ColorMode;
  randomColorMode?: RandomColorMode;
  colorChangeInterval?: ColorChangeInterval;

  // Color mode flags
  isEveryPixelColorChangeInterval: boolean;
  isEveryLoopColorChangeInterval: boolean;

  // Derived color-mode flags used in 'when'
  isCustomColorMode: boolean;
  isRandomColorMode: boolean;
  isStaticRandomColorMode: boolean;
  isChangeRandomColorMode: boolean;

  // Pixel state
  pixelState?: 0 | 1;

  // Pixel flags
  isPixelOn: boolean;

  // Motion detection
  useMotionDetection?: 0 | 1;
  motionColorMode?: ColorMode;
  motionRed?: number;
  motionGreen?: number;
  motionBlue?: number;

  // Motion detection flags
  isMotionDetectionEnabled: boolean;
  isMotionCustomColorMode: boolean;
  isMotionRandomColorMode: boolean;

  // Weather location
  weatherLocationMode?: 'auto' | 'manual';
  weatherLocation?: string;

  // Weather flags
  isWeather: boolean;
  isWeatherAlertsEnabled: boolean;

  // Moon phase
  showMoon?: 0 | 1;

  // Custom Pixels mode
  pixelSegments?: PixelSegment[];
}

export type Config = Ws281xConfig;

export interface Effect {
  run(): void | Promise<void>;
  stop?(): void | Promise<void>;
}
