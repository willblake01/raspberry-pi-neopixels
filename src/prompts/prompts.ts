import type { Answers, PromptObject, PromptType } from 'prompts';
import { EFFECTS } from '../constants/index.js';
import { and, integerBetween } from '../utils/index.js';
import type { EffectName } from '../types/index.js';

/**
 * Raw answer shape while prompts is running.
 * (We normalize later with normalizeAnswers.)
 */
type AnswersShape = Answers<string>;

export type Predicate = (v: AnswersShape) => boolean;

export interface SelectChoice<T = unknown> {
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
export type PromptTypeFn = (
  prev: AnswersShape,
  values: AnswersShape
) => PromptType | null;

// -----------------------------------------------------------------------------
// Effect capabilities
// -----------------------------------------------------------------------------

const EFFECT_CHOICES: SelectChoice<EffectName>[] = [
  { title: 'Solid', value: EFFECTS.SOLID },
  { title: 'Change', value: EFFECTS.CHANGE },
  { title: 'Blink', value: EFFECTS.BLINK },
  { title: 'Breathe', value: EFFECTS.BREATHE },
  { title: 'Creep', value: EFFECTS.CREEP },
  { title: 'Wheel', value: EFFECTS.WHEEL },
  { title: 'Walk Pixel', value: EFFECTS.WALK_PIXEL },
];

// Capabilities
const EFFECT_NEEDS_INTERVAL: ReadonlySet<EffectName> = new Set<EffectName>([
  EFFECTS.CHANGE,
  EFFECTS.BLINK,
  EFFECTS.BREATHE,
  EFFECTS.CREEP,
  EFFECTS.WHEEL,
  EFFECTS.WALK_PIXEL,
]);

const EFFECT_ALLOWS_CUSTOM: ReadonlySet<EffectName> = new Set<EffectName>([
  EFFECTS.SOLID,
  EFFECTS.BLINK,
  EFFECTS.BREATHE,
  EFFECTS.CREEP,
  EFFECTS.WALK_PIXEL,
]);

// Random color is *not allowed for Change or Wheel
const EFFECT_ALLOWS_RANDOM: ReadonlySet<EffectName> = new Set<EffectName>([
  EFFECTS.SOLID,
  EFFECTS.BLINK,
  EFFECTS.CREEP,
  EFFECTS.WALK_PIXEL,
]);

// For random 'change' (interval choice), exclude Blink
const EFFECT_ALLOWS_RANDOM_CHANGE_INTERVAL: ReadonlySet<EffectName> =
  new Set<EffectName>([EFFECTS.CREEP, EFFECTS.WALK_PIXEL]);

// -----------------------------------------------------------------------------
// Helpers (on raw AnswersShape)
// -----------------------------------------------------------------------------

const isOn: Predicate = (v) => v.command === 1;

const effectEquals =
  (e: EffectName): Predicate =>
  (v) =>
    v.effect === e;

const needsInterval: Predicate = (v) =>
  EFFECT_NEEDS_INTERVAL.has(v.effect as EffectName);

const allowsCustom: Predicate = (v) =>
  EFFECT_ALLOWS_CUSTOM.has(v.effect as EffectName);

const allowsRandom: Predicate = (v) =>
  EFFECT_ALLOWS_RANDOM.has(v.effect as EffectName);

const allowsRandomcolorChangeInterval: Predicate = (v) =>
  EFFECT_ALLOWS_RANDOM_CHANGE_INTERVAL.has(v.effect as EffectName);

// Motion override enabled?
const motionEnabled: Predicate = (v) => v.useMotionDetection === 1;

const motionCustom: Predicate = (v) => v.useMotionDetection === 1 && v.motionColorMode === 'custom';

const motionRandom: Predicate = (v) => v.useMotionDetection === 1 && v.motionColorMode === 'random';

/** Wraps a predicate into a dynamic `type` function that `prompts` accepts. */
const show = (type: PromptType, pred: Predicate): PromptTypeFn =>
  (_prev, values) => (pred(values) ? type : null);

// -----------------------------------------------------------------------------
// Small factories
// -----------------------------------------------------------------------------

const promptSelect = <T = unknown>(
  name: string,
  message: string,
  choices: SelectChoice<T>[],
  when?: Predicate
): PromptObject<string> => ({
  type: show('select', when ?? (() => true)),
  name,
  message,
  choices,
});

const promptNumber = (
  name: string,
  message: string,
  { min, max, initial, when }: NumberPromptConfig
): PromptObject<string> => ({
  type: show('number', when ?? (() => true)),
  name,
  message,
  initial,
  validate: integerBetween(min, max),
});

// -----------------------------------------------------------------------------
// final prompts config
// -----------------------------------------------------------------------------

export const promptsConfig: PromptObject<string>[] = [
  // Command
  promptSelect('command', 'Select command', [
    { title: 'On', value: 1 },
    { title: 'Off', value: 0 },
  ]),

  // Effect (only when turning on)
  promptSelect('effect', 'Select effect', EFFECT_CHOICES, isOn),

  // LED count (always asked)
  promptNumber('leds', 'Enter number of LEDs (0-100)', {
    min: 0,
    max: 100,
    initial: 100,
  }),

  // Brightness (only when on)
  promptNumber('brightness', 'Enter brightness (0-255)', {
    min: 0,
    max: 255,
    initial: 128,
    when: isOn,
  }),

  // Interval (for all effects except Solid)
  promptNumber('interval', 'Enter interval (milliseconds)', {
    min: 1,
    max: 60_000,
    initial: 250,
    when: and(isOn, (v) => needsInterval(v)),
  }),

  // Color mode (disallowed for change & wheel)
  promptSelect(
    'colorMode',
    'Select color mode',
    [
      { title: 'Custom', value: 'custom' },
      { title: 'Random', value: 'random' },
    ],
    and(
      isOn,
      (v) => allowsCustom(v) || allowsRandom(v)
    )
  ),

  // Random color subtype (only when random, and not for solid/change)
  promptSelect(
    'randomColorMode',
    'Select random color mode',
    [
      { title: 'Static', value: 'static' },
      { title: 'Change', value: 'change' },
    ],
    and(
      isOn,
      (v) =>
        v.colorMode === 'random' &&
        v.effect !== EFFECTS.SOLID &&
        v.effect !== EFFECTS.CHANGE
    )
  ),

  // Random 'change' interval (every pixel vs end of loop)
  promptSelect(
    'colorChangeInterval',
    'Select color change interval',
    [
      { title: 'After every pixel', value: 'everyPixel' },
      { title: 'At end of loop', value: 'everyLoop' },
    ],
    and(
      isOn,
      (v) =>
        v.colorMode === 'random' &&
        v.randomColorMode === 'change' &&
        v.effect !== EFFECTS.BLINK &&
        allowsRandomcolorChangeInterval(v)
    )
  ),

  // Custom RGB (only when custom color is allowed)
  promptNumber('red', 'Enter red value (0-255)', {
    min: 0,
    max: 255,
    initial: 0,
    when: and(
      isOn,
      (v) => v.colorMode === 'custom' && allowsCustom(v)
    ),
  }),
  promptNumber('green', 'Enter green value (0-255)', {
    min: 0,
    max: 255,
    initial: 0,
    when: and(
      isOn,
      (v) => v.colorMode === 'custom' && allowsCustom(v)
    ),
  }),
  promptNumber('blue', 'Enter blue value (0-255)', {
    min: 0,
    max: 255,
    initial: 0,
    when: and(
      isOn,
      (v) => v.colorMode === 'custom' && allowsCustom(v)
    ),
  }),

  // Walk Pixel -> pixel state
  promptSelect(
    'pixelState',
    'Select pixel',
    [
      { title: 'On', value: 1 },
      { title: 'Off', value: 0 },
    ],
    and(isOn, effectEquals(EFFECTS.WALK_PIXEL))
  ),

  // ---------------------------------------------------------------------------
  // Motion color override
  // ---------------------------------------------------------------------------

  // Enable motion override (only when turning on)
  promptSelect(
    'useMotionDetection',
    'Enable motion detection?',
    [
      { title: 'No', value: 0 },
      { title: 'Yes', value: 1 }
    ],
    isOn
  ),
  promptSelect(
    'motionColorMode',
    'Select motion color mode',
    [
      { title: 'Custom', value: 'custom' },
      { title: 'Random', value: 'random' }
    ],
    and(isOn, motionEnabled)
  ),

  // Motion custom RGB (only if custom), default to white
  promptNumber('motionRed', 'Enter motion red value (0-255)', {
    min: 0,
    max: 255,
    initial: 255,
    when: and(isOn, motionCustom),
  }),
  promptNumber('motionGreen', 'Enter motion green value (0-255)', {
    min: 0,
    max: 255,
    initial: 255,
    when: and(isOn, motionCustom),
  }),
  promptNumber('motionBlue', 'Enter motion blue value (0-255)', {
    min: 0,
    max: 255,
    initial: 255,
    when: and(isOn, motionCustom),
  })
];
