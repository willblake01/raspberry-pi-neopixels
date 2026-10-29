import { collectPixelSegments } from './pixelSegments.js';

let logSpy: jest.SpyInstance;
beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => logSpy.mockRestore());

test('collects segments until Done', async () => {
    const ask = jest
        .fn()
        .mockResolvedValueOnce({ target: '5', red: 255, green: 255, blue: 255 })
        .mockResolvedValueOnce({ next: 'add' })
        .mockResolvedValueOnce({ target: '1-3', red: 255, green: 0, blue: 0 })
        .mockResolvedValueOnce({ next: 'done' });

    const segments = await collectPixelSegments(10, ask as any);

    expect(segments).toEqual([
        { start: 4, end: 4, color: 0xffffff },
        { start: 0, end: 2, color: 0xff0000 },
    ]);
    expect(ask).toHaveBeenCalledTimes(4);
});

test('returns null when cancelled mid-segment', async () => {
    const ask = jest.fn(async (_questions: unknown, options: { onCancel: () => void }) => {
        options.onCancel();
        return {};
    });

    expect(await collectPixelSegments(10, ask as any)).toBeNull();
});

test('returns null when cancelled at the Next menu', async () => {
    const ask = jest
        .fn()
        .mockResolvedValueOnce({ target: '5', red: 1, green: 2, blue: 3 })
        .mockImplementationOnce(async (_q: unknown, options: { onCancel: () => void }) => {
            options.onCancel();
            return {};
        });

    expect(await collectPixelSegments(10, ask as any)).toBeNull();
});