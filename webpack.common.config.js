const path = require('path');

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: path.join(__dirname, 'node_modules')
      }, {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader'
        }]
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
    ],
    alias: {
      shifty: path.resolve(__dirname, './node_modules/rekapi/node_modules/shifty/dist/shifty.js')
    },
    // Uncomment this when testing symlinked dependencies
    //symlinks: false
  }
};
