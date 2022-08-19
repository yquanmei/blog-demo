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
import { addSideEffect, addDefault } from "@babel/helper-module-imports";

function winPath(path) {
  return path.replace(/\\/g, "/");
}
export default class Plugin {
  constructor(libraryName, types) {
    this.libraryName = libraryName;
    this.types = types;
  }
  // 获取内部状态，收集依赖
  getPluginState(state) {
    if (!state) {
      state = {};
    }
    return state;
  }
  // 生成import语句（核心代码）
  importMethod(methodName, file, pluginState) {
    if (!pluginState.selectedMehods[methodName]) {
      const transformdMethodName = methodName; // 如Button
      const path = winPath(join(this.libraryName, transformdMethodName));
      pluginState.selectedMehods[methodName] = addDefault(file.path, path, {
        nameHint: methodName,
      });
      // addSideEffect(file.path, `${path}/antd/${methodName}/style`)
      addSideEffect(file.path, `node_modules/antd/es/${methodName}/style`);
    }
  }
  ProgramEnter(path, state) {
    const pluginState = this.getPluginState(state);
    pluginState.specified = Object.create(null);
    pluginState.selectedMehods = Object.create(null);
    pluginState.pathsToRemove = [];
  }
  ProgramExit(path, state) {
    // 删除旧的import
    this.getPluginState(state).pathsToRemove.forEach(
      (p) => !p.removed && p.remove()
    );
  }
  // 节点的处理方法
  ImportDeclaration(path, state) {
    const { node } = path;
    if (!node) return;
    // 代码里import的包名
    const { value } = node.source; // 代码里import的包名
    const { libraryName } = this; // 配在插件options的报名
    const { types } = this; // babel-types工具函数
    const pluginState = this.getPluginState(state); // 内部状态
    // 判断是否需要使用该插件的包
    if (value === libraryName) {
      // node.specifiers表示import了什么
      node.specifiers.forEach((spec) => {
        // 判断是不是ImportSpecifier类型的节点，也就是是否是大括号的
        if (types.isImportSpecifier(spec)) {
          // 收集依赖
          // 也就是pluginState.specified.Button = Button
          // local.name是导入进来的别名，比如import {Button as MyButton} from 'antd'的MyButton
          pluginState.specified(spc.local.name) = spec.imported.name;
        } else {
          // ImportDefaultSpecifier和ImportNamespaceSpecifier
          pluginState.libraryObjs[spc.local.name] = true;
        }
      });
      // 收集旧的依赖
      pluginState.pathsToRemove.push(path);
    }
  }
}
