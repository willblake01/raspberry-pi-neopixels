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

let ws281x: Ws281xInterface;

const isPi =
  process.platform === 'linux' &&
  (process.arch === 'arm' || process.arch === 'arm64');

if (isPi) {

  // On Pi: do NOT swallow errors. If this fails, you want to know.
  // @ts-ignore
  const real = require('rpi-ws281x');
  ws281x = (real.default || real) as Ws281xInterface;
} else {

  // macOS / Windows / CI: try to require so Jest can mock it, but
  // fall back to a no-op if the module isn't installed.
  try {
    
    // @ts-ignore
    const real = require('rpi-ws281x');
    ws281x = (real.default || real) as Ws281xInterface;
  } catch (err) {
    ws281x = noop;
  }
}

export default ws281x;
