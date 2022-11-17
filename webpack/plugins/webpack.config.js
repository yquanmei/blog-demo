/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-11
 * @FilePath: /learn-demo/webpack/plugins/webpack.config.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */

const LogWebpackPlugin = require("./my-plugins/log-webpack-plugin");
const FriendlyConsoleWebpackPlugin = require("./my-plugins/friendly-console-webpack-plugin");

module.exports = {
  mode: "none",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }],
      },
    ],
  },
  plugins: [
    new LogWebpackPlugin(
      () => {
        // webpack 模块完成，转换成功
        console.log(
          "emit事件发生啦，所有模块的转换和代码相对应的文件已经生成好~"
        );
      },
      () => {
        console.log("done事件发生啦，构建完成");
      }
    ),
    new FriendlyConsoleWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
