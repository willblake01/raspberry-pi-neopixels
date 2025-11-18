# 🌈 Raspberry Pi NeoPixel Effects Engine

LED animations powered by **TypeScript**, **rpi-ws281x**, and **Prompts**.

This project lets you control WS281x LED strips (NeoPixels) on a **Raspberry Pi** using a beautiful CLI menu of effects (solid, blink, breathe, wheel, creep, walk pixel, random color modes, etc.).

Built for **Node.js**, **TypeScript**, and runs directly on the Pi’s GPIO via `/dev/mem`.

---

## 🚀 Features

- CLI-based LED configuration via **prompts**
- Multiple LED effects:
  - Solid (custom or random)
  - Blink (static or random-changing)
  - Breathe
  - Change
  - Creep
  - Wheel
  - Walk Pixel (ON/OFF modes)
- Random color modes with:
  - Static random colors  
  - Changing random colors per-pixel or per-loop
- Fully typed with TypeScript
- Jest unit testing support
- Graceful shutdown on:
  - `SIGINT`
  - `SIGTERM`
  - `uncaughtException`
  - `unhandledRejection`

---

## 🧱 Requirements

### Hardware

- Raspberry Pi (tested on Pi 3B+)
- WS281x LED strip
- External power supply recommended

### Software

- Debian (Bookworm) or Raspberry Pi OS
- Debian (Bookworm) or Raspberry Pi OS
- **System Node.js** (recommended)
  Works best with:

  ```bash
  node -v
  # e.g., v18.x or v16.20.x
  ```

- Python ≥ 3.x (for building native modules)
- Build tools:

  ```bash
  sudo apt install build-essential python3
  ```

---

## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/willblake01/raspberry-pi-neopixels
cd raspberry-pi-neopixels
```

Install dependencies using **system Node**:

```bash
npm install
```

Make sure the correct Node is being used:

```bash
node -v
sudo node -v
```

Both should show the same version.

---

## ▶️ Running the LED Engine

On Raspberry Pi, hardware access requires root, so run:

```bash
sudo npm run start
```

The CLI will launch:

- Choose command (on/off)
- Choose effect
- Adjust LEDs, brightness, interval
- Choose color modes and random behavior

---

## 🧪 Running Tests

Tests are written in Jest + ts-jest.

Run:

```bash
npm test
```

Tests live alongside source files, e.g.:

```
src/effects/Solid.test.ts
```

---

## 📁 Project Structure

```text
src/
  effects/
    Solid.ts
    Blink.ts
    ...
  prompts/
    prompts.ts
    normalizeAnswers.ts
  utils/
    index.ts
  types/
    index.ts
  ledRuntime.ts
  index.ts
tests/
dist/ (build output)
```

---

## 🛠 Building

Build TypeScript → JavaScript:

```bash
npm run build
```

Output is written to `/dist`.

---

## 🧹 Shutdown Behavior

The project uses a centralized shutdown handler:

- Stops the active effect
- Resets WS281x LED hardware
- Ensures a clean exit

---

## ⚠️ Troubleshooting

### “Cannot open /dev/mem: Permission denied”

You forgot `sudo`:

```bash
sudo npm run start
```

### Native module mismatch

Rebuild after changing Node versions:

```bash
npm rebuild rpi-ws281x
```

### Using NVM?

Avoid using NVM for this project unless necessary.
Root (`sudo`) often bypasses NVM, causing module version mismatches.

Stick with **system Node** on Raspberry Pi.

---

## 📜 License

ISC
