import { normalizeAnswers } from './normalizeAnswers.js';
import { EFFECTS } from '../constants/index.js';

describe('normalizeAnswers', () => {
  test('derives boolean flags from the raw responses', () => {
    const answers = {
      command: 1,
      leds: 50,
      brightness: 200,
      effect: EFFECTS.WALK_PIXEL,
      interval: 500,
      red: 10,
      green: 20,
      blue: 30,
      colorMode: 'random',
      randomColorMode: 'change',
      colorChangeInterval: 'everyLoop',
      pixelState: 1,
    } as const;

    const normalized = normalizeAnswers(answers as any);

    expect(normalized.isOn).toBe(true);
    expect(normalized.isOff).toBe(false);
    expect(normalized.isWalkPixel).toBe(true);
    expect(normalized.isSolid).toBe(false);
    expect(normalized.isRandomColorMode).toBe(true);
    expect(normalized.isChangeRandomColorMode).toBe(true);
    expect(normalized.isEveryLoopColorChangeInterval).toBe(true);
    expect(normalized.isEveryPixelColorChangeInterval).toBe(false);

    // Ensure original scalar values are preserved
    expect(normalized.command).toBe(answers.command);
    expect(normalized.leds).toBe(answers.leds);
    expect(normalized.brightness).toBe(answers.brightness);
    expect(normalized.effect).toBe(answers.effect);
  });

  test('handles off command paths', () => {
    const answers = {
      command: 0,
      leds: 12,
      brightness: 100,
      effect: EFFECTS.SOLID,
      interval: 0,
      red: 255,
      green: 0,
      blue: 0,
      colorMode: 'custom',
      randomColorMode: 'static',
      colorChangeInterval: 'everyPixel',
      pixelState: 0,
    } as const;

    const normalized = normalizeAnswers(answers as any);

    expect(normalized.isOff).toBe(true);
    expect(normalized.isOn).toBe(false);
    expect(normalized.isSolid).toBe(true);
    expect(normalized.isCustomColorMode).toBe(true);
    expect(normalized.isStaticRandomColorMode).toBe(true);
    expect(normalized.isEveryPixelColorChangeInterval).toBe(true);
  });
});
