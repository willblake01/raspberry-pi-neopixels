import { EventEmitter } from "events";
import { still } from "node-libcamera";
import sharp from "sharp";

export interface MotionOptions {
  intervalMs?: number;
  diffThreshold?: number;
  cooldownMs?: number; // min time between motion events
}

export class CameraMotion extends EventEmitter {
  private lastFrame: Buffer | null = null;
  private isRunning = false;
  private timer: NodeJS.Timeout | null = null;
  private lastMotionAt = 0;

  private readonly intervalMs: number;
  private readonly diffThreshold: number;
  private readonly cooldownMs: number;

  constructor(opts: MotionOptions = {}) {
    super();
    this.intervalMs = opts.intervalMs ?? 200;
    this.diffThreshold = opts.diffThreshold ?? 15000;
    this.cooldownMs = opts.cooldownMs ?? 800; // adjust if you want faster/slower changes
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.timer = setInterval(async () => {
      try {
        const img = await still({
          width: 320,
          height: 240,
          nopreview: true,
        });

        const frame = await sharp(img)
          .grayscale()
          .resize(64, 48)
          .raw()
          .toBuffer();

        if (this.lastFrame) {
          let diff = 0;
          for (let i = 0; i < frame.length; i++) {
            diff += Math.abs(frame[i] - this.lastFrame[i]);
          }

          const now = Date.now();
          if (diff > this.diffThreshold && now - this.lastMotionAt > this.cooldownMs) {
            this.lastMotionAt = now;
            this.emit("motionDetected", { diff });
          }

          // optional debug hook:
          // this.emit("frameDiff", diff);
        }

        this.lastFrame = frame;
      } catch (err) {
        this.emit("error", err);
      }
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.isRunning = false;
  }
}
