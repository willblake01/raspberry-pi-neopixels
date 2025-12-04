import { EFFECTS } from '../constants/index.js';

// < - - - - - - Prompts - - - - - - >

// Types for the raw answers coming in
export type EffectName = (typeof EFFECTS) [keyof typeof EFFECTS];

export type ShiftMode = 0 | 1;
export type ColorMode = 'custom' | 'random';
export type RandomColorMode = 'static' | 'change';
export type ColorChangeInterval = 'everyPixel' | 'everyLoop';

// A function that decides whether to show a prompt and what type it is
export type PromptTypeFn =
  (prev: unknown, values: unknown) => 'select' | 'number' | null;

export interface BasePrompt {
  // `type` is always `show('select' | 'number', pred)`
  type: PromptTypeFn;
  name: string;
  message: string;
};

// For `promptSelect(...)`
export interface SelectChoice<T = unknown> {
  title: string;
  value: T;
};

export interface SelectPrompt<T = unknown> extends BasePrompt {
  choices: SelectChoice<T>[];
};

// For `promptNumber(...)`
export interface NumberPrompt extends BasePrompt {
  initial: number;
  validate: (value: unknown) => true | string;
};

// One prompt in the config can be either kind
export type PromptConfig = SelectPrompt | NumberPrompt;

// The whole config array
export type PromptsConfig = PromptConfig[];

// < - - - - - - - - - - - - - - - - - >

export interface Options {

  // Base config
  command: number;
  leds: number;
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
  isAlternate: boolean;
  isChange: boolean;
  isBlink: boolean;
  isBreathe: boolean;
  isCreep: boolean;
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
  useMotionDetection: 0 | 1;
  motionColorMode: 'custom' | 'random';
  motionRed: number;
  motionGreen: number;
  motionBlue: number;

  // Motion detection flags
  isMotionDetectionEnabled: boolean;
  isMotionCustomColorMode: boolean;
  isMotionRandomColorMode: boolean;
};

export interface Config {
  leds: number;
  dma: number;
  brightness?: number;
  gpio: number,
  stripType: string;
};

export interface Effect {
  run(): void | Promise<void>;
  stop?(): void | Promise<void>;
};
