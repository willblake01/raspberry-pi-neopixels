import type { Ws281xConfig, Ws281xController } from 'rpi-ws281x';

export type { Ws281xConfig };
export type Ws281xInterface = Ws281xController;

const noop: Ws281xInterface = {
  configure: () => {},
  render: () => {},
  reset: () => {},
};

const isPi =
    process.platform === 'linux' &&
    (process.arch === 'arm' || process.arch === 'arm64');

/** Signals rpi-ws281x installs its own handlers for when it loads. */
const SIGNALS = ['SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'] as const;

/**
 * Import rpi-ws281x without the signal handlers it installs on load.
 *
 * rpi-ws281x installs SIGINT/SIGTERM handlers on import that reset the
 * driver and call process.exit(). That conflicts with our own shutdown
 * (double cleanup → "free(): invalid pointer"), so we remove them here
 * and let the application own shutdown.
 *
 * Covered by ws281x.test.ts. Recheck this if rpi-ws281x is upgraded.
 */
const importWithoutSignalHandlers = async (): Promise<Ws281xInterface> => {
  const before = new Map(SIGNALS.map((signal) => [signal, new Set(process.listeners(signal))]));

  const real = await import('rpi-ws281x');

  for (const signal of SIGNALS) {
    const existing = before.get(signal)!;
    for (const listener of process.listeners(signal)) {
      if (!existing.has(listener)) process.off(signal, listener);
    }
  }

  return (real.default || real) as Ws281xInterface;
};

/**
 * Load the ws281x driver:
 *  - On Pi: real rpi-ws281x (or throw if missing)
 *  - On macOS/Windows: try to import; if missing, return no-op
 *  - In Jest: jest.mock('rpi-ws281x') will intercept this import
 */
export async function loadWs281x(): Promise<Ws281xInterface> {
  if (isPi) {
    // On Pi, fail loudly if the module isn't available
    return importWithoutSignalHandlers();
  }

  // Non-Pi (dev / macOS / tests)
  try {
    return await importWithoutSignalHandlers();
  } catch {
    // No native module here? Just no-op.
    return noop;
  }
}