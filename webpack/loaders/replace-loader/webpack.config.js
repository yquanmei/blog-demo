/*
 * @Author: yquanmei
 * @Date: 2022-08
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-09
 * @FilePath: /learn-demo/webpack/loaders/replace-loader/webpack.config.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
module.exports = {
  mode: "none",
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
    modules: ["./node_modules", "./myLoaders"],
  },
};
