const path = require('path');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: "./src/index.ts",
    target: 'node',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      alias: {
        "@": path.join(__dirname, "src")
      },
      extensions: [ '.ts', '.js' ]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    }
};