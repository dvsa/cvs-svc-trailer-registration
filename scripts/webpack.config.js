const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (async () => {
  return {
    context: path.join(__dirname, '..'),
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    stats: slsw.lib.webpack.isLocal ? 'minimal' : 'detailed',
    devtool: slsw.lib.webpack.isLocal ? 'eval-cheap-module-source-map' : 'source-map',
    resolve: {
      extensions: ['.mjs', '.json', '.ts'],
      symlinks: false,
      cacheWithContext: false,
    },
    output: {
      libraryTarget: 'commonjs',
      path: path.join(__dirname, '..', '.artifact'),
      filename: '[name].js',
    },
    optimization: {
      concatenateModules: false,
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        {
          test: /\.(tsx?)$/,
          loader: 'ts-loader',
          exclude: [
            [
              path.resolve(__dirname, '..', 'node_modules'),
              path.resolve(__dirname, '..', '.serverless'),
              path.resolve(__dirname, '..', '.webpack'),
              path.resolve(__dirname, '..', '.artifact'),
            ],
          ],
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
          },
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {},
      }),
    ],
  };
})();
