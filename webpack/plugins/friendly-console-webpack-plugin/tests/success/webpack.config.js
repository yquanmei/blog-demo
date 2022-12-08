/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-12
 * @FilePath: /learn-demo/webpack/plugins/friendly-console-webpack-plugin/tests/success/webpack.config.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-11
 * @FilePath: /learn-demo/webpack/plugins/my-plugins/examples/example.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
const { NONAME } = require("dns");
const path = require("path");
const FriendlyConsoleWebpackPlugin = require("../..");
module.exports = {
  mode: "none",
  entry: path.join(__dirname, "./index.js"),
  output: {
    path: path.join(__dirname, "./dist"),
    publicPath: "",
    clean: true,
    filename: "[name].[contenthash].js",
  },
  module: {},
  devServer: {
    port: "7777",
  },
  plugins: [new FriendlyConsoleWebpackPlugin()],
  stats: {
    preset: "errors-warnings",
    // none: true,
    // assets: false,
    // modules: false,
    // timings: false,
    // version: false,
    // builtAt: false,
    // runtimeModules: false,
  },

  // infrastructureLogging: {
  //   appendOnly: false,
  //   level: "none",
  //   // level: "verbose",
  // },
};
