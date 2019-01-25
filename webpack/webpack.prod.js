// Native dependencies.
const path = require('path');

// Webpack dependencies.
const merge = require('webpack-merge');
const commonCfg = require('./webpack.common');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => merge(commonCfg(env, {
  ...argv,
  sourceMap: false
}), {
  mode: 'production',
  bail: true,

  plugins: [
    new MiniCssExtractPlugin({filename: '[name].[hash].css'}),

  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
});
