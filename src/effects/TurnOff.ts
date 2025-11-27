import { loadWs281x } from '../hardware/ws281x.js';
import { safeRender } from '../ledRuntime.js';
import type { Options } from '../types/index.js';

export class TurnOff {
  leds: Options['leds'];

  constructor(leds: Options['leds']) {
    this.leds = leds;
  };

  async run() {
    const ws281x = await loadWs281x();

    const pixels: Uint32Array = new Uint32Array(this.leds);

    safeRender(pixels);

    process.on('SIGINT', () => {
      ws281x.reset();

      process.nextTick(() => {
        process.exit(0);
      });
    });
  };
};
