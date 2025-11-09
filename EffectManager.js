import { init, dispose } from './ledRuntime';

const tick = () => new Promise(r => setImmediate(r));

export class EffectManager {
  constructor(config) {
    this.config = config;
    this.current = null;
    this._disposed = false;

    init(config);
  };

  async start(effect) {
    if (this._disposed) throw new Error('EffectManager already disposed');
    await this.stop();
    this.current = effect;
    effect.run();
  };

  async stop() {
    const eff = this.current;
    if (!eff) return;
    try { eff.stop?.(); } finally {
      this.current = null;
      await tick();
    }; 
  };

  async dispose() {
    if (this._disposed) return;
    this._disposed = true;

    await this.stop();
    await dispose();
  };
};
