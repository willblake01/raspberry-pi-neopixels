import { EFFECTS } from "../constants/index.js";

export interface Config {
  leds: number;
  dma: number;
  brightness: number;
  gpio: number,
  stripType: string;
};

export interface Options {
  // Base config
  command: number;
  leds: number;
  brightness?: number;
  effect?: EffectName;
  interval?: number;
  red?: number;
  green?: number;
  blue?: number;

  // Color mode
  colorMode?: ColorMode;
  randomColorMode?: RandomColorMode;
  colorChangeInterval?: ColorChangeInterval;

  // Pixel state
  pixelState?: 0 | 1;

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

export type Pixels = Uint32Array;

// Types for the raw answers coming in
export type EffectName = (typeof EFFECTS) [keyof typeof EFFECTS];

export type ColorMode = "custom" | "random";
export type RandomColorMode = "static" | "change";
export type ColorChangeInterval = "everyPixel" | "everyLoop";

export interface RawAnswers {
  command: number;
  leds: number;
  brightness?: number;
  effect?: EffectName;
  interval?: number;
  red?: number;
  green?: number;
  blue?: number;
  colorMode?: ColorMode;
  randomColorMode?: RandomColorMode;
  colorChangeInterval?: ColorChangeInterval;
  pixelState?: 0 | 1;
};

// Normalized shape you actually use downstream
export interface NormalizeAnswers extends RawAnswers {
  brightness: number;
  interval: number;
  isOn: boolean;
  isOff: boolean;
  isSolid: boolean;
  isChange: boolean;
  isBlink: boolean;
  isBreathe: boolean;
  isCreep: boolean;
  isWheel: boolean;
  isWalkPixel: boolean;
  isCustomColorMode: boolean;
  isRandomColorMode: boolean;
  isStaticRandomColorMode: boolean;
  isChangeRandomColorMode: boolean;
  everyPixelColorChangeInterval: boolean;
  everyLoopColorChangeInterval: boolean;
};

// A function that decides whether to show a prompt and what type it is
export type PromptTypeFn =
  (prev: any, values: any) => 'select' | 'number' | null;

export interface BasePrompt {
  // `type` is always `show('select' | 'number', pred)`
  type: PromptTypeFn;
  name: string;
  message: string;
};

// For `promptSelect(...)`
export interface SelectChoice<T = any> {
  title: string;
  value: T;
};

export interface SelectPrompt<T = any> extends BasePrompt {
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

export type Interval = number;
