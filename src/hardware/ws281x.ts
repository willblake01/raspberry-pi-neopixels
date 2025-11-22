export interface Ws281xInterface {
  configure(config: any): void;
  render(pixels: Uint32Array): void;
  reset(): void;
}

const noop: Ws281xInterface = {
  configure: () => {},
  render: () => {},
  reset: () => {},
};

const isPi =
  process.platform === 'linux' &&
  (process.arch === 'arm' || process.arch === 'arm64');

/**
 * Load the ws281x driver:
 *  - On Pi: real rpi-ws281x (or throw if missing)
 *  - On mac/Windows: try to import; if missing, return no-op
 *  - In Jest: jest.mock('rpi-ws281x') will intercept this import
 */
export async function loadWs281x(): Promise<Ws281xInterface> {
  if (isPi) {
    // On Pi, fail loudly if the module isn't available
    const real = await import('rpi-ws281x');
    return (real.default || real) as Ws281xInterface;
  }

  // Non-Pi (dev / macOS / tests)
  try {
    const real = await import('rpi-ws281x');
    return (real.default || real) as Ws281xInterface;
  } catch {
    // No native module here? Just no-op.
    return noop;
  }
}
