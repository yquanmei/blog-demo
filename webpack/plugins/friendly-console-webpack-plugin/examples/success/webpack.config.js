/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-11
 * @FilePath: /learn-demo/webpack/plugins/friendly-console-webpack-plugin/examples/success/webpack.config.js
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
const FriendlyConsoleWebpackPlugin = require("../../");
module.exports = {
  mode: "none",
  entry: path.join(__dirname, "./example.js"),
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
  // plugins: [new FriendlyConsoleWebpackPlugin()],
};
