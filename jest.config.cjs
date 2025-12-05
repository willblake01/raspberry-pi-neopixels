module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Tell ts-jest to use CommonJS for Jest, even though your app uses ESM
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json'
      }
    ]
  },

  // Allow TS files to import './file.js' but map to './file.ts'
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^rpi-ws281x$': '<rootDir>/test/__mocks__/rpi-ws281x.ts'
  },

  // Only match test files inside src/
  testMatch: ['**/src/**/*.test.ts'],

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePathIgnorePatterns: ['/dist/']
};
