import Plugin from "./plugin";
export default ({ types }) => {
  let plugins = null;
  const applyInstance = (method, args, context) => {
    for (const plugin of plugins) {
      if (plugin[method]) {
        plugin[method].apply(plugin, [...args, context]);
      }
    }
  };
  const Program = {
    enter(path, { opts = {} }) {
      // 初始化插件实例
      if (!plugins) {
        plugins = new Plugin(opts.libraryName, opts.stylePath, types);
      }
      applyInstance("ProgramEnter", arguments, this);
    },
    // exit出口
    exit() {
      applyInstance("ProgramExit", arguments, this);
    },
  };
  const ret = { visitor: { Program } };
  ["ImportDeclaration", "CallExpression"].forEach((method) => {
    ret.visitor[method] = () => {
      applyInstance(method, arguments, ret.visitor);
    };
  });
  return ret;
};
