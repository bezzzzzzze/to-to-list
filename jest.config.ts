import type { Config } from "jest";
const config: Config = {
  rootDir: "./tests",
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
