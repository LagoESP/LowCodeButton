/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const glob = require("glob");

const entries = {};
glob.sync("./src/*.ts").forEach((file) => {
  const entryName = path.basename(file, ".ts");
  entries[entryName] = file;
});

module.exports = {
  entry: entries,
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
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: ["LCB"],
    libraryTarget: "var",
  },
};
