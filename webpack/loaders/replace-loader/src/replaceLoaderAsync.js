/*
 * @Author: yquanmei
 * @Date: 2022-09
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-09
 * @FilePath: /learn-demo/webpack/loaders/replace-loader/myLoaders/replaceLoaderAsync.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
module.exports = function (source) {
  console.log(this.query);
  const callback = this.async();
  setTimeout(() => {
    const result = source.replace("jiayou", "hello");
    callback(null, result);
  }, 3000);
};
