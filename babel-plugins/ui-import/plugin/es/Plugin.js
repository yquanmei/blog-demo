/*
 * @Author: yquanmei
 * @Date: 2022-08
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-08
 * @FilePath: /learn-demo/babel-plugins/ui-import/plugin/es/Plugin.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// 修改ast
import { join } from "path";
import { addSideEffect } from "@babel/helper-module-imports";

export default class Plugin {
  constructor(types) {
    (this.libraryName = "@ichint/ichint-ui"), (this.types = types);
  }
}
