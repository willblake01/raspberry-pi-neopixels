import type { PromptObject, PromptType } from 'prompts';
import { promptsConfig } from './prompts.js';
import { EFFECTS } from '../constants/index.js';

/**
 * prompts `type` can be:
 * - a function (your show(...))
 * - a string literal ('select'/'number')
 * - false/null
 *
 * This helper normalizes that into the *resolved* runtime type.
 */
const evalType = (
  prompt: PromptObject,
  values: any
): PromptType | null => {
  const t = prompt.type;

  if (typeof t === 'function') {
    // prompts calls: type(prev, values, prompt)
    const out = t(null as never, values as never, prompt as never);
    return out ? (out as PromptType) : null; // normalize falsy -> null
  }

  if (typeof t === 'string') return t;
  return null;
};

const getPrompt = (name: string) => {
  const p = promptsConfig.find((x) => x.name === name);
  expect(p).toBeDefined();
  return p!;
};

const shownPrompts = (answers: Record<string, unknown>) =>
    promptsConfig
        .filter((p) => typeof p.type !== 'function' || (p.type as Function)(undefined, answers, p) !== null)
        .map((p) => p.name);

describe('prompts configuration', () => {
  test('command prompt is always shown and offers on/off options', () => {
    const commandPrompt = getPrompt('command');
    expect(commandPrompt.choices).toEqual([
      { title: 'On', value: 1 },
      { title: 'Off', value: 0 },
    ]);
    expect(evalType(commandPrompt, {})).toBe('select');
  });

  test('effect prompt appears only when command is on', () => {
    const effectPrompt = getPrompt('effect');

    expect(evalType(effectPrompt, { command: 0 })).toBeNull();
    expect(evalType(effectPrompt, { command: 1 })).toBe('select');
  });

  test('brightness prompt appears only when command is on', () => {
    const brightnessPrompt = getPrompt('brightness');

    expect(evalType(brightnessPrompt, { command: 0 })).toBeNull();
    expect(evalType(brightnessPrompt, { command: 1 })).toBe('number');
  });

  test('interval prompt respects effect capabilities', () => {
    const intervalPrompt = getPrompt('interval');

    // Needs interval -> shown
    expect(evalType(intervalPrompt, { command: 1, effect: EFFECTS.BLINK })).toBe('number');
    expect(evalType(intervalPrompt, { command: 1, effect: EFFECTS.WHEEL })).toBe('number');

    // Solid does not need interval -> hidden
    expect(evalType(intervalPrompt, { command: 1, effect: EFFECTS.SOLID })).toBeNull();

    // Off -> hidden always
    expect(evalType(intervalPrompt, { command: 0, effect: EFFECTS.BLINK })).toBeNull();
  });

  test('colorType prompt only shows when an effect supports custom or random', () => {
    const colorTypePrompt = getPrompt('colorType');

    // Solid supports color type -> shown
    expect(evalType(colorTypePrompt, { command: 1, effect: EFFECTS.SOLID })).toBe('select');

    // Wheel does NOT allow colorType -> hidden
    expect(evalType(colorTypePrompt, { command: 1, effect: EFFECTS.WHEEL })).toBeNull();

    // Off -> hidden
    expect(evalType(colorTypePrompt, { command: 0, effect: EFFECTS.SOLID })).toBeNull();
  });

  test('randomColorMode prompt is only shown for random-capable effects (non-solid/change)', () => {
    const randomModePrompt = getPrompt('randomColorMode');

    // Random + creep (allowed) -> shown
    expect(
      evalType(randomModePrompt, { command: 1, colorType: 'random', effect: EFFECTS.GROWING_BAR })
    ).toBe('select');

    // Random + solid -> hidden per config
    expect(
      evalType(randomModePrompt, { command: 1, colorType: 'random', effect: EFFECTS.SOLID })
    ).toBeNull();

    // Random + change -> hidden per config
    expect(
      evalType(randomModePrompt, { command: 1, colorType: 'random', effect: EFFECTS.CHANGE })
    ).toBeNull();
  });

  test('colorChangeInterval prompt shown only for random change mode and allowed effects', () => {
    const colorChangeIntervalPrompt = getPrompt('colorChangeInterval');

    // Random + change + creep -> shown
    expect(
      evalType(colorChangeIntervalPrompt, {
        command: 1,
        colorType: 'random',
        randomColorMode: 'change',
        effect: EFFECTS.GROWING_BAR,
      })
    ).toBe('select');

    // Random + change + blink excluded -> hidden
    expect(
      evalType(colorChangeIntervalPrompt, {
        command: 1,
        colorType: 'random',
        randomColorMode: 'change',
        effect: EFFECTS.BLINK,
      })
    ).toBeNull();

    // Static random -> hidden
    expect(
      evalType(colorChangeIntervalPrompt, {
        command: 1,
        colorType: 'random',
        randomColorMode: 'static',
        effect: EFFECTS.GROWING_BAR,
      })
    ).toBeNull();
  });

  test('custom RGB prompts only appear when custom colorType is selected and effect allows custom', () => {
    const redPrompt = getPrompt('red');
    const greenPrompt = getPrompt('green');
    const bluePrompt = getPrompt('blue');

    for (const p of [redPrompt, greenPrompt, bluePrompt]) {
      // Custom + solid -> shown
      expect(evalType(p, { command: 1, colorType: 'custom', effect: EFFECTS.SOLID })).toBe(
        'number'
      );

      // Random -> hidden
      expect(evalType(p, { command: 1, colorType: 'random', effect: EFFECTS.SOLID })).toBeNull();

      // Effect that doesn't allow custom (wheel) -> hidden
      expect(evalType(p, { command: 1, colorType: 'custom', effect: EFFECTS.WHEEL })).toBeNull();
    }
  });

  test('walk pixel pixelState prompt only appears for walk pixel effect', () => {
    const pixelStatePrompt = getPrompt('pixelState');

    expect(evalType(pixelStatePrompt, { command: 1, effect: EFFECTS.WALK_PIXEL })).toBe('select');
    expect(evalType(pixelStatePrompt, { command: 1, effect: EFFECTS.SOLID })).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // Motion color override tests
  // ---------------------------------------------------------------------------

  test('useMotionDetection prompt appears only when command is on', () => {
    const useMotionPrompt = getPrompt('useMotionDetection');

    expect(evalType(useMotionPrompt, { command: 0 })).toBeNull();
    expect(evalType(useMotionPrompt, { command: 1 })).toBe('select');

    expect(useMotionPrompt.choices).toEqual([
      { title: 'No', value: 0 },
      { title: 'Yes', value: 1 },
    ]);
  });

  test('motionColorType prompt appears only when motion override is enabled', () => {
    const motionColorModePrompt = getPrompt('motionColorType');

    // Not enabled -> hidden
    expect(
      evalType(motionColorModePrompt, { command: 1, useMotionDetection: 0 })
    ).toBeNull();

    // Enabled -> shown
    expect(
      evalType(motionColorModePrompt, { command: 1, useMotionDetection: 1 })
    ).toBe('select');
  });

  test('motion RGB prompts appear only for custom motionColorType AND when enabled', () => {
    const motionRedPrompt = getPrompt('motionRed');
    const motionGreenPrompt = getPrompt('motionGreen');
    const motionBluePrompt = getPrompt('motionBlue');

    for (const p of [motionRedPrompt, motionGreenPrompt, motionBluePrompt]) {
      // Enabled + custom -> shown
      expect(
        evalType(p, {
          command: 1,
          useMotionDetection: 1,
          motionColorType: 'custom',
        })
      ).toBe('number');

      // Enabled + random -> hidden
      expect(
        evalType(p, {
          command: 1,
          useMotionDetection: 1,
          motionColorType: 'random',
        })
      ).toBeNull();

      // Not enabled -> hidden
      expect(
        evalType(p, {
          command: 1,
          useMotionDetection: 0,
          motionColorType: 'custom',
        })
      ).toBeNull();
    }
  });

  test('custom colors ask for red, green and blue', () => {
    const names = shownPrompts({ command: 1, effect: EFFECTS.SOLID, colorType: 'custom' });
    expect(names).toEqual(expect.arrayContaining(['red', 'green', 'blue']));
  });

  test('checkerboard with custom colors asks for a second color', () => {
    const names = shownPrompts({ command: 1, effect: EFFECTS.CHECKERBOARD, colorType: 'custom' });
    expect(names).toEqual(expect.arrayContaining(['red2', 'green2', 'blue2']));
  });

  test('shift mode asks for an interval', () => {
    const names = shownPrompts({ command: 1, effect: EFFECTS.CHECKERBOARD, shift: 1 });
    expect(names).toContain('interval');
  });

  test('custom motion color asks for motion RGB', () => {
    const names = shownPrompts({ command: 1, useMotionDetection: 1, motionColorType: 'custom' });
    expect(names).toEqual(expect.arrayContaining(['motionRed', 'motionGreen', 'motionBlue']));
  });
});
