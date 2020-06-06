const webpack = require('webpack');

module.exports = {
  entry: {
    'puppeteer-core': './ppcore.js',
  },
  resolve: {
    alias: {
      fs: require.resolve('./fs.js'),
      buffer: 'browserfs/dist/shims/buffer.js',
      path: 'browserfs/dist/shims/path.js',
      processGlobal: 'browserfs/dist/shims/process.js',
      bufferGlobal: 'browserfs/dist/shims/bufferGlobal.js',
      bfsGlobal: require.resolve('browserfs'),
      ws: require.resolve('./ws')
    },
  },
  module: {
    noParse: /browserfs\.js/,
  },
  plugins: [
    // Expose BrowserFS, process, and Buffer globals.
    // NOTE: If you intend to use BrowserFS in a script tag, you do not need
    // to expose a BrowserFS global.
    new webpack.ProvidePlugin({
      BrowserFS: 'bfsGlobal',
      process: 'processGlobal',
      Buffer: 'bufferGlobal',
    }),
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/puppeteer-core\/lib\/launcher\/(.*)/,
      require.resolve('./empty.js')
    )
  ],
  node: {
    process: false,
    Buffer: false,
  },
  output: {
    filename: '[name].js',
    path: __dirname,
    libraryTarget: 'umd'
  },
};
