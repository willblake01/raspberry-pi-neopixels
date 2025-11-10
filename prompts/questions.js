const EFFECTS = {
  SOLID: 'solid',
  CHANGE: 'change',
  BLINK: 'blink',
  BREATHE: 'breathe',
  CREEP: 'creep',
  WHEEL: 'wheel',
  WALK_PIXEL: 'walk pixel',
};

const EFFECT_CHOICES = [
  { title: 'Solid', value: EFFECTS.SOLID },
  { title: 'Change', value: EFFECTS.CHANGE },
  { title: 'Blink', value: EFFECTS.BLINK },
  { title: 'Breathe', value: EFFECTS.BREATHE },
  { title: 'Creep', value: EFFECTS.CREEP },
  { title: 'Wheel', value: EFFECTS.WHEEL },
  { title: 'Walk Pixel', value: EFFECTS.WALK_PIXEL }
];

const EFFECT_NEEDS_INTERVAL = new Set([
  EFFECTS.CHANGE, EFFECTS.BLINK, EFFECTS.BREATHE, EFFECTS.CREEP, EFFECTS.WHEEL, EFFECTS.WALK_PIXEL
]);
const EFFECT_ALLOWS_CUSTOM = new Set([
  EFFECTS.SOLID, EFFECTS.BLINK, EFFECTS.BREATHE, EFFECTS.CREEP, EFFECTS.WALK_PIXEL
]);
const EFFECT_ALLOWS_RANDOM = new Set([
  EFFECTS.SOLID, EFFECTS.BLINK, EFFECTS.CREEP, EFFECTS.WALK_PIXEL
]);
const EFFECT_ALLOWS_RANDOM_CHANGE_INTERVAL = new Set([
  EFFECTS.CREEP, EFFECTS.WALK_PIXEL, EFFECTS.SOLID
]);

const isOn = v => v.command === 1;
const eqEffect = e => v => v.effect === e;

const needsInterval = v => EFFECT_NEEDS_INTERVAL.has(v.effect);
const allowsCustom = v => EFFECT_ALLOWS_CUSTOM.has(v.effect);
const allowsRandom = v => EFFECT_ALLOWS_RANDOM.has(v.effect);
const allowsRandomChangeInterval = v => EFFECT_ALLOWS_RANDOM_CHANGE_INTERVAL.has(v.effect);

const show = pred => (_prev, values) => (pred(values) ? undefined : null);
const and = (...fns) => v => fns.every(f => f(v));
const intIn = (min, max) => x => (Number.isInteger(x) && x >= min && x <= max) || `Enter an integer ${min}-${max}`;

const qSelect = (name, message, choices, when) => ({ type: show(when ?? (() => true)), name, message, choices });

const qNumber = (name, message, { min, max, initial, when }) => ({
  type: show(when ?? (() => true)),
  name,
  message,
  initial,
  validate: intIn(min, max),
});

export const questions = [
  qSelect('command', 'Enter command', [
    { title: 'On', value: 1 },
    { title: 'Off', value: 0 }
  ]),

  // Effect (only when turning on)
  qSelect('effect', 'Set effect', EFFECT_CHOICES, isOn),

  // Walk Pixel -> pixel state
  qSelect('pixelState', 'Set pixel', [
    { title: 'On', value: 1 },
    { title: 'Off', value: 0 }
  ], and(isOn, eqEffect(EFFECTS.WALK_PIXEL))),

  // Interval (for all effects except Solid)
  qNumber('interval', 'Enter interval (milliseconds)', {
    min: 1, max: 60_000, initial: 250, when: and(isOn, v => needsInterval(v) && v.effect !== EFFECTS.SOLID)
  }),

  // LED count (always asked)
  qNumber('leds', 'Enter number of LEDs (0-100)', {
    min: 0, max: 100, initial: 30
  }),

  // Brightness (only when on)
  qNumber('brightness', 'Enter brightness (0-255)', {
    min: 0, max: 255, inital: 128, when: isOn
  }),

  // Color mode (disallowed for change & wheel)
  qSelect('colorMode', 'Set color mode', [
    { title: 'Custom', value: 'custom' },
    { title: 'Random', value: 'random' }
  ], and(isOn, v => allowsCustom(v) || allowsRandom(v))),

  // Random color subtype (only when random, and not for solid/change)
  qSelect('randomColorMode', 'Set random color mode', [
    { title: 'Static', value: 'static' },
    { title: 'Change', value: 'change' }
  ], and(isOn, v => v.colorMode === 'random' && v.effect !== EFFECTS.SOLID && v.effect !== EFFECTS.CHANGE)),

  // Random 'change' interval (every pixel vs end of loop)
  qSelect('colorChangeInterval', 'Set color change interval', [
    { title: 'After every pixel', value: 'everyPixel' },
    { title: 'At end of loop', value: 'everyLoop' }
  ], and(isOn, v => v.colorMode === 'random' && v.randomColorMode === 'change' && v.effect !== EFFECTS.BLINK && allowsRandomChangeInterval)),

  // Custom RGB (only when custom is allowed)
  qNumber('red', 'Enter a red value (0-255)', { min: 0, max: 255, initial: 0, when: and(isOn, v => v.colorMode === 'custom' && allowsCustom(v)) }),
  qNumber('green', 'Enter a green value (0-255)', { min: 0, max: 255, initial: 0, when: and(isOn, v => v.colorMode === 'custom' && allowsCustom(v)) }),
  qNumber('blue', 'Enter a blue value (0-255)', { min: 0, max: 255, inital: 0, when: and(isOn, v => v.colorMode === 'custom' && allowsCustom(v)) })
];
