module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  // So Jest understands ESM imports
  extensionsToTreatAsEsm: ['.ts'],

  globals: {
    'ts-jest': {
      useESM: true
    }
  },

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};
