export interface Location {
    latitude: number;
    longitude: number;
    name: string;
}

export interface CurrentWeather {
    temperatureF: number;
    precipitationIn: number;
    weatherCode: number; // WMO code
}

export interface SunDay {
    sunrise: number; // epoch ms
    sunset: number;  // epoch ms
}

const TIMEOUT_MS = 10_000;

const getJson = async (url: URL | string, init?: RequestInit): Promise<unknown> => {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`);
    return res.json();
};

/** Approximate location from the public IP address. */
export const locateByIp = async (): Promise<Location> => {
    const data = (await getJson('https://ipwho.is/')) as {
        success?: boolean;
        message?: string;
        latitude?: number;
        longitude?: number;
        city?: string;
        region?: string;
    };

    if (!data.success || typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
        throw new Error(`IP location lookup failed${data.message ? `: ${data.message}` : ''}`);
    }

    return {
        latitude: data.latitude,
        longitude: data.longitude,
        name: [data.city, data.region].filter(Boolean).join(', ') || 'your area',
    };
};

/** Location from a city name via Open-Meteo geocoding. Takes the best match. */
export const locateByName = async (query: string): Promise<Location> => {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', query.trim());
    url.searchParams.set('count', '1');

    const data = (await getJson(url)) as {
        results?: { latitude: number; longitude: number; name: string; admin1?: string }[];
    };

    const hit = data.results?.[0];
    if (!hit) throw new Error(`No location found for "${query}"`);

    return {
        latitude: hit.latitude,
        longitude: hit.longitude,
        name: [hit.name, hit.admin1].filter(Boolean).join(', '),
    };
};

export const fetchCurrentWeather = async ({ latitude, longitude }: Location): Promise<CurrentWeather> => {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(latitude));
    url.searchParams.set('longitude', String(longitude));
    url.searchParams.set('current', 'temperature_2m,precipitation,weather_code');
    url.searchParams.set('temperature_unit', 'fahrenheit');
    url.searchParams.set('precipitation_unit', 'inch');

    const data = (await getJson(url)) as {
        current?: { temperature_2m?: number; precipitation?: number; weather_code?: number };
    };

    const c = data.current;
    if (typeof c?.temperature_2m !== 'number' || typeof c.weather_code !== 'number') {
        throw new Error('Weather response missing current conditions');
    }

    return {
        temperatureF: c.temperature_2m,
        precipitationIn: c.precipitation ?? 0,
        weatherCode: c.weather_code,
    };
};

export interface WeatherAlert {
    event: string;    // e.g. "Tornado Warning", "Flood Watch"
    severity: string; // "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown"
}

const NWS_USER_AGENT = 'raspberry-pi-neopixels (github.com/willblake01/raspberry-pi-neopixels)';

export const fetchActiveAlerts = async ({ latitude, longitude }: Location): Promise<WeatherAlert[]> => {
    const url = new URL('https://api.weather.gov/alerts/active');
    url.searchParams.set('point', `${latitude.toFixed(4)},${longitude.toFixed(4)}`);

    const data = (await getJson(url, {
        headers: { 'User-Agent': NWS_USER_AGENT, Accept: 'application/geo+json' },
    })) as { features?: { properties?: { event?: string; severity?: string } }[] };

    return (data.features ?? []).map((f) => ({
        event: f.properties?.event ?? '',
        severity: f.properties?.severity ?? 'Unknown',
    }));
};

/** Today's and tomorrow's sunrise/sunset. Unix timestamps avoid time zone parsing. */
export const fetchSunTimes = async ({ latitude, longitude }: Location): Promise<SunDay[]> => {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(latitude));
    url.searchParams.set('longitude', String(longitude));
    url.searchParams.set('daily', 'sunrise,sunset');
    url.searchParams.set('timeformat', 'unixtime');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('forecast_days', '2');

    const data = (await getJson(url)) as { daily?: { sunrise?: number[]; sunset?: number[] } };
    const sunrise = data.daily?.sunrise ?? [];
    const sunset = data.daily?.sunset ?? [];

    if (sunrise.length === 0 || sunrise.length !== sunset.length) {
        throw new Error('Sunrise/sunset missing from response');
    }

    return sunrise.map((rise, i) => ({ sunrise: rise * 1000, sunset: sunset[i] * 1000 }));
};