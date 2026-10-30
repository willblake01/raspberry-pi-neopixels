import { EFFECTS } from '../constants/index.js';
import type { Ws281xConfig } from '../hardware/ws281x.js';

// < - - - - - - Prompts - - - - - - >

// Types for the raw answers coming in
export type EffectName = (typeof EFFECTS) [keyof typeof EFFECTS];

export type Shift = 0 | 1;
export type ColorType = 'custom' | 'random';
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

  // Shift
  shift?: Shift;

  // Shift flags
  isShift: boolean;

  // Color
  colorType?: ColorType;
  randomColorMode?: RandomColorMode;
  colorChangeInterval?: ColorChangeInterval;

  // Color flags
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
  motionColorType?: ColorType;
  motionRed?: number;
  motionGreen?: number;
  motionBlue?: number;

  // Motion detection flags
  isMotionDetectionEnabled: boolean;
  isMotionCustomColorMode: boolean;
  isMotionRandomColorMode: boolean;

  // Pomodoro timer
  pomodoroWorkMinutes?: number;
  pomodoroShortBreakMinutes?: number;
  pomodoroLongBreakMinutes?: number;
  pomodoroRounds?: number;

  // Location
  locationType?: 'auto' | 'manual';
  location?: string;

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
