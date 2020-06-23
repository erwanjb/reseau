const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');


module.exports = {
  entry: ['webpack/hot/poll?100', './server/main.ts'],
  watch: true,
  devServer: {
    // Don't refresh if hot loading fails. Good while
    // implementing the client interface.
    hotOnly: true,

    // If you want to refresh on errors too, set
    // hot: true,
  },
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.nest.json'
            }
          }
        ],
        exclude: /node_modules/,
        
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new TsconfigPathsPlugin({configFile: 'tsconfig.nest.json'}),
    new Dotenv(),
    ... (process.env.NEST_DEV === 'true' ? [new StartServerPlugin({ name: 'server.js' })] : []),
  ],
  output: {
    path: path.join(__dirname, 'dist-server'),
    filename: 'server.js',
  },
};