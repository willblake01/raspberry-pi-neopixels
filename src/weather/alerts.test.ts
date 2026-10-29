import { alertStyle, WARNING_STYLE, WATCH_STYLE } from './alerts.js';

const alert = (event: string, severity = 'Moderate') => ({ event, severity });

test('warnings beat watches', () => {
    expect(alertStyle([alert('Flood Watch'), alert('Tornado Warning', 'Extreme')])).toBe(WARNING_STYLE);
});

test('watches without warnings', () => {
    expect(alertStyle([alert('Severe Thunderstorm Watch')])).toBe(WATCH_STYLE);
});

test('advisories and statements are ignored', () => {
    expect(alertStyle([alert('Wind Advisory', 'Minor'), alert('Special Weather Statement')])).toBeNull();
});

test('no alerts', () => {
    expect(alertStyle([])).toBeNull();
});