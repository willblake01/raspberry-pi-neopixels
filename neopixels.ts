import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { normalizeAnswers, promptsConfig } from './prompts/index.ts';
import { TurnOff } from './effects/index.ts';
import { RULES } from './effects/utils/index.ts';
import { once } from './utils/index.ts';
import { Config, Options } from './types/index.ts';

interface DelayProps {
  (ms: number): void;
};

interface SelectEffectProps {
  (config: Config, opts: Options): void;
};

interface ShutDownProps {
  (reason: string, error?: Error | unknown): void;
};

const delay: DelayProps = (ms) => new Promise(r => setTimeout(r, ms));

const selectEffect: SelectEffectProps = (config, opts) => {
  if (opts.isOff) return new TurnOff(config);
  const rule = RULES.find(r => r.when(opts));
  return rule ? rule.make(config, opts) : new TurnOff(config);
};

const neopixels = async () => {
  const response = prompts(promptsConfig);
  const options: Options = normalizeAnswers(response);

  const config = {
    leds:options.leds,
    dma: 10,
    brightness: options.brightness,
    gpio: 18,
    stripType: 'rgb'
  };

  const manager = new EffectManager(config);

  const shutDown: ShutDownProps = once(async (reason: string, err: Error) => {
    try { 
      await manager.dispose();
    } finally {
      if (err) { 
        console.error(`[shutdown ${reason}]`, err);
        process.exitCode = 1;
      }
      setTimeout(() => process.exit(), 10);
    }
  });

  process.once('SIGINT', () => shutDown('SIGINT'));
  process.once('SIGTERM', () => shutDown('SIGTERM'));
  process.once('uncaughtException', (err) => shutDown('uncaughtException', err));
  process.once('unhandledRejection', (err) => shutDown('uncaughtException', err));

  delay(1000);

  const effect = selectEffect(manager.config, options);
  await manager.start(effect);
};

neopixels().catch(err => {
  console.error('[fatal]', err);
  process.exitCode = 1;
});
