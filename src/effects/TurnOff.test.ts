// Mocks FIRST
jest.mock('../ledRuntime.js', () => ({
  safeRender: jest.fn(),
}));

jest.mock('rpi-ws281x', () => ({
  reset: jest.fn(),
}));

// Then imports that consume those mocks
import { TurnOff } from './index.js';
import type { Config } from '../types/index.js';
import { safeRender } from '../ledRuntime.js';
import * as ws281x from 'rpi-ws281x';

const safeRenderMock = safeRender as jest.MockedFunction<typeof safeRender>;
const resetMock = ws281x.reset as jest.MockedFunction<typeof ws281x.reset>;

const createConfig = (overrides: Partial<Config> = {}): Config => ({
  leds: 5,
  dma: 10,
  brightness: 50,
  gpio: 18,
  stripType: 'grb',
  ...overrides,
});

beforeEach(() => {
  safeRenderMock.mockClear();
  resetMock.mockClear();
});

describe('TurnOff effect', () => {
  test('run clears all pixels and wires a SIGINT handler that resets the strip', async () => {
    const onSpy = jest.spyOn(process, 'on');
    const nextTickSpy = jest.spyOn(process, 'nextTick');
    const exitSpy = jest.spyOn(process, 'exit');

    let capturedHandler: (() => void) | undefined;

    onSpy.mockImplementation(((event: string, handler: (...args: unknown[]) => void) => {
      if (event === 'SIGINT') {
        capturedHandler = handler as () => void;
      }

      return process;
    }) as typeof process.on);

    nextTickSpy.mockImplementation(
      ((cb: (...args: unknown[]) => void, ...args: unknown[]) => {
        cb(...args);
      }) as typeof process.nextTick,
    );

    exitSpy.mockImplementation((() => undefined as never) as typeof process.exit);

    const effect = new TurnOff(createConfig().leds);
    await effect.run(); // ⬅️ wait for safeRender to be hit

    // safeRender called once with zeroed pixels
    expect(safeRenderMock).toHaveBeenCalledTimes(1);
    const pixels = safeRenderMock.mock.calls[0][0] as Uint32Array;
    expect(Array.from(pixels)).toEqual(new Array(effect.leds).fill(0));

    // SIGINT handler wired
    expect(onSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    expect(capturedHandler).toBeDefined();

    // When handler runs, ws281x.reset and process.exit(0) are called
    capturedHandler?.();

    expect(resetMock).toHaveBeenCalledTimes(1);
    expect(exitSpy).toHaveBeenCalledWith(0);

    onSpy.mockRestore();
    nextTickSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
