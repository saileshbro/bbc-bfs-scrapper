module.exports = {
  entry: "./src/app.ts",
  mode: "production",
  context: __dirname,
  target: "node",
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }],
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["node_modules"],
  },
}
