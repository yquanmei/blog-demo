/*
 * @Author: yquanmei
 * @Date: 2022-08
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-12
 * @FilePath: /learn-demo/webpack/loaders/replace-loader/src/replaceLoader.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
module.exports = function (source) {
  console.log(
    `%c process.env:::`,
    "background-color: pink;font-size:14px;",
    process.env.COMPANY_NAME
  );
  console.log(source);
  switch (process.env.COMPANY_NAME) {
    case "网络":
      return source.replace("hello", "你好，这是网络");
    case "居家":
      return source.replace("hello", "你好，这是居家");
    default:
      return source;
  }
};
