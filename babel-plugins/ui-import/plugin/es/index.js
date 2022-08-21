// 作用到ast
import Plugin from "./Plugin";

export default function ({ types }) {
  let plugins = null;
  // let plugin = null;
  const libraryName = "@ichint/ichintui";
  // 将插件作用到节点上
  function applyInstance(method, args, context) {
    for (const plugin of plugins) {
      // 执行的src/index.js，共5个method
      //  ProgramEnter
      // ImportDeclaration，对应 import React from "react";
      // ImportDeclaration，对应 import { createRoot } from "react-dom/client";
      // ImportDeclaration，对应 import { Button } from "@ichint/ichintui";
      // ProgramExit
      if (plugin[method]) {
        // ./Plugin.js中得有对应的ProgramEnter, ImportDeclaration, ProgramExit方法
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
      applyInstance("ProgramEnter", arguments, this); // this：PluginClass
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
  // 插件只作用在上
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
