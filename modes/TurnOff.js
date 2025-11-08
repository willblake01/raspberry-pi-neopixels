import ws281x from 'rpi-ws281x';

export class TurnOff {
    constructor(leds) {
      this.leds = leds;
    };

    run() {
      const pixels = new Uint32Array(this.leds);

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
