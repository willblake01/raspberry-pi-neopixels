import { jest } from '@jest/globals';

const configure = jest.fn();
const render = jest.fn();
const reset = jest.fn();

export { configure, render, reset };
export default { configure, render, reset };
