import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { normalizeAnswers, questions } from './prompts/index.js';
import { TurnOff } from './effects/index.js';
import { RULES } from './effects/utils/index.js';
import { once } from './utils/index.js';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

const selectEffect = (config, opts) => {
  if (opts.isOff) return new TurnOff(config);
  const rule = RULES.find(r => r.when(opts));
  return rule ? rule.make(config, opts) : new TurnOff(config);
};

const main = async () => {
  const response = await prompts(questions);
  const options = normalizeAnswers(response);

  const config = {
    leds:options.leds,
    dma: 10,
    brightness: options.brightness,
    gpio: 18,
    stripType: 'rgb'
  };

  const manager = new EffectManager(config);

  const shutDown = once(async (reason, err) => {
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
  process.once('unhandledRejection', (err) => shutDown('unhandledRejection', err));

  await delay(1000);

  const effect = selectEffect(manager.config, options);
  await manager.start(effect);
};

main().catch(err => {
  console.error('[fatal]', err);
  process.exitCode = 1;
});
