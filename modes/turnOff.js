import ws281x from 'rpi-ws281x';

export class TurnOff {
    constructor(config) {
      this.config = config;

      ws281x.configure(this.config);
    };

    run() {
      ws281x.reset();
      process.exit(0);
    };
  };
