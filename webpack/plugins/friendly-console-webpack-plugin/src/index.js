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
      this.clearConsole(); // 清屏

      const hasErrors = stats.hasErrors();
      const hasWarnings = stats.hasWarnings();

      if (!hasErrors && !hasWarnings) {
        this.displaySuccess(stats);
        return;
      }
    };

    // if (compiler.hooks) {
    console.log(
      `%c !!! compiler.hooks:::`,
      "background-color: pink;font-size:14px;"
    );
    const plugin = {
      name: "FriendlyConsoleWebpackPlugin",
    };
    compiler.hooks.done.tap(plugin, doneFn);
    // const t1 = compilation.getStats();
    // console.log(`%c t1:::`, "background-color: pink;font-size:14px;", t1);
    // } else {
    //   compiler.plugin("done", doneFn);
    // }
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
