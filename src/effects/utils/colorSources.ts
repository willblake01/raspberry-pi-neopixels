import { randomColor } from './color.js';

/** Supplies the color for each frame and decides when it changes. */
export interface ColorSource {
    current(): number;
    /** Called after each frame. `wrapped` is true when the walk restarts at 0. */
    advance(wrapped: boolean): void;
}

export const fixedColor = (color: number): ColorSource => ({
    current: () => color,
    advance: () => {},
});

export const randomStaticColor = (): ColorSource => fixedColor(randomColor());

export const randomEveryPixelColor = (): ColorSource => {
    let color = randomColor();
    return {
        current: () => color,
        advance: () => { color = randomColor(); },
    };
};

export const randomEveryLoopColor = (): ColorSource => {
    let color = randomColor();
    return {
        current: () => color,
        advance: (wrapped) => { if (wrapped) color = randomColor(); },
    };
};