import { EffectManager } from './EffectManager.js';
import type { Config } from './types/index.js';

jest.mock('./ledRuntime.js', () => ({
  init: jest.fn(),
  dispose: jest.fn(),
}));

import { init as runtimeInit, dispose as runtimeDispose } from './ledRuntime.js';

const runtimeInitMock = runtimeInit as jest.MockedFunction<typeof runtimeInit>;
const runtimeDisposeMock = runtimeDispose as jest.MockedFunction<typeof runtimeDispose>;

type ManagerEffect = Parameters<EffectManager['start']>[0];

const createEffect = (withStop = true) => {
  const runMock = jest.fn<void, []>();
  const stopMock = withStop ? jest.fn<void, []>() : undefined;
  const effect: ManagerEffect = {
    run: runMock,
    ...(stopMock ? { stop: stopMock } : {}),
  };

  return { effect, runMock, stopMock };
};

const createConfig = (overrides: Partial<Config> = {}): Config => ({
  leds: 12,
  dma: 10,
  brightness: 100,
  gpio: 18,
  stripType: 'rgb',
  ...overrides,
});

describe('EffectManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('constructor initializes runtime and stores config', () => {
    const config = createConfig();

    const manager = new EffectManager(config);

    expect(runtimeInitMock).toHaveBeenCalledWith(config);
    expect(manager.config).toBe(config);
    expect(manager._current).toBeNull();
  });

  test('start stops current effect before running the next one', async () => {
    const manager = new EffectManager(createConfig());
    const first = createEffect();
    const second = createEffect();

    await manager.start(first.effect);
    expect(first.runMock).toHaveBeenCalledTimes(1);

    await manager.start(second.effect);

    expect(first.stopMock).toHaveBeenCalledTimes(1);
    expect(second.runMock).toHaveBeenCalledTimes(1);
    expect(manager._current).toBe(second.effect);
  });

  test('stop clears the current effect even if it lacks a stop method', async () => {
    const manager = new EffectManager(createConfig());
    const effect = createEffect(false);

    await manager.start(effect.effect);
    await manager.stop();

    expect(effect.runMock).toHaveBeenCalledTimes(1);
    expect(manager._current).toBeNull();
  });

  test('dispose stops the active effect, disposes runtime, and prevents future starts', async () => {
    const manager = new EffectManager(createConfig());
    const effect = createEffect();

    await manager.start(effect.effect);
    await manager.dispose();

    expect(effect.stopMock).toHaveBeenCalledTimes(1);
    expect(runtimeDisposeMock).toHaveBeenCalledTimes(1);

    await expect(manager.start(createEffect().effect)).rejects.toThrow('EffectManager already disposed');

    await manager.dispose();
    expect(runtimeDisposeMock).toHaveBeenCalledTimes(1);
  });
});
