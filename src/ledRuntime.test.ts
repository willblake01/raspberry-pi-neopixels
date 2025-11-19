import { loadWs281x } from './hardware/ws281x.js';
import { init, safeRender, dispose, runtime } from './ledRuntime.js';
import type { Config } from './types/index.js';

jest.mock('rpi-ws281x', () => ({
  configure: jest.fn(),
  render: jest.fn(),
  reset: jest.fn(),
}));

const createConfig = (overrides: Partial<Config> = {}): Config => ({
  leds: 10,
  dma: 10,
  brightness: 128,
  gpio: 18,
  stripType: 'rgb',
  ...overrides,
});

type Ws281x = Awaited<ReturnType<typeof loadWs281x>>;
let wsMock: jest.Mocked<Ws281x>;

beforeAll(async () => {
  const ws281x = await loadWs281x();
  wsMock = ws281x as jest.Mocked<Ws281x>;
});

describe('ledRuntime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    runtime.alive = false;
  });

  test('init configures ws281x and marks runtime alive', async () => {
    const config = createConfig();

    await init(config); // ⬅️ important

    expect(wsMock.configure).toHaveBeenCalledWith(config);
    expect(runtime.alive).toBe(true);
  });

  test('safeRender only renders when runtime is alive', async () => {
    const pixels = new Uint32Array(5);

    // Before init: should not render
    safeRender(pixels);
    expect(wsMock.render).not.toHaveBeenCalled();

    // After init: should render
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
