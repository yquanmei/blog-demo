/*
 * @Author: yquanmei
 * @Date: 2022-08
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-08
 * @FilePath: /learn-demo/babel-plugins/ui-import/plugin/es-b2b/Plugin.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// 修改ast
import { join } from "path";
import { addSideEffect, addDefault } from "@babel/helper-module-imports";

function transCamelFirst(_str) {
  const str = _str[0].toLowerCase() + _str.substr(1);
  return str;
}
function transCamel(_str, symbol) {
  const str = _str[0].toLowerCase() + _str.substr(1);
  return str.replace(/([A-Z])/g, ($1) => `${symbol}${$1.toLowerCase()}`);
}
function winPath(path) {
  return path.replace(/\\/g, "/");
}

const libraryObjsArr = ["Icon"];
export default class Plugin {
  constructor({ libraryName, types }) {
    this.libraryName = libraryName;
    this.types = types;
  }
  // 获取内部状态，收集依赖
  _getPluginState(state) {
    if (!state) {
      state = {};
    }
    return state;
  }
  // 生成import语句（核心代码）
  _importMethod(methodName, file, pluginState, objectType) {
    const excludedMethodNames = ["Icon"];

    if (
      !objectType &&
      !pluginState.selectedmethods[methodName] &&
      !excludedMethodNames.includes(methodName)
    ) {
      let transformdMethodName = methodName;
      switch (methodName) {
        case "zhCN":
          break;
        default:
          transformdMethodName = transCamelFirst(methodName);
          const transformdMethodNameForStyle = transCamel(methodName, "-");
          addSideEffect(
            file.path,
            `antd/es/${transformdMethodNameForStyle}/style`
          );
          break;
      }
      const libraryDirectory = "src/components";
      const path = winPath(
        join(this.libraryName, libraryDirectory, transformdMethodName)
      );
      pluginState.selectedmethods[methodName] = addDefault(file.path, path, {
        nameHint: methodName,
      });
    }
    if (objectType === "Icon") {
      let realLibraryName = "@ant-design/icons";
      let transformdMethodName = methodName;
      const path = winPath(join(realLibraryName, transformdMethodName));
      pluginState.selectedmethods[methodName] = addDefault(file.path, path, {
        nameHint: methodName,
      });
    }
    return { ...pluginState.selectedmethods[methodName] };
  }
  _handleDeclarator(node, prop, path, state) {
    const file = (path && path.hub && path.hub.file) || (state && state.file);
    const pluginState = this._getPluginState(state);
    const types = this.types;
    const checkScope = (targetNode) =>
      pluginState.specified[targetNode.name] && // eslint-disable-line
      path.scope.hasBinding(targetNode.name) && // eslint-disable-line
      path.scope.getBinding(targetNode.name).path.type === "ImportSpecifier"; // eslint-disable-line

    if (types.isIdentifier(node[prop]) && checkScope(node[prop])) {
      node[prop] = this._importMethod(
        pluginState.specified[node[prop].name],
        file,
        pluginState
      ); // eslint-disable-line
    } else if (types.isSequenceExpression(node[prop])) {
      node[prop].expressions.forEach((expressionNode, index) => {
        if (types.isIdentifier(expressionNode) && checkScope(expressionNode)) {
          node[prop].expressions[index] = this._importMethod(
            pluginState.specified[expressionNode.name],
            file,
            pluginState
          ); // eslint-disable-line
        }
      });
    }
  }

  ProgramEnter(path, state) {
    const pluginState = this._getPluginState(state);
    pluginState.specified = Object.create(null);
    pluginState.selectedmethods = Object.create(null);
    pluginState.libraryObjs = Object.create(null);
    pluginState.pathsToRemove = [];
  }
  ProgramExit(path, state) {
    this._getPluginState(state).pathsToRemove.forEach(
      (p) => !p.removed && p.remove()
    );
  }
  // 节点的处理方法
  ImportDeclaration(path, state) {
    const { node } = path;
    if (!node) return;
    const { value } = node.source;
    const { libraryName } = this;
    const { types } = this;
    const pluginState = this._getPluginState(state);
    if (value === libraryName) {
      node.specifiers.forEach((spec) => {
        if (types.isImportSpecifier(spec)) {
          if (libraryObjsArr.includes(spec.local.name)) {
            pluginState.libraryObjs[spec.local.name] = true;
          } else {
            pluginState.specified[spec.local.name] = spec.imported.name;
          }
        } else {
          pluginState.libraryObjs[spec.local.name] = true;
        }
      });
      pluginState.pathsToRemove.push(path);
    }
  }
  CallExpression(path, state) {
    const { node } = path;
    const file = (path && path.hub && path.hub.file) || (state && state.file);

    const { name } = node.callee;
    const { types } = this;
    const pluginState = this._getPluginState(state);
    if (types.isIdentifier(node.callee)) {
      if (pluginState.specified[name]) {
        node.callee = this._importMethod(
          pluginState.specified[name],
          file,
          pluginState
        );
      }
    }

    // 遍历 arguments 找我们要的 specifier
    node.arguments = node.arguments.map((arg) => {
      const argName = arg?.name;
      if (
        pluginState.specified[argName] &&
        path.scope.hasBinding(argName) &&
        path.scope.getBinding(argName).path.type === "ImportSpecifier"
      ) {
        return this._importMethod(
          pluginState.specified[argName],
          file,
          pluginState
        );
      }
      return arg;
    });
  }
  MemberExpression(path, state) {
    let node = path.node;
    const file = (path && path.hub && path.hub.file) || (state && state.file);
    const pluginState = this._getPluginState(state);
    if (!node?.object || !node?.object?.name) return;

    if (pluginState?.libraryObjs?.[node.object.name]) {
      path.replaceWith(
        this._importMethod(
          node.property.name,
          file,
          pluginState,
          node.object.name
        )
      );
    } else if (
      pluginState?.specified?.[node.object.name] &&
      path?.scope?.hasBinding(node.object.name)
    ) {
      const _path$scope$getBindin = path.scope.getBinding(node.object.name),
        scope = _path$scope$getBindin.scope;
      if (scope.path.parent.type === "File") {
        node.object = this._importMethod(
          pluginState.specified[node.object.name],
          file,
          pluginState
        );
      }
    }
  }
  Property(path, state) {
    const node = path.node;
    return this._handleDeclarator(node, "value", path, state);
  }
}
