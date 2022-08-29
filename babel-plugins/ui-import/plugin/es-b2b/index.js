/*
 * @Author: yquanmei
 * @Date: 2022-08
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-08
 * @FilePath: /learn-demo/babel-plugins/ui-import/plugin/es-b2b/index.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// 作用到ast
import Plugin from "./Plugin";

export default function ({ types }) {
  let plugins = null;
  const libraryName = "@ichint/ichintui";
  // 将插件作用到节点上
  function applyInstance(method, args, context) {
    for (const plugin of plugins) {
      if (plugin[method]) {
        plugin[method].apply(plugin, [...args, context]);
      }
    }
  }
  const Program = {
    // ast入口
    enter(path, { opts = {} }) {
      // 初始化插件实例
      if (!plugins) {
        plugins = [new Plugin({ libraryName, types })];
      }
      applyInstance("ProgramEnter", arguments, this);
    },
    // ast出口
    exit() {
      applyInstance("ProgramExit", arguments, this);
    },
  };
  const ret = {
    visitor: {
      Program,
    },
  };
  // 插件
  const methods = [
    "ImportDeclaration",
    "CallExpression",
    "Property",
    "MemberExpression",
  ];
  methods.forEach((method) => {
    ret.visitor[method] = function () {
      applyInstance(method, arguments, ret.visitor);
    };
  });
  return ret;
}
