export interface Ws281xInterface {
  configure(config: any): void;
  render(pixels: Uint32Array): void;
  reset(): void;
}

let ws281x: Ws281xInterface;

const isPi =
  process.platform === "linux" &&
  (process.arch === "arm" || process.arch === "arm64");

try {
  if (isPi) {
    // On Pi, load the real module
    // @ts-ignore - require is available at runtime
    const real = require("rpi-ws281x");
    ws281x = (real.default || real) as Ws281xInterface;
  } else {
    // On non-Pi (macOS/Windows), try to load it so Jest can mock it,
    // but fall back to no-op if it isn't installed.
    // @ts-ignore
    const real = require("rpi-ws281x");
    ws281x = (real.default || real) as Ws281xInterface;
  }
} catch {
  // If require fails (e.g., mac without the module installed),
  // fall back to a no-op implementation.
  ws281x = {
    configure: () => {},
    render: () => {},
    reset: () => {},
  };
}

export default ws281x;
