const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  mode: "production",
  watch: true,
  entry: ["./src/v1/app.ts"],
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "build/production/v1"),
  },
  module: {
    rules: [{ test: /\.ts$/, exclude: /node_modules/, loader: "ts-loader" }],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: [nodeExternals()],
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
