import prompts, { type PromptObject } from 'prompts';
import { integerBetween } from '../utils/index.js';
import { packRGB } from '../effects/utils/color.js';
import { parsePixelTarget } from '../effects/CustomPixels.js';
import type { PixelSegment } from '../types/index.js';

type Ask = typeof prompts;

const colorPrompt = (name: string, label: string): PromptObject => ({
    type: 'number',
    name,
    message: `${label} (0-255)`,
    initial: 0,
    validate: integerBetween(0, 255),
});

const describe = ({ start, end }: { start: number; end: number }) =>
    start === end ? `pixel ${start + 1}` : `pixels ${start + 1}–${end + 1}`;

/**
 * Asks for segments until the user chooses "Done".
 * Returns null if the user pressed Ctrl+C.
 */
export const collectPixelSegments = async (
    leds: number,
    ask: Ask = prompts,
): Promise<PixelSegment[] | null> => {
    const segments: PixelSegment[] = [];
    let cancelled = false;
    const onCancel = () => {
        cancelled = true;
        return false;
    };

    for (;;) {
        const n = segments.length + 1;

        const answers = await ask(
            [
                {
                    type: 'text',
                    name: 'target',
                    message: `Segment ${n}: pixel or range (1-${leds}), e.g. "5" or "10-20"`,
                    validate: (v: string) => {
                        try {
                            parsePixelTarget(v ?? '', leds);
                            return true;
                        } catch (err) {
                            return (err as Error).message;
                        }
                    },
                },
                colorPrompt('red', 'Red'),
                colorPrompt('green', 'Green'),
                colorPrompt('blue', 'Blue'),
            ],
            { onCancel },
        );
        if (cancelled) return null;

        const range = parsePixelTarget(answers.target, leds);
        segments.push({ ...range, color: packRGB(answers.red, answers.green, answers.blue) });
        console.log(`✅ Segment ${n}: ${describe(range)} → (${answers.red}, ${answers.green}, ${answers.blue})`);

        const { next } = await ask(
            {
                type: 'select',
                name: 'next',
                message: 'Next',
                choices: [
                    { title: 'Add another segment', value: 'add' },
                    { title: 'Done', value: 'done' },
                ],
            },
            { onCancel },
        );
        if (cancelled) return null;
        if (next === 'done') return segments;
    }
};