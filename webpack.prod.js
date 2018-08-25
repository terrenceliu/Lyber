const merge = require('webpack-merge');
const common = require('./webpack.config.js');

const webpack = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');

const Compression = 

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
});