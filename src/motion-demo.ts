import { EffectManager } from "./EffectManager.js";
import { CameraMotion } from "./utils/CameraMotion.js";
import { SolidCustom } from "./effects/Solid.js";
import type { Config } from "./types/index.js";

const config: Config = {
  leds: 100,
  dma: 10,
  brightness: 128,
  gpio: 18,
  stripType: "rgb",
};

const manager = new EffectManager(config);

// ---- Choose your "original/idle" effect ----
const makeIdleEffect = () => new SolidCustom(manager.config, 0, 0, 255); // idle blue

// ---- Choose your "motion" effect ----
const makeMotionEffect = () => new SolidCustom(manager.config, 255, 255, 255); // flash white

// Start idle effect initially
await manager.start(makeIdleEffect());

// Motion detector
const motion = new CameraMotion({
  intervalMs: 200,
  diffThreshold: 15000,
  cooldownMs: 800,
});

let revertTimer: NodeJS.Timeout | null = null;
let motionActive = false;

// How long after last motion before reverting:
const NO_MOTION_MS = 2000;

motion.on("motionDetected", async () => {
  // If this is the first motion in a while, switch to motion effect
  if (!motionActive) {
    motionActive = true;
    await manager.start(makeMotionEffect());
  }

  // Reset the revert timer every time motion is detected
  if (revertTimer) clearTimeout(revertTimer);

  revertTimer = setTimeout(async () => {
    motionActive = false;
    await manager.start(makeIdleEffect());
  }, NO_MOTION_MS);
});

motion.on("error", (err) => {
  console.error("Camera motion error:", err);
});

console.log("👀 Camera motion watcher running. Move in front of the camera...");
motion.start();
