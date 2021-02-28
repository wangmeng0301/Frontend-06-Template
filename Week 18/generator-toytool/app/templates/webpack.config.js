// const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件
const VueLoaderOlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./src/main.js",
  module: {
    rules: [
      { test: /\.vue$/, use: "vue-loader" },
      {
        test:/\.css$/,
        use: ["style-loader", "css-loader", "style-loader"]
      },
      { test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env"]
        }
      },
    ],
  },
  plugins: [
    new VueLoaderOlugin(),
    new CopyPlugin({
      patterns: [
        { from: "src/*.html", to: "[name].[ext]"},
      ]
    })
  ],
};