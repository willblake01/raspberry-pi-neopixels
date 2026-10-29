import { parsePixelSpecs, buildCustomPixels } from './CustomPixels.js';

const WHITE = 0xffffff;
const RED = 0xff0000;

test('lights a single pixel (1-based)', () => {
    const frame = buildCustomPixels(5, parsePixelSpecs('3, 255, 255, 255', 5));
    expect(Array.from(frame)).toEqual([0, 0, WHITE, 0, 0]);
});

test('ranges and all', () => {
    expect(Array.from(buildCustomPixels(4, parsePixelSpecs('2-3, 255, 0, 0', 4)))).toEqual([0, RED, RED, 0]);
    expect(Array.from(buildCustomPixels(3, parsePixelSpecs('all, 255, 0, 0', 3)))).toEqual([RED, RED, RED]);
});

test('later entries override earlier ones', () => {
    const frame = buildCustomPixels(3, parsePixelSpecs('all, 255, 0, 0; 2, 255, 255, 255', 3));
    expect(Array.from(frame)).toEqual([RED, WHITE, RED]);
});

test.each([
    ['0, 255, 0, 0', /Pixel must be 1–5/],
    ['6, 255, 0, 0', /Pixel must be 1–5/],
    ['1, 300, 0, 0', /Red must be 0–255/],
    ['1, 255, 0', /needs 4 values/],
    ['4-2, 255, 0, 0', /low to high/],
    ['', /at least one entry/],
])('rejects "%s"', (input, message) => {
    expect(() => parsePixelSpecs(input, 5)).toThrow(message);
});