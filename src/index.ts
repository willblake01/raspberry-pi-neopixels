import prompts from 'prompts';
import { EffectManager } from './EffectManager.js';
import { normalizeAnswers, promptsConfig } from './prompts/index.js';
import { TurnOff } from './effects/index.js';
import { CameraMotion, randomNumber } from './utils/index.js';
import { SolidCustom } from './effects/index.js';
import { RULES } from './effects/utils/index.js';
import { once } from './utils/index.js';
import { Config, Options } from './types/index.js';

interface DelayProps {
  (ms: number): Promise<void>;
}

const delayInMs = 1000;

const delay: DelayProps = (ms) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const selectEffect = (config: Config, options: Options) => {
  if (options.isOff) return new TurnOff(config);
  const rule = RULES.find((r) => r.when(options));
  return rule ? rule.make(config, options) : new TurnOff(config);
};

export const main = async () => {
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

  const makeIdleEffect = () => selectEffect(manager.config, options);

  const makeMotionEffect = () => {
    const brightness = options.motionBrightness;

    const [red, green, blue] = options.motionColorMode === 'custom' ? [options.motionRed, options.motionGreen, options.motionBlue] : [randomNumber(255), randomNumber(255), randomNumber(255)];

    return new SolidCustom({
      ...manager.config, brightness
    }, red, green, blue)
  };

  // Delay before effect starts
  await delay(delayInMs);

  await manager.start(makeIdleEffect());

  // -------------------------------
  // Motion color override
  // -------------------------------
  if (options.isMotionColorEnabled) {
    const motion = new CameraMotion({
      intervalMs: 200,
      diffThreshold: 15000,
      cooldownMs: 800,
    });

    const NO_MOTION_MS = 2500; // quiet time before reverting
    const CHECK_MS = 200;

    let motionActive = false;
    let lastMotionAt = 0;
    let switching = false;

    motion.on('motionDetected', async () => {
      lastMotionAt = Date.now();
      
      const formattedDateTime = new Date(lastMotionAt).toLocaleString();
      console.log(`🚨 Motion detected: ${formattedDateTime}`);

      if (motionActive) return;
      motionActive = true;

      if (switching) return;
      switching = true;

      try {
        await manager.start(makeMotionEffect());
      } finally {
        switching = false;
      };
    });

    // Stable revert (prevents blinking/flapping)
    setInterval(async () => {
      if (!motionActive) return;
      if (Date.now() - lastMotionAt < NO_MOTION_MS) return;
      motionActive = false;

      if (switching) return;
      switching = true;

      try {
        await manager.start(makeIdleEffect());
      } finally {
        switching = false;
      };
    }, CHECK_MS);

    motion.on('error', (err) => {
      console.error('Camera motion error:', err);
    });

    console.log('\n👀 Camera watching for motion...\n');
    motion.start();
  };
};

// Only auto-run when NOT under Jest
if (!process.env.JEST_WORKER_ID) {
  void main().catch((err) => {
    console.error('[fatal]', err);
    process.exitCode = 1;
  });
};
