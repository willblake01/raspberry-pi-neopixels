import { KP_STYLES, gScale, kpLevel, kpStyle } from './spaceWeather.js';

test.each([
    [0, 'quiet'],
    [3.4, 'quiet'],
    [3.5, 'active'],
    [4.4, 'active'],
    [4.67, 'storm'],
    [6.3, 'storm'],
    [7, 'strongStorm'],
    [7.67, 'severeStorm'],
    [9, 'severeStorm'],
    [-1, 'quiet'],
])('Kp %p is %s', (kp, level) => {
    expect(kpLevel(kp)).toBe(level);
});

test.each([
    [3, 0],
    [4.67, 1],
    [6, 2],
    [7, 3],
    [8, 4],
    [9, 5],
])('Kp %p is G%p', (kp, g) => {
    expect(gScale(kp)).toBe(g);
});

test('quiet and active are steady; storms pulse', () => {
    expect(kpStyle(2).pulseMs).toBeUndefined();
    expect(kpStyle(4).pulseMs).toBeUndefined();
    expect(kpStyle(5).pulseMs).toBe(KP_STYLES.storm.pulseMs);
});

test('stronger storms pulse faster', () => {
    expect(KP_STYLES.strongStorm.pulseMs!).toBeLessThan(KP_STYLES.storm.pulseMs!);
    expect(KP_STYLES.severeStorm.pulseMs!).toBeLessThan(KP_STYLES.strongStorm.pulseMs!);
});