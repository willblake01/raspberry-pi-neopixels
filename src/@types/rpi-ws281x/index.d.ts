declare module 'rpi-ws281x' {
  export type StripType = 'rgb' | 'rbg' | 'grb' | 'gbr' | 'brg' | 'bgr' | 'rgbw' | 'grbw';

  export interface Ws281xConfig {
    leds: number;
    dma?: number;
    brightness?: number;   // 0–255
    gpio?: number;
    stripType?: StripType;
    gamma?: number;        // omit to disable
  }

  export interface Ws281xController {
    configure(config: Ws281xConfig): void;
    render(pixels: Uint32Array): void;
    reset(): void;
  }

  const ws281x: Ws281xController;
  export default ws281x;
}