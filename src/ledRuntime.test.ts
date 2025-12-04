import { init, safeRender, dispose, runtime } from './ledRuntime.js';
import type { Config } from './types/index.js';
import * as ws281x from 'rpi-ws281x';

const wsMock = ws281x as jest.Mocked<typeof ws281x>;

const createConfig = (overrides: Partial<Config> = {}): Config => ({
  leds: 10,
  dma: 10,
  brightness: 128,
  gpio: 18,
  stripType: 'rgb',
  ...overrides,
});

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
});
