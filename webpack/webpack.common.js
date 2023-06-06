const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

module.exports = {
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index_bundle.js',
    publicPath: PUBLIC_PATH
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    fallback: {
      "fs": false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../public', 'index.html'),
      favicon: './src/assets/favicon.ico'
    }),
    new NodePolyfillPlugin(),
    new Dotenv({
      systemvars: true
    })
  ]
}