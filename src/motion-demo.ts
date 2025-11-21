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

// how long after last motion before reverting
const NO_MOTION_MS = 2500;   // bump this a bit to stop flapping
const CHECK_MS = 200;        // how often we check if it's quiet

let motionActive = false;
let lastMotionAt = 0;
let switching = false;       // prevents overlapping start() calls

motion.on("motionDetected", async () => {
  lastMotionAt = Date.now();

  if (motionActive) return;  // already in motion mode, don't restart effect
  motionActive = true;

  if (switching) return;
  switching = true;
  try {
    await manager.start(makeMotionEffect());
  } finally {
    switching = false;
  }
});

// Periodically check if motion has stopped long enough
setInterval(async () => {
  if (!motionActive) return;

  const quietFor = Date.now() - lastMotionAt;
  if (quietFor < NO_MOTION_MS) return;

  motionActive = false;

  if (switching) return;
  switching = true;
  try {
    await manager.start(makeIdleEffect());
  } finally {
    switching = false;
  }
}, CHECK_MS);

motion.on("error", (err) => {
  console.error("Camera motion error:", err);
});

console.log("👀 Camera motion watcher running. Move in front of the camera...");
motion.start();
