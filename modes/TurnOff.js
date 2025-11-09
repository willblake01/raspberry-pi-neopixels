import { safeRender } from "../ledRuntime.js";

export class TurnOff {
    constructor(config) {
      this.config = config;
    };

    run() {
      const pixels = new Uint32Array(this.config.leds);

      ws281x.render(pixels);

      process.on('SIGINT', () => {
        safeRender(pixels);

        process.nextTick(() => {
          process.exit(0);
        });
      });
    };
  };
