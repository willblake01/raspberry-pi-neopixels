import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { normalizeAnswers, promptsConfig } from './prompts/index.js';
import { TurnOff } from './effects/index.js';
import { RULES } from './effects/utils/index.js';
import { once } from './utils/index.js';
import { Config, Options } from './types/index.js';

interface DelayProps {
  (ms: number): Promise<void>;
}

const delay: DelayProps = (ms) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const selectEffect = (config: Config, options: Options) => {
  if (options.isOff) return new TurnOff(config);
  const rule = RULES.find((r) => r.when(options));
  return rule ? rule.make(config, options) : new TurnOff(config);
};

const main = async () => {
  const answers = await prompts(promptsConfig);
  const options: Options = normalizeAnswers(answers);

  const config: Config = {
    leds: options.leds,
    dma: 10,
    brightness: options.brightness,
    gpio: 18,
    stripType: 'rgb',
  };

  const manager = new EffectManager(config);

  const shutDown = once(
    async (reason: string, err?: Error | unknown): Promise<void> => {
      try {
        await manager.dispose();
      } finally {
        if (err) {
          console.error(`[shutdown ${reason}]`, err);
          process.exitCode = 1;
        }
        setTimeout(() => process.exit(), 10);
      }
    },
  );

  process.once('SIGINT', () => shutDown('SIGINT'));
  process.once('SIGTERM', () => shutDown('SIGTERM'));
  process.once('uncaughtException', (err: Error) =>
    shutDown('uncaughtException', err),
  );
  process.once('unhandledRejection', (err: Error) =>
    shutDown('unhandledRejection', err),
  );

  const effect = selectEffect(manager.config, options);
  await manager.start(effect);

  await delay(1000);
};

void main().catch((err) => {
  console.error('[fatal]', err);
  process.exitCode = 1;
});
