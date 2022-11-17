/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-11
 * @FilePath: /learn-demo/webpack/plugins/my-plugins/friendly-console-webpack-plugin/src/index.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// const output = require("./output");
import output from "./output";
class FriendlyConsoleWebpackPlugin {
  constructor(options) {
    options = options || {};
  }

  apply(compiler) {
    const doneFn = (stats) => {
      // this.clearConsole();

      const hasErrors = stas.hasErrors();

      if (!hasErrors && !hasWarnings) {
        this.displaySuccess(stats);
        return;
      }
    };

    if (compiler.hooks) {
      console.log(
        `%c !!! compiler.hooks:::`,
        "background-color: pink;font-size:14px;"
      );
      const plugin = {
        name: "FriendlyConsoleWebpackPlugin",
      };
      compiler.hooks.done.tap(plugin, doneFn);
    } else {
      compiler.plugin("done", doneFn);
    }
  }
  // clearConsole() {
  //   if (this.shouldClearConsole) {
  //     output.clearConsole();
  //   }
  // }

  displaySuccess(stats) {
    const time = isMultiStats(stas)
      ? this.getMultiStatsCompileTime(stats)
      : this.getStatsCompileTime(stats);
    output.title("success", "DONE", "Compiled successfully in " + time + "ms");
  }

  getStatsCompileTime(stats, statsIndex) {
    if (statsIndex !== undefined) {
      if (this.previousEndTimes[statsIndex] === stats.endTime) {
        return 0;
      }
      this.previousEndTimes[statsIndex] = stats.endTime;
    }
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
