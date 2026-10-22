import { init, safeRender, dispose, setGamma, getGamma, runtime } from './ledRuntime.js';
import type { Config } from './types/index.js';
import * as ws281x from 'rpi-ws281x';

const wsMock = ws281x as jest.Mocked<typeof ws281x>;

const createConfig = (overrides: Partial<Config> = {}): Config => ({
  leds: 10,
  dma: 10,
  brightness: 128,
  gpio: 18,
  stripType: 'rgb',
  gamma: 2.2,
  ...overrides,
});

const lastConfigureCall = () => {
  const calls = wsMock.configure.mock.calls;
  return calls[calls.length - 1]?.[0];
};

describe('ledRuntime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    runtime.alive = false;
  });

  test('init configures ws281x and marks runtime alive', async () => {
    const config = createConfig();

    await init(config);

    expect(wsMock.configure).toHaveBeenCalledWith(config);
    expect(runtime.alive).toBe(true);
  });

  test('safeRender only renders when runtime is alive', async () => {
    const pixels = new Uint32Array(5);

    safeRender(pixels);
    expect(wsMock.render).not.toHaveBeenCalled();

    await init(createConfig());
    safeRender(pixels);

    expect(wsMock.render).toHaveBeenCalledWith(pixels);
  });

  test('dispose waits for ticks, resets ws281x, and marks runtime dead', async () => {
    await init(createConfig());
    runtime.alive = true;

    await dispose();

    expect(runtime.alive).toBe(false);
    expect(wsMock.reset).toHaveBeenCalledTimes(1);
  });

  describe('gamma', () => {
    test('passes a valid gamma through to the driver', async () => {
      await init(createConfig({ gamma: 2.8 }));

      expect(lastConfigureCall()).toEqual(expect.objectContaining({ gamma: 2.8 }));
    });

    test('omits gamma from driver config when unset', async () => {
      await init(createConfig({ gamma: undefined }));

      expect(lastConfigureCall()).not.toHaveProperty('gamma');
      expect(runtime.alive).toBe(true);
    });

    test.each([
      [22, 3.0],
      [0.5, 1.0],
      [0, 1.0],
    ])('clamps gamma %p to %p', async (input, expected) => {
      await init(createConfig({ gamma: input }));

      expect(lastConfigureCall()).toEqual(expect.objectContaining({ gamma: expected }));
    });

    test.each([NaN, Infinity])('rejects invalid gamma %p without configuring', async (input) => {
      await expect(init(createConfig({ gamma: input }))).rejects.toThrow(/Invalid gamma/);

      expect(wsMock.configure).not.toHaveBeenCalled();
      expect(runtime.alive).toBe(false);
    });

    test('setGamma resets and reconfigures with new gamma, keeping other options', async () => {
      await init(createConfig());
      jest.clearAllMocks();

      await setGamma(2.5);

      expect(wsMock.reset).toHaveBeenCalledTimes(1);
      expect(lastConfigureCall()).toEqual(createConfig({ gamma: 2.5 }));
      expect(runtime.alive).toBe(true);
      expect(getGamma()).toBe(2.5);
    });

    test('setGamma(undefined) disables correction', async () => {
      await init(createConfig());

      await setGamma(undefined);

      expect(lastConfigureCall()).not.toHaveProperty('gamma');
      expect(getGamma()).toBeUndefined();
    });

    test('setGamma rejects invalid gamma without disposing', async () => {
      await init(createConfig());
      jest.clearAllMocks();

      await expect(setGamma(NaN)).rejects.toThrow(/Invalid gamma/);

      expect(wsMock.reset).not.toHaveBeenCalled();
      expect(runtime.alive).toBe(true);
      expect(getGamma()).toBe(2.2);
    });
  });
});