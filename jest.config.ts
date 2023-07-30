/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  rootDir: "./tests",
  clearMocks: true,
  moduleFileExtensions: ["ts", "js"],
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "node",
  testRegex: ".*\\.test\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
};

export default config;
