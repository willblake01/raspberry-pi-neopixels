import { EffectManager } from "./EffectManager.js";
import { CameraMotion } from "./utils/CameraMotion.js";
import { SolidCustom } from "./effects/Solid.js";
import type { Config } from "./types/index.js";

const config: Config = {
  leds: 30,
  dma: 10,
  brightness: 128,
  gpio: 18,
  stripType: "rgb",
};

const manager = new EffectManager(config);

// Simple random color helper
const rand255 = () => Math.floor(Math.random() * 256);
const randomColor = (): [number, number, number] => [rand255(), rand255(), rand255()];

const motion = new CameraMotion({
  intervalMs: 200,
  diffThreshold: 15000,
  cooldownMs: 800,
});

motion.on("motionDetected", async ({ diff }) => {
  const color = randomColor();
  console.log(`🔥 motionDetected (diff=${diff}) → color`, color);

  // Start a Solid color effect on motion
  await manager.start(new SolidCustom(manager.config, 255, 255, 255));
});

motion.on("error", (err) => {
  console.error("Camera motion error:", err);
});

console.log("👀 Camera motion watcher running. Move in front of the camera...");
motion.start();
