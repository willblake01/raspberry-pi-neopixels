const ws281x = require('rpi-ws281x');
const prompts = require('prompts');
const { createCanvas } = require('canvas');
const { setTimeout } = require('timers/promises');
const { getPixelColor } = require('./utils');
const { getPixelColorFromHex } = require('./utils');
const { getPixelColorFromRGB } = require('./utils');

const questions = [
  {
    type: 'text',
    name: 'command',
    mesage: 'Enter a command (on, off)'
  },
  {
    type: 'text',
    name: 'leds',
    message: 'Enter the number of LEDs (1-50)',
  },
  {
    type: 'text',
    name: 'brightness',
    message: 'Enter the brightness (0-255)',
  },
  {
    type: 'text',
    name: 'red',
    message: 'Enter the red value (0-255)',
  },
  {
    type: 'text',
    name: 'green',
    message: 'Enter the green value (0-255)',
  },
  {
    type: 'text',
    name: 'blue',
    message: 'Enter the blue value (0-255)',
  }
];

(async () => {
  const response = await prompts(questions);
  const { command, leds, brightness, red, green, blue } = response;
  const pixelCount = parseInt(leds, 10);
  const brightnessValue = parseInt(brightness, 10);
  const redValue = parseInt(red, 10);
  const greenValue = parseInt(green, 10);
  const blueValue = parseInt(blue, 10);
  const pixelColor = getPixelColor(redValue, greenValue, blueValue);
  const hexColor = getPixelColorFromHex(pixelColor);
  const rgbColor = getPixelColorFromRGB(redValue, greenValue, blueValue);
  const canvas = createCanvas(leds, 1);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = hexColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const pixels = new Uint32Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    pixels[i] = (data[offset] << 16) | (data[offset + 1] << 8) | data[offset + 2];
  }
  ws281x.init(pixelCount);
  ws281x.setBrightness(brightnessValue);
  ws281x.setPixels(pixels);
  ws281x.render();
  if (command === 'on') {
    ws281x.setBrightness(brightnessValue);
    ws281x.setPixels(pixels);
    ws281x.render();
  } else if (command === 'off') {
    ws281x.clear();
    ws281x.render();
  }
  await setTimeout(1000);
  ws281x.reset();
  ws281x.render();
})()
