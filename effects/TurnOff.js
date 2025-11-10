import ws281x from 'rpi-ws281x';
import { safeRender } from '../ledRuntime.js';

export class TurnOff {
    constructor(config) {
      this.config = config;
    };

    run() {
      const pixels = new Uint32Array(this.config.leds);
      safeRender(pixels);

      process.on('SIGINT', () => {
        ws281x.reset();

        process.nextTick(() => {
          process.exit(0);
        });
      });
    };
  };
