import ws281x from 'rpi-ws281x';

export class TurnOff {
    constructor(config) {
      this.config = config;

      ws281x.configure(this.config);
    };

    run() {
      process.on('SIGINT', () => {
        ws281x.reset();
        ws281x.finalize();

        process.nextTick(() => {
          process.exit(0);
        });
      });
    };
  };
