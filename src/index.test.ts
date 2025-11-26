import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { normalizeAnswers, promptsConfig } from './prompts/index.js';
import { RULES } from './effects/utils/index.js';
import { main } from './index.js';

jest.useFakeTimers();

jest.mock('prompts', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('./EffectManager.js');
jest.mock('./prompts/index.js', () => ({
  promptsConfig: [{ name: 'command' }],
  normalizeAnswers: jest.fn(),
}));
jest.mock('./effects/utils/index.js', () => ({
  RULES: [],
}));
jest.mock('./effects/index.js', () => ({
  TurnOff: jest.fn(function MockTurnOff() {}),
  SolidCustom: jest.fn(function MockSolidCustom() {})
}));
jest.mock('./utils/index.js', () => ({
  once: (fn: unknown) => fn,
  randomNumber: jest.fn((min: number, max: number) => Math.floor((min + max) / 2)),
}));

describe('index entrypoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('drives prompts and starts effect manager with selected effect', async () => {
    const { default: promptsMock } = jest.requireMock('prompts') as {
      default: jest.MockedFunction<typeof prompts>;
    };
    const {
      normalizeAnswers: normalizeAnswersMock,
      promptsConfig: mockedPromptsConfig,
    } = jest.requireMock('./prompts/index.js') as {
      normalizeAnswers: jest.MockedFunction<typeof normalizeAnswers>;
      promptsConfig: typeof promptsConfig;
    };
    const { EffectManager: EffectManagerMock } = jest.requireMock('./EffectManager.js') as {
      EffectManager: jest.MockedClass<typeof EffectManager>;
    };
    const { RULES: mockedRules } = jest.requireMock('./effects/utils/index.js') as {
      RULES: typeof RULES;
    };

    promptsMock.mockResolvedValue({} as any);
    normalizeAnswersMock.mockReturnValue({
      leds: 100,
      brightness: 128,
      isOff: false,
      isOn: true,
    } as any);

    const startMock = jest.fn();
    const disposeMock = jest.fn();

    EffectManagerMock.mockImplementation(() => ({
      config: { leds: 100, dma: 10, brightness: 128, gpio: 18, stripType: 'brg' },
      start: startMock,
      dispose: disposeMock,
    }) as any);

    mockedRules.splice(0, mockedRules.length, {
      name: 'turn-off',
      when: () => true,
      make: jest.fn(() => ({ run: jest.fn() })),
    } as any);

    // Kick off main but don't await it yet
    const mainPromise = main();

    // Let the prompts() promise resolve
    await Promise.resolve();

    // Fast-forward the 1s delay
    jest.advanceTimersByTime(1000);

    // Wait for main to finish anything pending after the delay
    await mainPromise;

    expect(promptsMock).toHaveBeenCalledWith(mockedPromptsConfig);
    expect(normalizeAnswersMock).toHaveBeenCalled();
    expect(EffectManagerMock).toHaveBeenCalledWith({
      leds: 100,
      dma: 10,
      brightness: 128,
      gpio: 18,
      stripType: 'brg',
    });
    expect(startMock).toHaveBeenCalled();
  });
});
