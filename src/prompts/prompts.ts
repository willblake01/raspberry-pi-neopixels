import { EFFECTS } from "../constants/index.js";
import { and, integerBetween } from '../utils/index.js';
import type { EffectName, NormalizeAnswers } from "../types/types.js";

export type Predicate = (v: NormalizeAnswers) => boolean;

export interface SelectChoice<T = any> {
  title: string;
  value: T;
}

export interface NumberPromptConfig {
  min: number;
  max: number;
  initial: number;
  when?: Predicate;
}

/** A function used by `prompts` to compute dynamic `type` */
export type PromptTypeFn =
  (prev: any, values: NormalizeAnswers) => "select" | "number" | null;

const EFFECT_CHOICES = [
  { title: 'Solid', value: EFFECTS.SOLID },
  { title: 'Change', value: EFFECTS.CHANGE },
  { title: 'Blink', value: EFFECTS.BLINK },
  { title: 'Breathe', value: EFFECTS.BREATHE },
  { title: 'Creep', value: EFFECTS.CREEP },
  { title: 'Wheel', value: EFFECTS.WHEEL },
  { title: 'Walk Pixel', value: EFFECTS.WALK_PIXEL }
];

// Capabilities
const EFFECT_NEEDS_INTERVAL: ReadonlySet<EffectName> = new Set<EffectName>([
  EFFECTS.CHANGE, EFFECTS.BLINK, EFFECTS.BREATHE, EFFECTS.CREEP, EFFECTS.WHEEL, EFFECTS.WALK_PIXEL
]);
const EFFECT_ALLOWS_CUSTOM: ReadonlySet<EffectName> = new Set<EffectName>([
  EFFECTS.SOLID, EFFECTS.BLINK, EFFECTS.BREATHE, EFFECTS.CREEP, EFFECTS.WALK_PIXEL
]);

// Random color is *not allowed for Change or Wheel
const EFFECT_ALLOWS_RANDOM: ReadonlySet<EffectName> = new Set<EffectName>([
  EFFECTS.SOLID, EFFECTS.BLINK, EFFECTS.CREEP, EFFECTS.WALK_PIXEL
]);

// For random 'change' (interval choice), exclude Blink
const EFFECT_ALLOWS_RANDOM_CHANGE_INTERVAL: ReadonlySet<EffectName> = new Set<EffectName>([
  EFFECTS.CREEP, EFFECTS.WALK_PIXEL
]);

// --- Helpers ---
const isOn: Predicate = v => v.command === 1;
const effectEquals = (e: NormalizeAnswers['effect']): Predicate => v => v.effect === e;

const needsInterval: Predicate = v => EFFECT_NEEDS_INTERVAL.has(v.effect);
const allowsCustom: Predicate = v => EFFECT_ALLOWS_CUSTOM.has(v.effect);
const allowsRandom: Predicate = v => EFFECT_ALLOWS_RANDOM.has(v.effect);
const allowsRandomcolorChangeInterval: Predicate = v => EFFECT_ALLOWS_RANDOM_CHANGE_INTERVAL.has(v.effect);

const show = (type: 'select' | 'number', pred: Predicate): PromptTypeFn => (_prev, values) => (pred(values) ? type : null);

// --- Small factories ---
const promptSelect = <T = any>(name: string, message: string, choices: SelectChoice<T>[], when?: Predicate) => ({ type: show('select', when ?? (() => true)), name, message, choices });

const promptNumber = (name: string, message: string, { min, max, initial, when }: NumberPromptConfig) => ({
  type: show('number', when ?? (() => true)),
  name,
  message,
  initial,
  validate: integerBetween(min, max),
});

// --- final prompts ---
export const promptsConfig = [

  // Command
  promptSelect('command', 'Enter command', [
    { title: 'On', value: 1 },
    { title: 'Off', value: 0 }
  ], isOn),

  // Effect (only when turning on)
  promptSelect('effect', 'Set effect', EFFECT_CHOICES, isOn),

  // Walk Pixel -> pixel state
  promptSelect('pixelState', 'Set pixel', [
    { title: 'On', value: 1 },
    { title: 'Off', value: 0 }
  ], and(isOn, effectEquals(EFFECTS.WALK_PIXEL))),

  // Interval (for all effects except Solid)
  promptNumber('interval', 'Enter interval (milliseconds)', {
    min: 1, max: 60_000, initial: 250, when: and(isOn, v => needsInterval(v))
  }),

  // LED count (always asked)
  promptNumber('leds', 'Enter number of LEDs (0-100)', {
    min: 0, max: 100, initial: 100, when: isOn
  }),

  // Brightness (only when on)
  promptNumber('brightness', 'Enter brightness (0-255)', {
    min: 0, max: 255, initial: 128, when: isOn
  }),

  // Color mode (disallowed for change & wheel)
  promptSelect('colorMode', 'Set color mode', [
    { title: 'Custom', value: 'custom' },
    { title: 'Random', value: 'random' }
  ], and(isOn, v => allowsCustom(v) || allowsRandom(v))),

  // Random color subtype (only when random, and not for solid/change)
  promptSelect('randomColorMode', 'Set random color mode', [
    { title: 'Static', value: 'static' },
    { title: 'Change', value: 'change' }
  ], and(isOn, v => v.colorMode === 'random' && v.effect !== EFFECTS.SOLID && v.effect !== EFFECTS.CHANGE)),

  // Random 'change' interval (every pixel vs end of loop)
  promptSelect('colorChangeInterval', 'Set color change interval', [
    { title: 'After every pixel', value: 'everyPixel' },
    { title: 'At end of loop', value: 'everyLoop' }
  ], and(isOn, v => v.colorMode === 'random' && v.randomColorMode === 'change' && v.effect !== EFFECTS.BLINK && allowsRandomcolorChangeInterval(v))),

  // Custom RGB (only when custom color is allowed)
  promptNumber('red', 'Enter a red value (0-255)', { min: 0, max: 255, initial: 0, when: and(isOn, v => v.colorMode === 'custom' && allowsCustom(v)) }),
  promptNumber('green', 'Enter a green value (0-255)', { min: 0, max: 255, initial: 0, when: and(isOn, v => v.colorMode === 'custom' && allowsCustom(v)) }),
  promptNumber('blue', 'Enter a blue value (0-255)', { min: 0, max: 255, initial: 0, when: and(isOn, v => v.colorMode === 'custom' && allowsCustom(v)) })
];
