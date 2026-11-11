import { fetchTripStatus, parseTripStatus } from './api.js';

const leg = {
    tripName: 'Trip',
    trainNum: '21',
    routeName: 'Texas Eagle',
    from: { code: 'AUS', name: 'Austin', tz: 'America/Chicago' },
    to: { code: 'SAS', name: 'San Antonio', tz: 'America/Chicago' },
    estimatedDeparture: '2026-11-07T19:22:00-06:00',
    estimatedArrival: '2026-11-07T22:46:00-06:00',
    delayMinutes: 5,
    live: true,
};

describe('parseTripStatus', () => {
    test('no trip', () => {
        expect(parseTripStatus({ version: 1, phase: 'none' })).toEqual({ phase: 'none' });
    });

    test('a leg with a connection', () => {
        const parsed = parseTripStatus({
            phase: 'onBoard',
            leg,
            connection: { station: 'San Antonio', nextTrainNum: '2', minutes: 12, risk: 'tight' },
        });
        expect(parsed.leg).toMatchObject({ trainNum: '21', delayMinutes: 5, live: true });
        expect(parsed.connection?.risk).toBe('tight');
    });

    test('drops a malformed connection instead of failing', () => {
        expect(parseTripStatus({ phase: 'upcoming', leg, connection: { risk: 'maybe' } }).connection).toBeUndefined();
    });

    test.each([
        [null],
        [{ phase: 'flying' }],
        [{ phase: 'upcoming' }],
        [{ phase: 'upcoming', leg: { ...leg, estimatedDeparture: 'soon' } }],
    ])('rejects %p', (json) => {
        expect(() => parseTripStatus(json)).toThrow(/Unexpected Train Time response/);
    });
});

describe('fetchTripStatus', () => {
    const fetchMock = jest.fn();
    const source = { baseUrl: 'https://example.test', token: 'secret-token' };

    beforeEach(() => {
        fetchMock.mockReset();
        global.fetch = fetchMock as unknown as typeof fetch;
    });

    const respond = (status: number, body: unknown = {}) =>
        fetchMock.mockResolvedValueOnce({ ok: status >= 200 && status < 300, status, json: async () => body });

    test('sends the token as a bearer header to the status endpoint', async () => {
        respond(200, { phase: 'none' });

        await expect(fetchTripStatus(source)).resolves.toEqual({ phase: 'none' });

        const [url, init] = fetchMock.mock.calls[0];
        expect(String(url)).toBe('https://example.test/api/device/status');
        expect(init.headers.Authorization).toBe('Bearer secret-token');
    });

    test('explains a rejected token', async () => {
        respond(401);
        await expect(fetchTripStatus(source)).rejects.toThrow(/link this device again/);
    });

    test('reports rate limiting', async () => {
        respond(429);
        await expect(fetchTripStatus(source)).rejects.toThrow(/too often/);
    });

    test('reports other HTTP errors', async () => {
        respond(500);
        await expect(fetchTripStatus(source)).rejects.toThrow(/HTTP 500/);
    });
});
