// Native dependencies.
const path = require('path');

// Webpack dependencies.
const merge = require('webpack-merge');
const commonCfg = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => merge(commonCfg(env, {
  ...argv,
  sourceMap: true
}), {
  mode: 'development',
  devtool: 'source-map',

  plugins: [
    new MiniCssExtractPlugin({filename: '[name].css'}),

  ],

  devServer: {
    port: 3000,
    host: '0.0.0.0',
    disableHostCheck: true
  }
});
