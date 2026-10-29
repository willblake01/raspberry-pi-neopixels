import { CustomPixels, buildCustomPixels, parsePixelTarget } from './CustomPixels.js';

jest.mock('../ledRuntime.js', () => ({ safeRender: jest.fn() }));

import { safeRender } from '../ledRuntime.js';

const safeRenderMock = safeRender as jest.MockedFunction<typeof safeRender>;

const WHITE = 0xffffff;
const RED = 0xff0000;

beforeEach(() => {
    safeRenderMock.mockClear();
});

// < - - - - - - parsePixelTarget - - - - - - >

describe('parsePixelTarget', () => {
    test('parses a single pixel (1-based → 0-based)', () => {
        expect(parsePixelTarget('3', 5)).toEqual({ start: 2, end: 2 });
    });

    test('parses a range', () => {
        expect(parsePixelTarget('2-4', 5)).toEqual({ start: 1, end: 3 });
    });

    test('ignores surrounding spaces', () => {
        expect(parsePixelTarget('  2 - 4 ', 5)).toEqual({ start: 1, end: 3 });
    });

    test('accepts the first and last pixel', () => {
        expect(parsePixelTarget('1-5', 5)).toEqual({ start: 0, end: 4 });
    });

    test.each([
        ['0', /Pixel must be 1–5/],
        ['6', /Pixel must be 1–5/],
        ['2-9', /Pixel must be 1–5/],
        ['abc', /Pixel must be 1–5/],
        ['4-2', /low to high/],
        ['1-2-3', /pixel like "5"/],
        ['', /pixel like "5"/],
    ])('rejects "%s"', (input, message) => {
        expect(() => parsePixelTarget(input, 5)).toThrow(message);
    });
});

// < - - - - - - buildCustomPixels - - - - - - >

describe('buildCustomPixels', () => {
    test('lights a single pixel', () => {
        const frame = buildCustomPixels(5, [{ start: 2, end: 2, color: WHITE }]);
        expect(Array.from(frame)).toEqual([0, 0, WHITE, 0, 0]);
    });

    test('lights a range', () => {
        const frame = buildCustomPixels(4, [{ start: 1, end: 2, color: RED }]);
        expect(Array.from(frame)).toEqual([0, RED, RED, 0]);
    });

    test('later segments override earlier ones', () => {
        const frame = buildCustomPixels(3, [
            { start: 0, end: 2, color: RED },
            { start: 1, end: 1, color: WHITE },
        ]);
        expect(Array.from(frame)).toEqual([RED, WHITE, RED]);
    });

    test('no segments leaves the strip off', () => {
        expect(Array.from(buildCustomPixels(3, []))).toEqual([0, 0, 0]);
    });
});

// < - - - - - - Effect - - - - - - >

describe('CustomPixels effect', () => {
    test('does not render in the constructor', () => {
        new CustomPixels(3, [{start: 0, end: 0, color: RED}]);
        expect(safeRender).not.toHaveBeenCalled();
    });

    test('renders the frame once on run', () => {
        const effect = new CustomPixels(3, [{start: 0, end: 0, color: RED}]);

        effect.run();

        expect(safeRender).toHaveBeenCalledTimes(1);
        expect(Array.from(safeRenderMock.mock.calls[0][0] as Uint32Array)).toEqual([RED, 0, 0]);
    });
});