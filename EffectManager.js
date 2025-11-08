import ws281x from 'rpi-ws281x';

export class EffectManager {
  constructor(config) {
    this.config = config;
    this.current = null;

    ws281x.configure(config);
  }

  start(effect) {
    this.stop();
    this.current = effect;
    effect.run();
  }

  stop() {
    if (this.current?.stop) {
      try { this.current.stop(); } catch {}
      this.current = null;
    }
  }

  dispose() {
    this.stop();
    
    try { 
      ws281x.reset();
      ws281x.finalize();
    } catch {}
  }
}
