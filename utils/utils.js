export const and = (...fns) => v => fns.every(f => f(v));

export const integerBetween = (min, max) => x => (Number.isInteger(x) && x >= min && x <= max) || `Enter an integer ${min}-${max}`;

export const once = (fn) => {
  let called = false;
  return (...args) => { if (called) return; called = true; return fn(...args); };
};

export const randomNumber = (max) => Math.floor(Math.random() * (max + 1));
