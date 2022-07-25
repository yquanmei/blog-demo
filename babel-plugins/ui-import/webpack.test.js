/*
 * @Author: yquanmei
 * @Date: 2022-07
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-07
 * @FilePath: /learn-demo/babel-plugins/ui-import/webpack.test.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./test/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    // chunkFilename: "[name].js",
    // library: {
    //   type: "module",
    // },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              [
                path.resolve(__dirname, "./lib/index.js"),
                {
                  libraryName: "@ichint/ichintui",
                  libraryDirectory: "src/components",
                  style: (name, file) => {
                    const realName = name.split("/").pop();
                    // console.log(
                    //   `%c realName:::`,
                    //   "background-color: pink;font-size:14px;",
                    //   realName
                    // );
                    return `antd/es/${realName}/style`;
                    // // name::: @ichint/ichintui/src/components/menu
                  },
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
        include: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".less"],
  },
  // experiments: {
  //   outputModule: true,
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./test/index.html",
      clean: true,
    }),
  ],
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    hot: true,
  },
};
