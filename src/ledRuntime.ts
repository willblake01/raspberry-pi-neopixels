import { loadWs281x } from './hardware/ws281x.js';
import type { Config } from './types/index.js';
import { GAMMA } from "./constants/index.js";

type Ws281x = Awaited<ReturnType<typeof loadWs281x>>;
type Pixels = Uint32Array;

let ws281x: Ws281x | null = null;
let currentConfig: Config | null = null;

export const runtime = { alive: false };

const tick = () => new Promise<void>(r => setImmediate(r));

const toDriverConfig = ({ gamma, ...rest }: Config): Config => {
  if (gamma == null) return rest;   // key omitted = no correction
  if (!Number.isFinite(gamma)) throw new Error(`Invalid gamma: ${gamma}`);

  return { ...rest, gamma: Math.min(GAMMA.MAX, Math.max(GAMMA.MIN, gamma)) };
};

export const init = async (config: Config) => {
  if (!ws281x) {
    ws281x = await loadWs281x();
  }

  const driverConfig = toDriverConfig(config);
  ws281x.configure(driverConfig);
  currentConfig = driverConfig;
  runtime.alive = true;
};

export const setGamma = async (gamma: Config['gamma']) => {
  if (!currentConfig) return;
  const next = toDriverConfig({ ...currentConfig, gamma });
  await dispose();
  await init(next);
};

export const getGamma = () => currentConfig?.gamma;

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
