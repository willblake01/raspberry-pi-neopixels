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
      colorType: 'random',
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
    expect(normalized.isCustomColorMode).toBe(false);
    expect(normalized.isChangeRandomColorMode).toBe(true);
    expect(normalized.isEveryLoopColorChangeInterval).toBe(true);
    expect(normalized.isEveryPixelColorChangeInterval).toBe(false);
    expect(normalized.isPixelOn).toBe(true);

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
      colorType: 'custom',
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
    expect(normalized.isPixelOn).toBe(false);
  });

  test('shift and motion flags', () => {
    const normalized = normalizeAnswers({
      command: 1,
      effect: EFFECTS.CHECKERBOARD,
      shift: 1,
      useMotionDetection: 1,
      motionColorType: 'custom',
    } as any);

    expect(normalized.isCheckerboard).toBe(true);
    expect(normalized.isShift).toBe(true);
    expect(normalized.isMotionDetectionEnabled).toBe(true);
    expect(normalized.isMotionCustomColorMode).toBe(true);
    expect(normalized.isMotionRandomColorMode).toBe(false);
  });

  test('motion color flags are false when motion detection is off', () => {
    const normalized = normalizeAnswers({
      command: 1,
      useMotionDetection: 0,
      motionColorType: 'random',
    } as any);

    expect(normalized.isMotionDetectionEnabled).toBe(false);
    expect(normalized.isMotionRandomColorMode).toBe(false);
  });

  test('weather options', () => {
    const normalized = normalizeAnswers({
      command: 1,
      effect: EFFECTS.WEATHER,
      locationType: 'manual',
      location: 'Springfield',
      weatherAlerts: 1,
    } as any);

    expect(normalized.isWeather).toBe(true);
    expect(normalized.locationType).toBe('manual');
    expect(normalized.location).toBe('Springfield');
    expect(normalized.weatherAlerts).toBe(1);
    expect(normalized.isWeatherAlertsEnabled).toBe(true);
  });

  test('weather alerts default to off when not answered', () => {
    const normalized = normalizeAnswers({ command: 1, effect: EFFECTS.SOLID } as any);

    expect(normalized.weatherAlerts).toBe(0);
    expect(normalized.isWeatherAlertsEnabled).toBe(false);
  });

  test('passes through pomodoro, moon and gamma settings', () => {
    const normalized = normalizeAnswers({
      command: 1,
      gamma: 2.5,
      pomodoroWorkMinutes: 50,
      pomodoroShortBreakMinutes: 10,
      pomodoroLongBreakMinutes: 30,
      pomodoroRounds: 3,
      showMoon: 1,
    } as any);

    expect(normalized.gamma).toBe(2.5);
    expect(normalized.pomodoroWorkMinutes).toBe(50);
    expect(normalized.pomodoroShortBreakMinutes).toBe(10);
    expect(normalized.pomodoroLongBreakMinutes).toBe(30);
    expect(normalized.pomodoroRounds).toBe(3);
    expect(normalized.showMoon).toBe(1);
  });

  test('pixel segments default to an empty list', () => {
    expect(normalizeAnswers({ command: 1 } as any).pixelSegments).toEqual([]);
  });
});