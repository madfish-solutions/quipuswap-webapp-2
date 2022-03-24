const webpack = require("webpack");
const CracoAlias = require("craco-alias");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          process: require.resolve("process/browser"),
          zlib: require.resolve("browserify-zlib"),
          stream: require.resolve("stream-browserify"),
          util: require.resolve("util"),
          buffer: require.resolve("buffer"),
          asset: require.resolve("assert"),
          crypto: require.resolve("crypto-browserify"),
          url: require.resolve("url"),
          os: require.resolve("os-browserify/browser"),
          https: require.resolve("https-browserify"),
          http: require.resolve("stream-http"),
          path: require.resolve("path-browserify"),
          fs: false
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        }),
      ],
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./src",
        tsConfigPath: "./tsconfig.paths.json"
      }
    }
  ]
};
