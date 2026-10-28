import { temperatureToRGB, isRaining, weatherToColor, RAIN_COLOR, TEMPERATURE_STOPS } from './colors.js';
import { packRGB } from '../effects/utils/color.js';

const dry = { precipitationIn: 0, weatherCode: 0 };

describe('temperatureToRGB', () => {
    test('uses the end colors outside the range', () => {
        expect(temperatureToRGB(-10)).toEqual(TEMPERATURE_STOPS[0].rgb);
        expect(temperatureToRGB(120)).toEqual([255, 0, 90]);
    });

    test('returns exact stop colors at stop temperatures', () => {
        expect(temperatureToRGB(70)).toEqual([255, 180, 50]);
    });

    test('interpolates between stops', () => {
        expect(temperatureToRGB(60)).toEqual([255, 220, 120]); // halfway between 50°F and 70°F
    });

    test('gets redder as it gets hotter', () => {
        const green = (t: number) => temperatureToRGB(t)[1];
        expect(green(95)).toBeLessThan(green(80));
        expect(green(80)).toBeLessThan(green(60));
    });
});

describe('isRaining', () => {
    test('true for rain, showers and thunderstorm codes', () => {
        for (const code of [61, 81, 95]) {
            expect(isRaining({ ...dry, weatherCode: code, temperatureF: 60 })).toBe(true);
        }
    });

    test('true when precipitation is reported with a non-snow code', () => {
        expect(isRaining({ temperatureF: 60, precipitationIn: 0.02, weatherCode: 3 })).toBe(true);
    });

    test('false for snow, even with precipitation', () => {
        expect(isRaining({ temperatureF: 25, precipitationIn: 0.1, weatherCode: 73 })).toBe(false);
    });

    test('false when clear and dry', () => {
        expect(isRaining({ ...dry, temperatureF: 60 })).toBe(false);
    });
});

describe('weatherToColor', () => {
    test('rain overrides temperature with pure blue', () => {
        expect(weatherToColor({ temperatureF: 100, precipitationIn: 0.1, weatherCode: 63 }))
            .toBe(packRGB(...RAIN_COLOR));
    });

    test('dry weather uses the temperature color', () => {
        expect(weatherToColor({ ...dry, temperatureF: 100 })).toBe(packRGB(255, 0, 0));
    });
});