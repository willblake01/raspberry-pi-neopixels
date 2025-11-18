# 🌈 Raspberry Pi NeoPixel Effects Engine

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
  - Static random colors\
  - Per-pixel random\
  - Per-frame random\
- Strong TypeScript typing
- Jest testing support
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

- **nvm-installed Node.js (LTS v24.x)**\
  Works reliably with `rpi-ws281x`:

  ``` bash
  nvm install 24
  nvm use 24
  node -v  # v24.x.x
  ```

- Python ≥ 3.x (native module build)

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

Ensure you are using the correct Node:

``` bash
node -v
which node
Expected path:

------------------------------------------------------------------------

## ▶️ Running the LED Engine

WS281x hardware requires **root access**, but **npm itself must NOT run
as root**.

Your `package.json` should include:

``` jsonc
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "start:root": "sudo /home/pi/.nvm/versions/node/v24.11.1/bin/node dist/index.js"
}
```

Run the engine:

``` bash
npm run build
npm run start:root
```

This:

- Uses **nvm's Node**, even with sudo\
- Avoids permission issues\
- Avoids system Node entirely

The CLI will launch with:

- LED count / brightness\
- Effect selection\
- Random color modes

------------------------------------------------------------------------

## 🧪 Running Tests

Tests use Jest + ts-jest:

``` bash
npm test
```

Test files are colocated next to modules, for example:

------------------------------------------------------------------------

## 📁 Project Structure

``` text
src/
  effects/
  prompts/
  types/
  utils/
  ledRuntime.ts
  index.ts

tests/
dist/   (build output)
```

------------------------------------------------------------------------

## 🛠 Building

Compile TypeScript:

``` bash
npm run build
```

Output goes to `/dist`.

------------------------------------------------------------------------

## 🧹 Shutdown Behavior

The runtime includes a unified cleanup handler:

- Stops active effect
- Zeroes LEDs
- Resets WS281x hardware
- Ensures a clean exit on all signal types

------------------------------------------------------------------------

## ⚠️ Troubleshooting

### "Cannot open /dev/mem"

Use the correct script:

``` bash
npm run start:root
```

### Native module mismatch

Rebuild after switching node versions:

``` bash
npm rebuild rpi-ws281x
```

### Accidentally used system node?

Check:

``` bash
which node
sudo which node
```

Use the fixed script (`start:root`) to ensure the correct Node binary.

------------------------------------------------------------------------

## 📜 License

ISC
