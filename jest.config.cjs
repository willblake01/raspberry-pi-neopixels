module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],

  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "./tsconfig.json",
    },
  },

  moduleNameMapper: {
    // Take './index.js' in TS and resolve './index' (i.e., index.ts)
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },

  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
