import ws281x from 'rpi-ws281x';
import { Config, Pixels } from './types/index.js';

export const runtime = { alive: false };

const tick = () => new Promise<void>(r => setImmediate(r));

export const init = (config: Config) => {
  ws281x.configure(config);
  runtime.alive = true;
};

export const safeRender = (pixels: Pixels) => {
  if (!runtime.alive) return;
  ws281x.render(pixels);
};

export const dispose = async () => {
  runtime.alive = false;

  await tick();
  await tick();

  ws281x.reset();
};
