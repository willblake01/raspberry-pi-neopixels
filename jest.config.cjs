module.exports = {
  // TS + ESM via ts-jest
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  // Treat .ts as ESM
  extensionsToTreatAsEsm: [".ts"],

  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "./tsconfig.json",
    },
  },

  // Map "./foo.js" in TS to "./foo" so Jest loads foo.ts
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  // Make sure ALL TS files go through ts-jest
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },

  // Don’t accidentally run compiled JS tests
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
