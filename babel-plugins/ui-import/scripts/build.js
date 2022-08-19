/*
 * @Author: yquanmei
 * @Date: 2022-07
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-07
 * @FilePath: /learn-demo/babel-plugins/ui-import/scripts/build.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
const babel = require("@babel/core");
const path = require("path");

const file = path.resolve(__dirname, "../src/index.js");

const obj = babel.transformFileSync(file, {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    [
      // path.resolve(__dirname, "../plugin/lib/index.js"),
      path.resolve(__dirname, "../lib/index.js"),
      // path.resolve(__dirname, "../plugin/es/index.js"),
      // "./plugin/lib/index.js",
      // "./plugin/es/index.js",
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
});

console.log(obj.code);
