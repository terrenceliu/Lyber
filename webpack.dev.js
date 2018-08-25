const merge = require('webpack-merge');
const common = require('./webpack.config.js');

const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});


module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // host: '0.0.0.0',
    disableHostCheck: true,
    contentBase: './dist',
    historyApiFallback: true,
  },
  plugins: [htmlPlugin],
});
