import { promptsConfig } from './prompts.js';
import { EFFECTS } from '../constants/index.js';

describe('prompts configuration', () => {
  test('command prompt is always shown and offers on/off options', () => {
    const commandPrompt = promptsConfig.find((prompt) => prompt.name === 'command');
    expect(commandPrompt).toBeDefined();
    const choices = commandPrompt!.choices ?? [];
    expect(choices).toEqual([
      { title: 'On', value: 1 },
      { title: 'Off', value: 0 },
    ]);
    expect(commandPrompt!.type?.(null as never, {} as never)).toBe('select');
  });

  test('effect prompt appears only when command is on', () => {
    const effectPrompt = promptsConfig.find((prompt) => prompt.name === 'effect');
    expect(effectPrompt).toBeDefined();

    expect(effectPrompt!.type?.(null as never, { command: 0 } as never)).toBeNull();
    expect(effectPrompt!.type?.(null as never, { command: 1 } as never)).toBe('select');
  });

  test('interval prompt respects effect capabilities', () => {
    const intervalPrompt = promptsConfig.find((prompt) => prompt.name === 'interval');
    expect(intervalPrompt).toBeDefined();

    expect(
      intervalPrompt!.type?.(null as never, { command: 1, effect: EFFECTS.BLINK } as never),
    ).toBe('number');

    expect(
      intervalPrompt!.type?.(null as never, { command: 1, effect: EFFECTS.SOLID } as never),
    ).toBeNull();
  });

  test('color mode prompt only shows when an effect supports it', () => {
    const colorModePrompt = promptsConfig.find((prompt) => prompt.name === 'colorMode');
    expect(colorModePrompt).toBeDefined();

    expect(
      colorModePrompt!.type?.(null as never, { command: 1, effect: EFFECTS.SOLID } as never),
    ).toBe('select');

    expect(
      colorModePrompt!.type?.(null as never, { command: 1, effect: EFFECTS.WHEEL } as never),
    ).toBeNull();
  });

  test('random color mode prompt is only shown for random-capable effects', () => {
    const randomModePrompt = promptsConfig.find((prompt) => prompt.name === 'randomColorMode');
    expect(randomModePrompt).toBeDefined();

    expect(
      randomModePrompt!.type?.(
        null as never,
        { command: 1, colorMode: 'random', effect: EFFECTS.CREEP } as never,
      ),
    ).toBe('select');

    expect(
      randomModePrompt!.type?.(
        null as never,
        { command: 1, colorMode: 'random', effect: EFFECTS.SOLID } as never,
      ),
    ).toBeNull();
  });

  test('custom RGB prompts only appear when custom color mode is selected', () => {
    const redPrompt = promptsConfig.find((prompt) => prompt.name === 'red');
    const greenPrompt = promptsConfig.find((prompt) => prompt.name === 'green');
    const bluePrompt = promptsConfig.find((prompt) => prompt.name === 'blue');

    for (const prompt of [redPrompt, greenPrompt, bluePrompt]) {
      expect(prompt).toBeDefined();

      expect(
        prompt!.type?.(
          null as never,
          { command: 1, colorMode: 'custom', effect: EFFECTS.SOLID } as never,
        ),
      ).toBe('number');

      expect(
        prompt!.type?.(
          null as never,
          { command: 1, colorMode: 'random', effect: EFFECTS.SOLID } as never,
        ),
      ).toBeNull();
    }
  });

  test('walk pixel pixelState prompt only appears for walk pixel effect', () => {
    const pixelStatePrompt = promptsConfig.find((prompt) => prompt.name === 'pixelState');
    expect(pixelStatePrompt).toBeDefined();

    expect(
      pixelStatePrompt!.type?.(
        null as never,
        { command: 1, effect: EFFECTS.WALK_PIXEL } as never,
      ),
    ).toBe('select');

    expect(
      pixelStatePrompt!.type?.(
        null as never,
        { command: 1, effect: EFFECTS.SOLID } as never,
      ),
    ).toBeNull();
  });
});
