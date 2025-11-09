import ws281x from 'rpi-ws281x';

export const runtime = { alive: false };

const tick = () => new Promise(r => setImmediate(r));

export const init = (config) => {
  ws281x.configure(config);
  runtime.alive = true;
};

export const safeRender = (pixels) => {
  if (!runtime.alive) return;
  ws281x.render(pixels);
};

export const dispose = async () => {
  runtime.alive = false;

  await tick();
  await tick();

  ws281x.reset();
};
