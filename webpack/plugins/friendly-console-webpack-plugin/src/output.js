/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-12
 * @FilePath: /learn-demo/webpack/plugins/friendly-console-webpack-plugin/src/output.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// const chalk = require("chalk");

// const { default: chalk } = await import("chalk");
// const colors = require("./utils/colors");

const chalk = require("chalk");
const colors = require("./utils/colors");
const stringWidth = require("string-width");
const readline = require("readline");
const stripAnsi = require("strip-ansi");

class Debuger {
  constructor() {
    this.enabled = true;
    this.capturing = false;
    this.capturedMessages = [];
  }

  title(severity, title, subtitle) {
    if (this.enabled) {
      const date = new Date();
      this.log("\n");
      const dateString = chalk.grey(date.toLocaleTimeString());
      const titleFormatted = colors.formatTitle(severity, title);
      const subTitleFormatted = colors.formatText(severity, subtitle);
      const message = `${titleFormatted}${subTitleFormatted}`;

      let logSpace =
        process.stdout.columns - stringWidth(message) - stringWidth(dateString);
      if (logSpace <= 0) {
        logSpace = 10;
      }

      this.log(`${message}${" ".repeat(logSpace)}${dateString}`);
      this.log();
    }
  }
  clearConsole() {
    if (!this.capturing && this.enabled && process.stdout.isTTY) {
      const blank = "\n".repeat(process.stdout.rows);
      console.log(blank);
      readline.cursorTo(process.stdout, 0, 0); // 清空控制台（不是清空原有控制台内容，而是清屏，接下来的内容，显示在一屏的首行(类似于在控制台输入clear)
      readline.clearScreenDown(process.stdout);
    }
  }
  log() {
    if (this.enabled) {
      this._captureConsole(Array.from(arguments), console.log);
    }
  }
  _captureConsole(args, method) {
    if (this.capturing) {
      this.capturedMessages.push(stripAnsi(args.join(" ")).trim());
    } else {
      method.apply(console, args);
    }
  }
}

module.exports = new Debuger();
