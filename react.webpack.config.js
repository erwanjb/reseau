const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');
 
module.exports = {
  // Change le point d'entrée en index.tsx
  entry: "./client/index.tsx",
  devServer: {
    contentBase: path.join(__dirname, 'dist-react'),
    compress: true,
    port: 8000
  },
  // Active le sourcemap pour le debugging
  devtool: "source-map",
  resolve: {
    // Ajoute '.ts' et'.tsx' aux extensions traitées
    extensions: [".ts", ".tsx", ".jsx", ".js", ".json"]
  },
  output: {
    path: path.join(__dirname, "/dist-react"),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } } // or whatever your project requires
              ],
              "@babel/preset-typescript",
              "@babel/preset-react"
            ],
          }
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new TsconfigPathsPlugin({configFile: 'tsconfig.react.json'}),
    new Dotenv()
  ]
};