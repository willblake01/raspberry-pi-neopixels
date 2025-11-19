import { loadWs281x } from './hardware/ws281x.js';
import type { Config, Pixels } from './types/index.js';

type Ws281x = Awaited<ReturnType<typeof loadWs281x>>;

let ws281x: Ws281x | null = null;

export const runtime = { alive: false };

const tick = () => new Promise<void>(r => setImmediate(r));

export const init = async (config: Config) => {
  if (!ws281x) {
    ws281x = await loadWs281x();
  }
  ws281x.configure(config);
  runtime.alive = true;
};

export const safeRender = (pixels: Pixels) => {
  if (!runtime.alive || !ws281x) return;
  ws281x.render(pixels);
};

export const dispose = async () => {
  if (!ws281x) {
    runtime.alive = false;
    return;
  }

  runtime.alive = false;

  await tick();
  await tick();

  ws281x.reset();
};
