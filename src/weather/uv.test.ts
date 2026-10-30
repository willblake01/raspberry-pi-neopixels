import { UV_COLORS, uvAt, uvLevel, uvToRGB } from './uv.js';

describe('uvLevel', () => {
    test.each([
        [0, 'none'],
        [0.4, 'none'],
        [-1, 'none'],
        [0.5, 'low'],
        [2.4, 'low'],
        [2.5, 'moderate'],
        [5.4, 'moderate'],
        [5.5, 'high'],
        [7.4, 'high'],
        [7.5, 'veryHigh'],
        [10.4, 'veryHigh'],
        [10.5, 'extreme'],
        [14, 'extreme'],
    ])('UV %p is %s', (uv, level) => {
        expect(uvLevel(uv)).toBe(level);
    });
});

test('uvToRGB uses the level color', () => {
    expect(uvToRGB(6)).toEqual(UV_COLORS.high);
    expect(uvToRGB(0)).toEqual(UV_COLORS.none);
});

describe('uvAt', () => {
    const H = 3_600_000;
    const hours = [
        { time: 0, uv: 1 },
        { time: H, uv: 4 },
        { time: 2 * H, uv: 7 },
    ];

    test('uses the reading for the current hour', () => {
        expect(uvAt(H + 30 * 60_000, hours)).toBe(4);
    });

    test('switches exactly on the hour', () => {
        expect(uvAt(2 * H, hours)).toBe(7);
    });

    test('returns null before the first reading', () => {
        expect(uvAt(-1, hours)).toBeNull();
    });
});