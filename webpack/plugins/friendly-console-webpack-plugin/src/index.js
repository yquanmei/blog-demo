/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-12
 * @FilePath: /learn-demo/webpack/plugins/friendly-console-webpack-plugin/src/index.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// const output = require("./output");
const { Compilation } = require("webpack");
const output = require("./output");
const WebpackBar = require("webpackbar");

class FriendlyConsoleWebpackPlugin {
  constructor(options) {
    options = options || {};
    this.shouldClearConsole =
      options.clearConsole == null ? true : Boolean(options.clearConsole);
  }

  apply(compiler) {
    /**
     * @description: 清屏，显示成功信息
     * @param {*} stats
     * @return {*}
     */
    const doneFn = (stats) => {
      // this.clearConsole(); // 清屏

      // console.log(
      //   `%c stats:::`,
      //   "background-color: pink;font-size:14px;"
      //   // stats.compilation.options.devServer
      // );
      const hasErrors = stats.hasErrors();
      const hasWarnings = stats.hasWarnings();

      if (!hasErrors && !hasWarnings) {
        this.displaySuccess(stats);
        return;
      }
    };
    // const invalidFn = () => {
    //   this.clearConsole();
    //   output.title("info", "WAIT", "Compiling...");
    // };

    // if (compiler.hooks) {
    // console.log(
    //   `%c !!! compiler.hooks:::`,
    //   "background-color: pink;font-size:14px;"
    // );
    // this.clearConsole();
    this.clearConsole();
    // let progressPlugin = new WebpackBar({
    //   color: "#85d", // 默认green，进度条颜色支持HEX
    //   basic: false, // 默认true，启用一个简单的日志报告器
    //   profile: false, // 默认false，启用探查器。
    // });
    // plugins.push(progressPlugin);

    const plugin = {
      name: "FriendlyConsoleWebpackPlugin",
    };
    // compiler.hooks.emit.tapAsync(
    //   {
    //     name: "FriendlyConsoleWebpackPlugin",
    //     context: true,
    //   },
    //   (context, compiler, callback) => {
    //     console.log(
    //       `%c context:::`,
    //       "background-color: pink;font-size:14px;",
    //       context
    //     );
    //     // const reportProgress = context && context.reportProgress;
    //     // if (reportProgress) reportProgress(0.95, "Starting work");
    //     // setTimeout(() => {
    //     //   if (reportProgress) reportProgress(0.95, "Done work");
    //     //   callback();
    //     // }, 1000);
    //   }
    // );
    // compiler.hooks.run.tap(plugin, (compiler) => {
    //   console.log(
    //     `%c run钩子，compiler:::`,
    //     "background-color: pink;font-size:14px;",
    //     compiler
    //   );
    // });
    // compiler.hooks.watchRun.tap(plugin, (compiler) => {
    //   console.log(
    //     `%c watchRun钩子，compiler:::`,
    //     "background-color: pink;font-size:14px;",
    //     compiler
    //   );
    // });

    // compiler.hooks.assetEmitted.tap(plugin, (file, info) => {
    //   const { content, source, outputPath, compilation, targetPath } = info;
    //   console.log(
    //     `%c assetEmitted钩子，content:::`,
    //     "background-color: pink;font-size:14px;",
    //     content
    //   );
    // });
    // compiler.hooks.emit.tapAsync(
    //   {
    //     name: "FriendlyConsoleWebpackPlugin",
    //     context: true,
    //   },
    //   (context, compiler, callback) => {
    //     const reportProgress = context && context.reportProgress;
    //     if (reportProgress) reportProgress(0.95, "Starting work");
    //     setTimeout(() => {
    //       if (reportProgress) reportProgress(0.99, "Done work");
    //       callback();
    //     }, 1000);
    //   }
    // );
    compiler.hooks.done.tap(plugin, doneFn);
    // compiler.hooks.invalid.tap(plugin, invalidFn);
    // const t1 = compilation.getStats();
    // console.log(`%c t1:::`, "background-color: pink;font-size:14px;", t1);
    // } else {
    //   compiler.plugin("done", doneFn);
    // }
    // output.title(
    //   "success",
    //   "DONE ",
    //   "Project is running at http://127.0.0.1:7000"
    // );
  }
  clearConsole() {
    if (this.shouldClearConsole) {
      output.clearConsole();
    }
  }

  displaySuccess(stats) {
    const time = isMultiStats(stats)
      ? this.getMultiStatsCompileTime(stats)
      : this.getStatsCompileTime(stats);
    output.title(
      "success",
      "DONE ",
      "webpack Compiled successfully in " + time + "ms"
    );
  }

  getStatsCompileTime(stats, statsIndex) {
    // if (statsIndex !== undefined) {
    //   // 多个stats
    //   if (this.previousEndTimes[statsIndex] === stats.endTime) {
    //     return 0;
    //   }
    //   this.previousEndTimes[statsIndex] = stats.endTime;
    // }
    return stats.endTime - stats.startTime;
  }
  getMultiStatsCompileTime(stats) {
    return stats.stats.reduce(
      (time, stats, index) =>
        Math.max(time, this.getStatsCompileTime(stats, index)),
      0
    );
  }
}

function isMultiStats(stats) {
  return stats.stats;
}

module.exports = FriendlyConsoleWebpackPlugin;
FriendlyConsoleWebpackPlugin.config = {
  clearConsole: true, // {Boolean} 是否清除控制台默认信息
};
