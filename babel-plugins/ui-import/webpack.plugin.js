/*
 * @Author: yquanmei
 * @Date: 2022-07
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-08
 * @FilePath: /learn-demo/babel-plugins/ui-import/webpack.plugin.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
const path = require("path");
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: {
    // index: "./plugin/lib/index.js",
    index: "./plugin/es/index.js",
    // plugin: "./es/plugin.js",
  },
  output: {
    path: path.resolve(__dirname, "./plugin/lib-webpack"),
    filename: "[name].js",
    // chunkFilename: "[name].js",
    // library: {
    //   type: "module",
    // },
    // library: "uiImportGood",
    // libraryTarget: "commonjs2",
    // library: "good",
    // libraryTarget: "umd",
  },
  mode: "none", // mode设置为node的原因是方便我们观察产物
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            // presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-modules-commonjs",
                {
                  allowTopLevelThis: true,
                  // loose: true,
                  // strict: true,
                  // lazy: true,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  // resolve: {
  //   fallback: {
  //     assert: require.resolve("assert/"),
  //   },
  // },
  plugins: [new NodePolyfillPlugin()],
  // plugins: [
  //   new webpack.optimize.CommonsChunkPlugin({
  //     name: "inline",
  //     filename: "inline.js",
  //     minChunks: Infinity,
  //   }),
  // ],
  // optimization: {
  //   splitChunks: {
  //     // chunks: "all",
  //     cacheGroups: {
  //       //   // 这里开始设置缓存的 chunks ，缓存组
  //       index: {
  //         test: /index\.js$/,
  //         chunks: "all",
  //         name: "index",
  //         filename: "index.js",
  //         enforce: true,
  //       },
  //       plugin: {
  //         test: /plugin\.js$/,
  //         chunks: "initial",
  //         name: "Plugin",
  //         // priority: 1,
  //         filename: "Plugin.js",
  //         enforce: true,
  //       },
  //     },
  //   },
  // },
  // target: "node",
};
