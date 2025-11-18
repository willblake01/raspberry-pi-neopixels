import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { normalizeAnswers, promptsConfig } from './prompts/index.js';
import { RULES } from './effects/utils/index.js';

jest.mock('prompts');
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

const promptsMock = prompts as jest.MockedFunction<typeof prompts>;
const normalizeAnswersMock = normalizeAnswers as jest.MockedFunction<typeof normalizeAnswers>;
const EffectManagerMock = EffectManager as unknown as jest.MockedClass<typeof EffectManager>;

describe('index entrypoint', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    promptsMock.mockResolvedValue({} as any);
    normalizeAnswersMock.mockReturnValue({
      leds: 10,
      brightness: 100,
      isOff: true,
      isOn: false,
    } as any);
  });

  test('drives prompts and starts effect manager with selected effect', async () => {
    const startMock = jest.fn();
    const disposeMock = jest.fn();

    EffectManagerMock.mockImplementation(() => ({
      config: { leds: 10, dma: 10, brightness: 100, gpio: 18, stripType: 'rgb' },
      start: startMock,
      dispose: disposeMock,
    }) as any);

    RULES.splice(0, RULES.length, {
      name: 'turn-off',
      when: () => true,
      make: jest.fn(() => ({ run: jest.fn() })),
    } as any);

    await import('./index.js');

    expect(promptsMock).toHaveBeenCalledWith(promptsConfig);
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
