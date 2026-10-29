import { WeatherMode, type WeatherModeDeps } from './WeatherMode.js';
import { weatherToColor } from '../weather/colors.js';
import type { CurrentWeather, Location } from '../weather/api.js';
import {
    colorFromRGB,
    renderedFrames,
    safeRenderMock,
    setupEffectTest,
} from '../test-utils/effectHelpers.js';

jest.mock('../ledRuntime.js', () => ({ safeRender: jest.fn() }));
jest.mock('../utils/index.js', () => ({ randomNumber: jest.fn() }));

setupEffectTest();

const LOCATION: Location = { latitude: 1, longitude: 2, name: 'Testville' };
const HOT: CurrentWeather = { temperatureF: 100, precipitationIn: 0, weatherCode: 0 };
const RAIN: CurrentWeather = { temperatureF: 100, precipitationIn: 0.1, weatherCode: 63 };
const POLL = 60_000;

const makeDeps = (...weather: CurrentWeather[]): WeatherModeDeps & {
    locate: jest.Mock;
    fetchWeather: jest.Mock;
} => {
    const fetchWeather = jest.fn();
    weather.forEach((w) => fetchWeather.mockResolvedValueOnce(w));
    return { locate: jest.fn().mockResolvedValue(LOCATION), fetchWeather, log: () => {} };
};

const solid = (leds: number, color: number) => Array(leds).fill(color);

test('renders the temperature color right away', async () => {
    const effect = new WeatherMode(3, makeDeps(HOT), POLL);

    effect.run();
    await jest.advanceTimersByTimeAsync(0);

    expect(renderedFrames()).toEqual([solid(3, colorFromRGB(255, 0, 0))]);
    effect.stop();
});

test('switches to blue when it starts raining', async () => {
    const effect = new WeatherMode(3, makeDeps(HOT, RAIN), POLL);

    effect.run();
    await jest.advanceTimersByTimeAsync(POLL);

    expect(renderedFrames()).toEqual([
        solid(3, weatherToColor(HOT)),
        solid(3, weatherToColor(RAIN)),
    ]);
    effect.stop();
});

test('looks up the location once, then reuses it', async () => {
    const deps = makeDeps(HOT, HOT, HOT);
    const effect = new WeatherMode(3, deps, POLL);

    effect.run();
    await jest.advanceTimersByTimeAsync(POLL * 2);

    expect(deps.locate).toHaveBeenCalledTimes(1);
    expect(deps.fetchWeather).toHaveBeenCalledTimes(3);
    effect.stop();
});

test('keeps the last color when an update fails', async () => {
    const deps = makeDeps(HOT);
    deps.fetchWeather.mockRejectedValueOnce(new Error('offline'));
    const effect = new WeatherMode(3, deps, POLL);

    effect.run();
    await jest.advanceTimersByTimeAsync(POLL);

    expect(renderedFrames()).toEqual([solid(3, colorFromRGB(255, 0, 0))]);
    effect.stop();
});

test('does not render if stopped before the response arrives', async () => {
    let resolve!: (w: CurrentWeather) => void;
    const deps = makeDeps();
    deps.fetchWeather.mockReturnValueOnce(new Promise((r) => { resolve = r; }));
    const effect = new WeatherMode(3, deps, POLL);

    effect.run();
    await jest.advanceTimersByTimeAsync(0);
    effect.stop();
    resolve(HOT);
    await jest.advanceTimersByTimeAsync(0);

    expect(safeRenderMock).not.toHaveBeenCalled();
});