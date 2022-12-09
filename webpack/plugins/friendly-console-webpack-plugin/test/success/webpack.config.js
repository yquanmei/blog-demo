/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-12
 * @FilePath: /learn-demo/webpack/plugins/friendly-console-webpack-plugin/test/success/webpack.config.js
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
const path = require("path");
const FriendlyConsoleWebpackPlugin = require("../..");

const WebpackBar = require("webpackbar");

let progressPlugin = new WebpackBar({
  color: "#85d", // 默认green，进度条颜色支持HEX
  basic: false, // 默认true，启用一个简单的日志报告器
  profile: false, // 默认false，启用探查器。
});

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
    // ipc: true,
    // client: {
    //   logging: "verbose",
    // },
  },
  plugins: [
    new FriendlyConsoleWebpackPlugin(),
    new WebpackBar({
      // color: "#85d", // 默认green，进度条颜色支持HEX
      // basic: false, // 默认true，启用一个简单的日志报告器
      // profile: false, // 默认false，启用探查器。
      // fancy: false,
      basic: true,
    }),
  ],
  stats: {
    // preset: "errors-warnings",
    preset: "none",
    // none: true,
    // assets: false,
    // modules: false,
    // timings: false,
    // version: true,
    // builtAt: true,
    // runtimeModules: false,
    // env: false,
    errors: true,
    warnings: true,
    // logging: "none",
  },

  // infrastructureLogging: {
  //   appendOnly: false,
  //   level: "none",
  //   // level: "verbose",
  // },
};
