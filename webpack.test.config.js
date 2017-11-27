const path = require('path');
const Webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  entry: {
    tests: './test/index.js',
    demo: './demo/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: path.join(__dirname, 'node_modules')
      }, {
        test: /\.(sass|scss|css)$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [
              path.resolve(__dirname, './node_modules/compass-mixins/lib')
            ]
          }
        }]
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules'
    ]
  },
  devServer: {
    port: 9123
  },
  plugins: [
    new DashboardPlugin()
  ]
};
