import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { normalizeAnswers, promptsConfig } from './prompts/index.js';
import { RULES } from './effects/utils/index.js';

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
}));
jest.mock('./utils/index.js', () => ({
  once: (fn: unknown) => fn,
}));

describe('index entrypoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('drives prompts and starts effect manager with selected effect', () => {
    const { default: promptsMock } = jest.requireMock('prompts') as {
      default: jest.MockedFunction<typeof prompts>;
    };
    const { normalizeAnswers: normalizeAnswersMock, promptsConfig: mockedPromptsConfig } =
      jest.requireMock('./prompts/index.js') as {
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
      leds: 10,
      brightness: 100,
      isOff: false,
      isOn: true,
    } as any);

    const startMock = jest.fn();
    const disposeMock = jest.fn();

    EffectManagerMock.mockImplementation(() => ({
      config: { leds: 10, dma: 10, brightness: 100, gpio: 18, stripType: 'rgb' },
      start: startMock,
      dispose: disposeMock,
    }) as any);

    mockedRules.splice(0, mockedRules.length, {
      name: 'turn-off',
      when: () => true,
      make: jest.fn(() => ({ run: jest.fn() })),
    } as any);

    // Run index.ts in an isolated module environment AFTER mocks are set up
    jest.isolateModules(() => {
      // ts-jest will transpile this require() fine even in ESM-mode tests
      // and it avoids top-level await entirely.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./index.js');
    });

    // Fast-forward the delay(1000)
    jest.advanceTimersByTime(1000);

    // Let any pending microtasks finish
    return Promise.resolve().then(() => {
      expect(promptsMock).toHaveBeenCalledWith(mockedPromptsConfig);
      expect(normalizeAnswersMock).toHaveBeenCalled();
      expect(EffectManagerMock).toHaveBeenCalledWith({
        leds: 10,
        dma: 10,
        brightness: 100,
        gpio: 18,
        stripType: 'rgb',
      });
      expect(startMock).toHaveBeenCalled();
    });
  });
});
