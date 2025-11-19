# 🌈 Raspberry Pi NeoPixel Effects Engine

![Node Version](https://img.shields.io/badge/node-24.x-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![Jest](https://img.shields.io/badge/tests-jest%20%2B%20ts--jest-red)
![License: ISC](https://img.shields.io/badge/license-ISC-lightgrey)
![Platform](https://img.shields.io/badge/platform-Raspberry%20Pi-orange)
![WS281x](https://img.shields.io/badge/LED-WS281x%20%2F%20Neopixel-purple)

LED animations powered by **TypeScript**, **rpi-ws281x**, and an
interactive **CLI menu**.

This engine controls WS281x LED strips (NeoPixels) on a **Raspberry Pi**
with a menu of effects (solid, blink, breathe, wheel, creep, walk pixel,
random modes, etc.), all running directly on the Pi's GPIO via
`/dev/mem`.

------------------------------------------------------------------------

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
- Strong TypeScript typing
- Jest testing support
- **Tests live next to the files they test**
  *(except only the root-level `index.ts` has a test; other index.ts
  files are not tested)*
- Graceful shutdown on:
  - `SIGINT`
  - `SIGTERM`
  - `uncaughtException`
  - `unhandledRejection`

------------------------------------------------------------------------

## 🧱 Requirements

### Hardware

- Raspberry Pi (tested on Pi 3B+)
- WS281x / NeoPixel LED strip
- External 5V LED power supply recommended (with **common ground**)

### Software

- Raspberry Pi OS (Bookworm recommended)
- **nvm-installed Node.js (LTS v24.x)**

``` bash
nvm install 24
nvm use 24
node -v  # v24.x.x
```

- Python ≥ 3.x
- Build tools:

``` bash
sudo apt install build-essential python3
```

------------------------------------------------------------------------

## 📦 Installation

Clone the repo:

``` bash
git clone https://github.com/willblake01/raspberry-pi-neopixels
cd raspberry-pi-neopixels
```

Install using **nvm Node**:

``` bash
nvm use
npm install
```

Verify Node:

``` bash
node -v
which node
```

Expected:

------------------------------------------------------------------------

## ▶️ Running the LED Engine

WS281x hardware requires **root access**, but **npm must not run as
root**.

Your `package.json` should include:

``` jsonc
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "start:root": "sudo /home/pi/.nvm/versions/node/v24.11.1/bin/node dist/index.js"
}
```

Run:

``` bash
npm run build
npm run start:root
```

This ensures:

- nvm's Node is used
- system Node is NOT used
- only the LED runtime runs with sudo

------------------------------------------------------------------------

## 🧪 Running Tests

Tests use **Jest + ts-jest**.

### Test Layout

- Tests live **next to the files they test**
- **Only root `index.ts` has a test file**

Examples:

``` bash
npm test
```

------------------------------------------------------------------------

## 📁 Project Structure

``` text
src/
  @types/
  constants/
  effects/
    /utils
    Solid.ts
    Solid.test.ts
    Blink.ts
    Blink.test.ts
    ...
  prompts/
    normalizeAnswers.ts
    normalizeAnswers.test.ts
    prompts.ts
    prompts.test.ts
  types/
  utils/
  EffectManager.ts
  EffectManager.test.ts
  ledRuntime.ts
  ledRuntime.test.ts
  index.ts
  index.test.ts

dist/   (build output)
```

------------------------------------------------------------------------

## 🛠 Building

Compile:

``` bash
npm run build
```

Output goes to `/dist`.

------------------------------------------------------------------------

## 🧹 Shutdown Behavior

The runtime includes a safe exit handler:

- Stops active effect
- Clears LEDs
- Resets WS281x hardware
- Handles all common shutdown signals

------------------------------------------------------------------------

## ⚠️ Troubleshooting

### "Cannot open /dev/mem"

Use:

``` bash
npm run start:root
```

### Native module mismatch

``` bash
npm rebuild rpi-ws281x
```

### Wrong Node?

``` bash
which node
sudo which node
```

Make sure the script points to the nvm Node.

------------------------------------------------------------------------

## 📜 License

ISC
