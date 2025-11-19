import ws281x from '../hardware/ws281x.js';
import { safeRender } from '../ledRuntime.js';
import { Config } from '../types/index.js';

export class TurnOff {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  };

  run() {
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
