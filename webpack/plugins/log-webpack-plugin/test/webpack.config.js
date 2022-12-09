/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-12
 * @FilePath: /learn-demo/webpack/plugins/log-webpack-plugin/test/webpack.config.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
const path = require("path");
const LogWebpackPlugin = require("../src/index");

module.exports = {
  mode: "none",
  entry: path.join(__dirname, "./index.js"),
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
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
