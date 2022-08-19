// 作用到ast
import Plugin from "./Plugin";

export default function ({ types }) {
  let plugins = null;
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
        plugins = [new Plugin()];
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

  // 插件只作用在ImportDeclaration上
  ["ImportDeclaration"].forEach((method) => {
    ret.visitor[method] = function () {
      applyInstance(method, arguments, ret.visitor);
    };
  });
  return ret;
}
