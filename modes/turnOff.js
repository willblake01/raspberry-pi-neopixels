import ws281x from 'rpi-ws281x';

export class TurnOff {
    constructor(config) {
      this.config = config;

      ws281x.configure(this.config);
    };

    run() {
      const pixels = new Uint32Array(this.config.leds);

      ws281x.render(pixels);

      process.on('SIGINT', () => {
        ws281x.reset();
        process.nextTick(() => {
          process.exit(0);
        });
      });

      ws281x.reset();
      process.exit(0);
    };
  };
