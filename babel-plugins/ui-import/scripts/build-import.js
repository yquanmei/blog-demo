/*
 * @Author: yquanmei
 * @Date: 2022-07
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-08
 * @FilePath: /learn-demo/babel-plugins/ui-import/scripts/build.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
const babel = require("@babel/core");
const path = require("path");

const file = path.resolve(__dirname, "../src/index.js");
// const obj = babel.transformFileSync(file, {
//   presets: ["@babel/preset-env", "@babel/preset-react"],
//   plugins: [
//     [
//       // path.resolve(__dirname, "../lib/index.js"),
//       "import",
//       {
//         libraryName: "antd",
//         // libraryDirectory: "src/components",
//         style: true,
//       },
//     ],
//   ],
// });
// 产物
// "use strict";

// require("antd/lib/button/style");

// var _button = _interopRequireDefault(require("antd/lib/button"));

// function _interopRequireDefault(obj) {
//   return obj && obj.__esModule ? obj : { default: obj };
// }

// ReactDOM.render(
//   /*#__PURE__*/ React.createElement(_button["default"], null, "xxxx")
// );

const obj = babel.transformFileSync(file, {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    [
      // path.resolve(__dirname, "../lib/index.js"),
      // path.resolve(__dirname, "../plugin/lib-gulp/index.js"),
      path.resolve(__dirname, "../plugin/lib-babel-plugin-import/index.js"),
      {
        libraryName: "@ichint/ichintui",
        libraryDirectory: "src/components",
        style: true,
      },

      // {
      //   libraryName: "@ichint/ichintui",
      //   libraryDirectory: "src/components",
      //   style: (name, file) => {
      //     const realName = name.split("/").pop();
      //     // console.log(
      //     //   `%c realName:::`,
      //     //   "background-color: pink;font-size:14px;",
      //     //   realName
      //     // );
      //     return `antd/es/${realName}/style`;
      //     // // name::: @ichint/ichintui/src/components/menu
      //   },
      // },
    ],
  ],
});

console.log(obj.code);
