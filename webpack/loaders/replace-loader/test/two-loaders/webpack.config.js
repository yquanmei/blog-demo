/*
 * @Author: yquanmei
 * @Date: 2022-08
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-12
 * @FilePath: /learn-demo/webpack/loaders/replace-loader/test/two-loaders/webpack.config.js
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
        use: [
          "replaceLoader",
          {
            loader: "replaceLoaderAsync",
            options: {
              name: "good",
            },
          },
        ],
      },
    ],
  },
  resolveLoader: {
    modules: ["./node_modules", "./src"],
  },
};
