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
  prompt: PromptObject<string>,
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

  test('colorMode prompt only shows when an effect supports custom or random', () => {
    const colorModePrompt = getPrompt('colorMode');

    // Solid supports color mode -> shown
    expect(evalType(colorModePrompt, { command: 1, effect: EFFECTS.SOLID })).toBe('select');

    // Wheel does NOT allow colorMode -> hidden
    expect(evalType(colorModePrompt, { command: 1, effect: EFFECTS.WHEEL })).toBeNull();

    // Off -> hidden
    expect(evalType(colorModePrompt, { command: 0, effect: EFFECTS.SOLID })).toBeNull();
  });

  test('randomColorMode prompt is only shown for random-capable effects (non-solid/change)', () => {
    const randomModePrompt = getPrompt('randomColorMode');

    // Random + creep (allowed) -> shown
    expect(
      evalType(randomModePrompt, { command: 1, colorMode: 'random', effect: EFFECTS.CREEP })
    ).toBe('select');

    // Random + solid -> hidden per config
    expect(
      evalType(randomModePrompt, { command: 1, colorMode: 'random', effect: EFFECTS.SOLID })
    ).toBeNull();

    // Random + change -> hidden per config
    expect(
      evalType(randomModePrompt, { command: 1, colorMode: 'random', effect: EFFECTS.CHANGE })
    ).toBeNull();
  });

  test('colorChangeInterval prompt shown only for random change mode and allowed effects', () => {
    const colorChangeIntervalPrompt = getPrompt('colorChangeInterval');

    // Random + change + creep -> shown
    expect(
      evalType(colorChangeIntervalPrompt, {
        command: 1,
        colorMode: 'random',
        randomColorMode: 'change',
        effect: EFFECTS.CREEP,
      })
    ).toBe('select');

    // Random + change + blink excluded -> hidden
    expect(
      evalType(colorChangeIntervalPrompt, {
        command: 1,
        colorMode: 'random',
        randomColorMode: 'change',
        effect: EFFECTS.BLINK,
      })
    ).toBeNull();

    // Static random -> hidden
    expect(
      evalType(colorChangeIntervalPrompt, {
        command: 1,
        colorMode: 'random',
        randomColorMode: 'static',
        effect: EFFECTS.CREEP,
      })
    ).toBeNull();
  });

  test('custom RGB prompts only appear when custom colorMode is selected and effect allows custom', () => {
    const redPrompt = getPrompt('red');
    const greenPrompt = getPrompt('green');
    const bluePrompt = getPrompt('blue');

    for (const p of [redPrompt, greenPrompt, bluePrompt]) {
      // Custom + solid -> shown
      expect(evalType(p, { command: 1, colorMode: 'custom', effect: EFFECTS.SOLID })).toBe(
        'number'
      );

      // Random -> hidden
      expect(evalType(p, { command: 1, colorMode: 'random', effect: EFFECTS.SOLID })).toBeNull();

      // Effect that doesn't allow custom (wheel) -> hidden
      expect(evalType(p, { command: 1, colorMode: 'custom', effect: EFFECTS.WHEEL })).toBeNull();
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

  test('motionColorMode prompt appears only when motion override is enabled', () => {
    const motionColorModePrompt = getPrompt('motionColorMode');

    // Not enabled -> hidden
    expect(
      evalType(motionColorModePrompt, { command: 1, useMotionDetection: 0 })
    ).toBeNull();

    // Enabled -> shown
    expect(
      evalType(motionColorModePrompt, { command: 1, useMotionDetection: 1 })
    ).toBe('select');
  });

  test('motion RGB prompts appear only for custom motionColorMode AND when enabled', () => {
    const motionRedPrompt = getPrompt('motionRed');
    const motionGreenPrompt = getPrompt('motionGreen');
    const motionBluePrompt = getPrompt('motionBlue');

    for (const p of [motionRedPrompt, motionGreenPrompt, motionBluePrompt]) {
      // Enabled + custom -> shown
      expect(
        evalType(p, {
          command: 1,
          useMotionDetection: 1,
          motionColorMode: 'custom',
        })
      ).toBe('number');

      // Enabled + random -> hidden
      expect(
        evalType(p, {
          command: 1,
          useMotionDetection: 1,
          motionColorMode: 'random',
        })
      ).toBeNull();

      // Not enabled -> hidden
      expect(
        evalType(p, {
          command: 1,
          useMotionDetection: 0,
          motionColorMode: 'custom',
        })
      ).toBeNull();
    }
  });
});
