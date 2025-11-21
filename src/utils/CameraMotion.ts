import { EventEmitter } from "events";
import { execFile } from "child_process";
import { promisify } from "util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

async function captureFrame(width: number, height: number): Promise<Buffer> {
  const { stdout, stderr } = await execFileAsync(
    "rpicam-still",
    [
      "--width", String(width),
      "--height", String(height),
      "--nopreview",
      "--timeout", "1",      // don’t wait before capture
      "--encoding", "jpg",
      "-o", "-",             // write JPEG to stdout
    ],
    {
      encoding: "buffer",
      maxBuffer: 10 * 1024 * 1024, // 10MB safety limit
    }
  );

  // rpicam-still often logs to stderr even on success; only fail if no stdout
  if ((!stdout || stdout.length === 0) && stderr?.length) {
    throw new Error(stderr.toString());
  }

  return stdout as Buffer;
}

export class CameraMotion extends EventEmitter {
  private lastFrame: Buffer | null = null;
  private isRunning = false;
  private timer: NodeJS.Timeout | null = null;
  private lastMotionAt = 0;
  intervalMs?: number; 
  diffThreshold?: number; 
  cooldownMs?: number;

  constructor(opts: {
    intervalMs?: number; 
    diffThreshold?: number; 
    cooldownMs?: number;
  } = {}) {
    super();

    this.intervalMs = opts.intervalMs ?? 200;
    this.diffThreshold = opts.diffThreshold ?? 15000;
    this.cooldownMs = opts.cooldownMs ?? 800;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.timer = setInterval(async () => {
      try {
        const img = await captureFrame(320, 240);

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
          if (diff > (this.diffThreshold ?? 15000) && now - this.lastMotionAt > (this.cooldownMs ?? 800)) {
            this.lastMotionAt = now;
            this.emit("motionDetected", { diff });
          }
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
