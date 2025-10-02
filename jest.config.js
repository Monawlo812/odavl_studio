module.exports = {
  roots: ["<rootDir>/packages/cli/__tests__"],
  testMatch: ["**/*.spec.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testEnvironment: "node",
};
