/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-11
 * @FilePath: /learn-demo/webpack/plugins/my-plugins/friendly-console-webpack-plugin/src/output.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// const chalk = require("chalk");

// const { default: chalk } = await import("chalk");
// const colors = require("./utils/colors");

import chalk from "chalk";
import colors from "./utils/colors";

class Debuger {
  constructor() {
    this.enabled = true;
  }
  title(severity, title, subtitle) {
    if (this.enabled) {
      const date = new Date();
      const dateString = chalk.grey(date.toLocaleTimeString());
      const titleFormatted = colors.formateTitle(severity, title);
    }
  }
}

module.exports = new Debuger();
