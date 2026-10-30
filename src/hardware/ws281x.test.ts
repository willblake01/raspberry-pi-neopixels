import type { Ws281xInterface } from './ws281x.js';

type LoaderModule = typeof import('./ws281x.js');

const SIGNALS = ['SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'] as const;

const fakeDriver = (): Ws281xInterface => ({
    configure: jest.fn(),
    render: jest.fn(),
    reset: jest.fn(),
});

/** Handlers our fake library installs on load, so we can clean up if a test fails. */
let libraryHandlers: { signal: (typeof SIGNALS)[number]; handler: () => void }[] = [];

/** Mock rpi-ws281x the way the real one behaves: installing signal handlers when loaded. */
const mockLibrary = (exports: unknown) => {
    jest.doMock(
        'rpi-ws281x',
        () => {
            for (const signal of SIGNALS) {
                const handler = () => {};
                libraryHandlers.push({ signal, handler });
                process.on(signal, handler);
            }
            return exports;
        },
        { virtual: true },
    );
};

const mockMissingLibrary = () => {
    jest.doMock(
        'rpi-ws281x',
        () => {
            throw new Error("Cannot find module 'rpi-ws281x'");
        },
        { virtual: true },
    );
};

const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform')!;
const originalArch = Object.getOwnPropertyDescriptor(process, 'arch')!;

const setPlatform = (platform: string, arch: string) => {
    Object.defineProperty(process, 'platform', { value: platform, configurable: true });
    Object.defineProperty(process, 'arch', { value: arch, configurable: true });
};

/** Load a fresh copy of the loader, so `isPi` is evaluated for the current platform. */
const loadFresh = (setup: () => void): LoaderModule => {
    let mod!: LoaderModule;
    jest.isolateModules(() => {
        setup();
        mod = require('./ws281x.js') as LoaderModule;
    });
    return mod;
};

afterEach(() => {
    Object.defineProperty(process, 'platform', originalPlatform);
    Object.defineProperty(process, 'arch', originalArch);

    for (const { signal, handler } of libraryHandlers) process.off(signal, handler);
    libraryHandlers = [];

    jest.resetModules();
});

describe('loadWs281x', () => {
    describe('signal handlers', () => {
        test('removes the handlers rpi-ws281x installs on load', async () => {
            setPlatform('linux', 'arm64');
            const { loadWs281x } = loadFresh(() => mockLibrary({ __esModule: true, default: fakeDriver() }));

            const before = Object.fromEntries(SIGNALS.map((s) => [s, process.listeners(s).length]));
            await loadWs281x();

            for (const signal of SIGNALS) {
                expect(process.listeners(signal)).toHaveLength(before[signal]);
            }
            for (const { signal, handler } of libraryHandlers) {
                expect(process.listeners(signal)).not.toContain(handler);
            }
        });

        test('keeps handlers that were registered before loading', async () => {
            setPlatform('linux', 'arm64');
            const ours = () => {};
            process.on('SIGINT', ours);

            try {
                const { loadWs281x } = loadFresh(() => mockLibrary({ __esModule: true, default: fakeDriver() }));
                await loadWs281x();

                expect(process.listeners('SIGINT')).toContain(ours);
            } finally {
                process.off('SIGINT', ours);
            }
        });
    });

    describe('on a Raspberry Pi', () => {
        beforeEach(() => setPlatform('linux', 'arm64'));

        test('returns the driver from the default export', async () => {
            const driver = fakeDriver();
            const { loadWs281x } = loadFresh(() => mockLibrary({ __esModule: true, default: driver }));

            await expect(loadWs281x()).resolves.toBe(driver);
        });

        test('returns the driver when the module has no default export', async () => {
            const driver = fakeDriver();
            const { loadWs281x } = loadFresh(() => mockLibrary(driver));

            const loaded = await loadWs281x();

            expect(loaded.configure).toBe(driver.configure);
            expect(loaded.render).toBe(driver.render);
            expect(loaded.reset).toBe(driver.reset);
        });

        test('fails loudly when the native module is missing', async () => {
            const { loadWs281x } = loadFresh(mockMissingLibrary);

            await expect(loadWs281x()).rejects.toThrow(/rpi-ws281x/);
        });
    });

    describe('on a dev machine', () => {
        beforeEach(() => setPlatform('darwin', 'x64'));

        test('uses the real module when it is installed', async () => {
            const driver = fakeDriver();
            const { loadWs281x } = loadFresh(() => mockLibrary({ __esModule: true, default: driver }));

            await expect(loadWs281x()).resolves.toBe(driver);
        });

        test('falls back to a no-op driver when the module is missing', async () => {
            const { loadWs281x } = loadFresh(mockMissingLibrary);

            const driver = await loadWs281x();

            expect(() => {
                driver.configure({ leds: 10 });
                driver.render(new Uint32Array(10));
                driver.reset();
            }).not.toThrow();
        });
    });
});