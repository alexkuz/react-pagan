var path = require('path');
var webpack = require('webpack');

var isProduction = process.env.NODE_ENV === 'production';
var definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  },
});

module.exports = {
  devtool: 'eval',
  entry: isProduction ?
    [ './demo/index' ] :
    [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './demo/index'
    ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: isProduction ? 'static/' : '/static/'
  },
  plugins:  isProduction ?
    [
      new webpack.NoErrorsPlugin(),
      definePlugin,
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false }
      })
    ] : [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      definePlugin
    ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: isProduction ? ['babel'] : ['react-hot', 'babel'],
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'demo')
      ]
    }, {
      test: /intl-messageformat\/dist\/locale-data\/.*/,
      loaders: ['imports?IntlMessageFormat=intl-messageformat']
    }, {
      test: /\.i18n\.json$/,
      loaders: ['promise?global,[name].i18n', 'json']
    }, {
      test: require.resolve('react/lib/ReactDefaultPerf'), loader: 'expose?Perf'
    }]
  }
};
