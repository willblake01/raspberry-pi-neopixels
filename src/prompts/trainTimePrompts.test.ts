import { promptsConfig } from './prompts.js';
import { EFFECTS } from '../constants/index.js';

const shown = (answers: Record<string, unknown>) =>
    promptsConfig
        .filter((p) => typeof p.type !== 'function' || (p.type as Function)(undefined, answers, p) !== null)
        .map((p) => p.name);

const trainTime = { command: 1, effect: EFFECTS.TRAIN_TIME };

describe('Train Time prompts', () => {
    const original = process.env.TRAIN_TIME_TOKEN;
    afterEach(() => {
        if (original === undefined) delete process.env.TRAIN_TIME_TOKEN;
        else process.env.TRAIN_TIME_TOKEN = original;
    });

    test('asks for the token and travel time', () => {
        delete process.env.TRAIN_TIME_TOKEN;
        expect(shown(trainTime)).toEqual(expect.arrayContaining(['trainTimeToken', 'trainTravelMinutes']));
    });

    test('skips the token prompt when TRAIN_TIME_TOKEN is set', () => {
        process.env.TRAIN_TIME_TOKEN = 'a'.repeat(43);
        expect(shown(trainTime)).not.toContain('trainTimeToken');
        expect(shown(trainTime)).toContain('trainTravelMinutes');
    });

    test('masks the token as it is typed', () => {
        delete process.env.TRAIN_TIME_TOKEN;
        const prompt = promptsConfig.find((p) => p.name === 'trainTimeToken')!;
        expect((prompt.type as Function)(undefined, trainTime, prompt)).toBe('password');
    });

    test('does not ask about colors, intervals or location', () => {
        delete process.env.TRAIN_TIME_TOKEN;
        const names = shown(trainTime);
        for (const name of ['colorType', 'interval', 'locationType']) expect(names).not.toContain(name);
    });
});
