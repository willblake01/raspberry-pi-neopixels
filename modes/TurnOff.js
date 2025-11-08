import ws281x from 'rpi-ws281x';

export class TurnOff {
    constructor(config) {
      this.config = config;
    };

    run() {
      const pixels = new Uint32Array(this.config.leds);

      ws281x.render(pixels);

      process.on('SIGINT', () => {
        ws281x.reset();
        ws281x.finalize();

        process.nextTick(() => {
          process.exit(0);
        });
      });
    };
  };
