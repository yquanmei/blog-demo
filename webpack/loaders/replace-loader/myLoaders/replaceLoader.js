/*
 * @Author: yquanmei
 * @Date: 2022-08
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-09
 * @FilePath: /learn-demo/webpack/loaders/replace-loader/myLoaders/replaceLoader.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
module.exports = function (source) {
  console.log(source);
  return source.replace("hello", "你好");
};
