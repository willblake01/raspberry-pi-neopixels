import ws281x from 'rpi-ws281x';

export class TurnOff {
    constructor(config) {
      this.config = config;
    };

    run() {
      process.on('SIGINT', () => {
        ws281x.reset();

        process.nextTick(() => {
          process.exit(0);
        });
      });
    };
  };
