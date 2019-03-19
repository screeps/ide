// Native dependencies.
const path = require('path');

// Webpack dependencies.
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Constants defines.
const srcDir = path.resolve('./examples');
const distDir = path.resolve('./examples_dist');

module.exports = (env, {
  sourceMap
}) => {
  const STYLE_LOADER = [
    {
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: 'css-loader',
        options: {
          sourceMap
        }
      }]
    }, {
      test: /\.scss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: 'css-loader',
        options: {
          sourceMap
        }
      }, {
        loader: 'resolve-url-loader'
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }]
    }, {
      test: /\.less$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: 'css-loader',
        options: {
          sourceMap
        }
      }, {
        loader: 'less-loader',
        options: {
          sourceMap
        }
      }]
    }
  ];
  const COMPILER_LOADER = [
    {
      test: /\.(ts|tsx)$/,
      exclude: [/node_modules/, /\.old$/],
      use: [{
        loader: 'ts-loader'
      }]
    }, {
      enforce: "pre",
      test: /\.js$/,
      loader: "source-map-loader"
    }
  ];
  const ASSETS_LOADER = [
    {
      test: /\.(jpe?g|png|gif|svg)$/,
      use: [{
          loader: 'url-loader',
          options: {
              limit: 8196,
              name: 'assets/img/[name].[hash].[ext]',
              fallback: 'file-loader'
          }
      }]
    }, {
      test: /\.(eot|ttf|woff)$/,
      use: [{
          loader: 'file-loader',
          options: {
              name: 'assets/fonts/[name].[hash].[ext]',
              fallback: 'file-loader'
          }
      }]
    }
  ];

  return {
    entry: {
      app: path.join(srcDir, 'index.tsx'),
      vendor: ['react', 'react-dom']
    },

    output: {
      path: distDir,
      filename: '[name].[hash].js'
    },

    resolve: {
      alias: {
        assets: path.join(srcDir, 'assets'),
        'ui-variables.less': path.join(srcDir, 'examples/ui-variables.less'),
      },
      extensions: ['.ts', '.tsx', '.js', '.json']
    },

    plugins: [
      new HtmlWebPackPlugin({
        template: path.join(srcDir, 'index.html'),
        filename: './index.html'
      })
    ],

    module: {
      rules: [
        ...STYLE_LOADER,
        ...COMPILER_LOADER,
        ...ASSETS_LOADER
      ]
    }
  }
};
