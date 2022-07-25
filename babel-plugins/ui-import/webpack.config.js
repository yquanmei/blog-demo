/*
 * @Author: yquanmei
 * @Date: 2022-07
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-07
 * @FilePath: /learn-demo/babel-plugins/ui-import/webpack.config.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
const path = require("path");

module.exports = {
  entry: {
    index: "./es/index.js",
    // plugin: "./es/plugin.js",
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js",
    // chunkFilename: "[name].js",
    // library: {
    //   type: "module",
    // },
  },
  mode: "none", // mode设置为node的原因是方便我们观察产物
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [],
          },
        },
      },
    ],
  },
  // experiments: {
  //   outputModule: true,
  // },
};
