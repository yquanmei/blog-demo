/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-11
 * @FilePath: /learn-demo/webpack/plugins/friendly-console-webpack-plugin/src/utils/colors.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
const chalk = require("chalk");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function bgColor(severity) {
  const color = textColor(severity);
  return "bg" + capitalizeFirstLetter(color);
}
function formatTitle(severity, message) {
  return chalk[bgColor(severity)].black("", message, "");
}
function formatText(severity, message) {
  return chalk[textColor(severity)](message);
}
function textColor(severity) {
  switch (severity.toLowerCase()) {
    case "success":
      return "green";
    case "info":
      return "blue";
    case "note":
      return "white";
    case "warning":
      return "yellow";
    case "error":
      return "red";
    default:
      return "red";
  }
}

module.exports = {
  textColor,
  bgColor,
  formatTitle,
  formatText,
};
