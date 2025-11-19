import ws281x from "../hardware/ws281x.js";
import { TurnOff } from './index.js';
import type { Config } from '../types/index.js';

jest.mock('../ledRuntime.js', () => ({
  safeRender: jest.fn(),
}));

jest.mock('rpi-ws281x', () => ({
  reset: jest.fn(),
}));

import { safeRender } from '../ledRuntime.js';

const safeRenderMock = safeRender as jest.MockedFunction<typeof safeRender>;

const createConfig = (overrides: Partial<Config> = {}): Config => ({
  leds: 5,
  dma: 10,
  brightness: 50,
  gpio: 18,
  stripType: 'rgb',
  ...overrides,
});

beforeEach(() => {
  safeRenderMock.mockClear();
});

describe('TurnOff effect', () => {
  test('run clears all pixels and wires a SIGINT handler that resets the strip', () => {
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

    const effect = new TurnOff(createConfig());
    effect.run();

    expect(safeRenderMock).toHaveBeenCalledTimes(1);
    const pixels = safeRenderMock.mock.calls[0][0] as Uint32Array;
    expect(Array.from(pixels)).toEqual(new Array(effect.config.leds).fill(0));

    expect(onSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    expect(capturedHandler).toBeDefined();

    const resetMock = ws281x.reset as jest.MockedFunction<typeof ws281x.reset>;

    resetMock.mockClear();

    capturedHandler?.();

    expect(resetMock).toHaveBeenCalledTimes(1);
    expect(exitSpy).toHaveBeenCalledWith(0);

    onSpy.mockRestore();
    nextTickSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
