import ws281x from 'rpi-ws281x';
import { init, safeRender, dispose, runtime } from './ledRuntime.js';
import type { Config } from './types/index.js';

jest.mock('rpi-ws281x', () => ({
  configure: jest.fn(),
  render: jest.fn(),
  reset: jest.fn(),
}));

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

  test('init configures ws281x and marks runtime alive', () => {
    const config = createConfig();

    init(config);

    expect(wsMock.configure).toHaveBeenCalledWith(config);
    expect(runtime.alive).toBe(true);
  });

  test('safeRender only renders when runtime is alive', () => {
    const pixels = new Uint32Array(5);

    safeRender(pixels);
    expect(wsMock.render).not.toHaveBeenCalled();

    runtime.alive = true;
    safeRender(pixels);

    expect(wsMock.render).toHaveBeenCalledWith(pixels);
  });

  test('dispose waits for ticks, resets ws281x, and marks runtime dead', async () => {
    runtime.alive = true;

    await dispose();

    expect(runtime.alive).toBe(false);
    expect(wsMock.reset).toHaveBeenCalledTimes(1);
  });
});
