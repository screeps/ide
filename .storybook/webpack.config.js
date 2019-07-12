// Native dependencies.
const path = require('path');

// Webpack dependencies.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Constants defines.
const sourceMap = true;

const STYLE_LOADER = [
    {
        test: /\.less$/,
        use: [{
            loader: 'style-loader'
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

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    plugins: [
    ],

    module: {
        rules: [
            ...STYLE_LOADER,
            ...COMPILER_LOADER,
            ...ASSETS_LOADER
        ]
    }
};
