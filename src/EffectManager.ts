import { init, dispose } from './ledRuntime.js';
import { Config } from './types/index.js'

interface Effect {
  run(): void | Promise<void>;
  stop?(): void | Promise<void>;
};

const tick = () => new Promise<void>(resolve => setImmediate(resolve));

export class EffectManager {
  config: Config;
  _current: Effect | null;
  _disposed: boolean;

  constructor(config: Config) {
    this.config = config;
    this._current = null;
    this._disposed = false;

    init(config);
  };

  async start(effect: Effect): Promise<void> {
    if (this._disposed) throw new Error('EffectManager already disposed');
    await this.stop();
    this._current = effect;
    effect.run();
  };

  async stop() {
    const eff = this._current;
    if (!eff) return;
    try { eff.stop?.(); } finally {
      this._current = null;
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
