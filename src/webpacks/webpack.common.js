/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  entry: "./src/demo.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve("WebResources"),
    filename: "LowCodeButton.js",
    library: ["esp", "LowCodeButton"],
    libraryTarget: "var",
  },
};
