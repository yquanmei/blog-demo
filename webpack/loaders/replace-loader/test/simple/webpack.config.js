/*
 * @Author: yquanmei
 * @Date: 2022-12
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-12
 * @FilePath: /learn-demo/webpack/loaders/replace-loader/test/simple/webpack.config.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
const path = require("path");

module.exports = {
  mode: "none",
  entry: path.join(__dirname, "./index.js"),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["replaceLoader"],
      },
    ],
  },
  resolveLoader: {
    // 解析loader的路径
    modules: ["./node_moduels", "./src"],
  },
};
