// A logical AND combinator for predicates
export const and =
  <T>(...fns: Array<(v: T) => boolean>) =>
  (v: T): boolean =>
    fns.every((f) => f(v));


// Integer range validator
export const integerBetween =
  (min: number, max: number) =>
  (x: unknown): true | string => {
    return Number.isInteger(x) && typeof x === 'number' && x >= min && x <= max
      ? true
      : `Enter an integer ${min}-${max}`;
  };

// Number validator
export const numberBetween = (min: number, max: number) => (v: unknown) =>
    typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max
        ? true
        : `Enter a value between ${min} and ${max}`;


// Ensures a function runs only once
export const once = <Args extends unknown[], R>(
  fn: (...args: Args) => R
) => {
  let called = false;
  return (...args: Args): R | undefined => {
    if (called) return;
    called = true;
    return fn(...args);
  };
};


// Random integer from 0 to max
export const randomNumber = (max: number): number =>
  Math.floor(Math.random() * (max + 1));
