var path = require('path');
var webpack = require('webpack');

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: 'eval',
  entry: isProduction ?
    [ './src/demo/index' ] :
    [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './src/demo/index'
    ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: isProduction ? 'static/' : '/static/'
  },
  plugins:  isProduction ?
    [new webpack.NoErrorsPlugin()] :
    [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: isProduction ? ['babel'] : ['react-hot', 'babel'],
      include: path.join(__dirname, 'src'),
      exclude: path.join(__dirname, 'src', 'demo', 'FormattedText.jsx')
    }, {
      test: /intl-messageformat\/dist\/locale-data\/.*/,
      loaders: ['imports?IntlMessageFormat=intl-messageformat']
    }]
  }
};
