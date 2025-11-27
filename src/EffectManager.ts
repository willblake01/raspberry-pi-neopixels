import { init as runtimeInit, dispose } from './ledRuntime.js';
import { Config, Effect } from './types/index.js'

const tick = () => new Promise<void>(resolve => setImmediate(resolve));

export class EffectManager {
  public config: Config;
  public current: Effect | null;
  private _disposed: boolean;
  private _runtimeReady: Promise<void>;

  constructor(config: Config) {
    this.config = config;
    this.current = null;
    this._disposed = false;

    // start async init immediately, but don't block constructor
    this._runtimeReady = runtimeInit(config);
  };

  async start(effect: Effect): Promise<void> {
    if (this._disposed) throw new Error('EffectManager already disposed');

    await this._runtimeReady;
    await this.stop();

    this.current = effect;

    await effect.run();
  };

  async stop() {
    const eff = this.current;

    if (!eff) return;

    try {
      await eff.stop?.();
    } finally {
      this.current = null;

      await tick();
    }; 
  };

  async dispose() {
    if (this._disposed) return;

    this._disposed = true;

    await this._runtimeReady;

    await this.stop();
    await dispose();
  };
};
