declare module 'rpi-ws281x' {
  export interface Ws281xController {
    configure(config: unknown): void;
    render(pixels: Uint32Array): void;
    reset(): void;
  }

  const ws281x: Ws281xController;
  export default ws281x;
}
