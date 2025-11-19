import { loadWs281x } from '../hardware/ws281x.js';
import { safeRender } from '../ledRuntime.js';
import type { Config } from '../types/index.js';

export class TurnOff {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  };

  async run() {
    const ws281x = await loadWs281x();

    const pixels: Uint32Array = new Uint32Array(this.config.leds);

    safeRender(pixels);

    process.on('SIGINT', () => {
      ws281x.reset();

      process.nextTick(() => {
        process.exit(0);
      });
    });
  };
};
