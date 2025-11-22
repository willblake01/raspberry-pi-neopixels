# 🌈 Raspberry Pi NeoPixel Effects Engine

![Node Version](https://img.shields.io/badge/node-24.x-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![Jest](https://img.shields.io/badge/tests-jest%20%2B%20ts--jest-red)
![License: ISC](https://img.shields.io/badge/license-ISC-lightgrey)
![Platform](https://img.shields.io/badge/platform-Raspberry%20Pi-orange)
![WS281x](https://img.shields.io/badge/LED-WS281x%20%2F%20Neopixel-purple)

LED animations powered by **TypeScript**, **rpi-ws281x**, an interactive **CLI menu**,  
and **optional motion‑triggered color overrides using the Raspberry Pi Camera**.

This engine controls WS281x LED strips (NeoPixels) on a **Raspberry Pi**
with a menu of effects (solid, blink, breathe, wheel, creep, walk pixel,
random modes, etc.), all running directly on the Pi’s GPIO via `/dev/mem`.

---

## 🚀 Features

- Interactive CLI built with **prompts**
- Multiple LED effects:
  - Solid (custom or random)
  - Blink (static or random-changing)
  - Breathe
  - Change
  - Creep
  - Wheel
  - Walk Pixel (ON/OFF modes)
- Random color modes:
  - Static random colors
  - Per-pixel random
  - Per-frame random
- Motion Color Override when enabled:
  - User selects **Custom** or **Random** motion color
  - If **Custom**, user enters RGB + brightness
  - When motion is detected, the LEDs **temporarily switch** to the motion color
  - When motion stops, LEDs **return automatically to the chosen effect**
- Strong TypeScript typing throughout
- Jest testing support
- Tests live next to the files they test
- Graceful shutdown on:
  - `SIGINT`
  - `SIGTERM`
  - `uncaughtException`
  - `unhandledRejection`

---

## 🧱 Requirements

### Hardware

- Raspberry Pi (tested on Pi 3B+)
- WS281x / NeoPixel LED strip
- External 5V LED power supply (**common ground required**)
- (Optional) Raspberry Pi Camera for motion‑triggered color

### Software

- Raspberry Pi OS (Bookworm)
- **nvm-installed Node.js v24.x**

```bash
nvm install 24
nvm use 24
node -v
```

- Python ≥ 3.x  
- Build tools:

```bash
sudo apt install build-essential python3
```

### Optional

A `.nvmrc` file makes Node selection automatic:

```text
v24
```

---

## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/willblake01/raspberry-pi-neopixels
cd raspberry-pi-neopixels
```

Install using nvm Node:

```bash
nvm use
npm install
```

---

## ▶️ Running the LED Engine

WS281x hardware requires **root access**, but **npm must NOT run as root**.

Your `package.json` scripts (updated):

```jsonc
"scripts": {
  "build": "tsc -p tsconfig.build.json",
  "dev": "node --loader ts-node/esm src/index.ts",
  "start": "node dist/index.js",
  "start:root": "sudo env \"PATH=$PATH\" node dist/index.js",
  "test": "jest"
}
```

Run:

```bash
npm run build
npm run start:root
```

---

## 🧪 Running Tests

Run Jest:

```bash
npm test
```

Hardware is fully mocked.

---

## 🎥 Motion Color Override

When enabled through the CLI:

1. User chooses **Enable Motion Color → Yes**
2. Choose **Custom** or **Random**
3. For **Custom**, user enters:
   - Motion Red (0–255)
   - Motion Green (0–255)
   - Motion Blue (0–255)
4. User enters **Motion Brightness (0–255)**

### Behavior

- System runs the **selected LED effect normally**
- When the camera detects motion:
  - LEDs switch to the **motion color**
- When the scene is stable again:
  - LEDs **return to the original effect automatically**

Motion detection uses:

- the Raspberry Pi Camera Module
- fast grayscale downsampling
- frame‑difference analysis

This keeps it CPU‑light and extremely responsive.

---

## 📁 Project Structure

```text
src/
  @types/
  constants/
  effects/
  prompts/
  types/
  utils/
  EffectManager.ts
  ledRuntime.ts
  index.ts
dist/
```

---

## 🛠 Building

```bash
npm run build
```

---

## 🧹 Shutdown Behavior

The runtime safely handles all exit cases:

- Active effect stopped  
- LEDs cleared  
- WS281x strip reset  
- All listeners removed  

---

## ⚠️ Troubleshooting

### “Cannot open /dev/mem”

Run using:

```bash
npm run start:root
```

### Native module mismatch

```bash
npm rebuild rpi-ws281x
```

### Wrong Node?

```bash
which node
sudo env "PATH=$PATH" which node
```

Both should point to nvm Node.

---

## 📜 License

ISC
