import { EventEmitter } from 'events';
import { execFile } from 'child_process';
import { promisify } from 'util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

const captureFrame = async (width: number, height: number): Promise<Buffer> => {
  const { stdout, stderr } = await execFileAsync(
    'rpicam-still',
    [
      '--width', String(width),
      '--height', String(height),
      '--nopreview',
      '--timeout', '1',      // don’t wait before capture
      '--encoding', 'jpg',
      '-o', '-',             // write JPEG to stdout
    ],
    {
      encoding: 'buffer',
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
  intervalMs?: number;
  diffThreshold?: number;
  cooldownMs?: number;
  private _lastFrame: Buffer | null = null;
  private _isRunning = false;
  private _timer: NodeJS.Timeout | null = null;
  private _lastMotionAt = 0;
  private _capturing = false;

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
    if (this._isRunning) return;
    this._isRunning = true;

    this._timer = setInterval(async () => {
      if (this._capturing) return;
      this._capturing = true;

      try {
        const img = await captureFrame(320, 240);

        const frame = await sharp(img)
          .grayscale()
          .resize(64, 48)
          .raw()
          .toBuffer();

        if (this._lastFrame) {
          let diff = 0;

          for (let i = 0; i < frame.length; i++) {
            diff += Math.abs(frame[i] - this._lastFrame[i]);
          }

          const now = Date.now();

          if (diff > (this.diffThreshold ?? 15000) && now - this._lastMotionAt > (this.cooldownMs ?? 800)) {
            this._lastMotionAt = now;
            this.emit('motionDetected', { diff });
          }
        }

        this._lastFrame = frame;
      } catch (err) {
        this.emit('error', err);
      } finally {
        this._capturing = false;
      };
    }, this.intervalMs);
  };

  stop() {
    if (this._timer) clearInterval(this._timer);
    this._timer = null;
    this._isRunning = false;
  };
};
