module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json"
    }
  },

  // Map "./foo.js" import in TS to "./foo" so Jest finds foo.ts
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },

  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },

  // Only run tests from src/, ignore built JS in dist
  testMatch: ["**/src/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"]
};
