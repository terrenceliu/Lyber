const path = require('path');

module.exports = {
  entry: [
    './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          plugins: ['transform-class-properties']
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64]",
              sourceMap: true,
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
           {
             loader: 'file-loader',
             options: {
               outputPath: 'static/images/'
             }
           }
        ]
      }
    ]
  },
  output: {
    filename: './[name].bundle.js',
    path: path.resolve(__dirname, './dist')
  }
};