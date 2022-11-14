/*
 * @Author: yquanmei
 * @Date: 2022-11
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-11
 * @FilePath: /learn-demo/webpack/plugins/my-plugins/log-webpack-plugin/index.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
class LogWebpackPlugin {
  constructor(doneCallback, emitCallback) {
    console.log(
      `%c doneCallback:::`,
      "background-color: pink;font-size:14px;",
      doneCallback
    );
    this.emitCallback = emitCallback;
    this.doneCallback = doneCallback;
  }
  apply(compiler) {
    compiler.hooks.emit.tap("LogWebpackPlugin", () => {
      // 在emit事件中回调 emitCallbackthis.emitCallback()
    });
    compiler.hooks.done.tap("LogWebpackPlugin", (err) => {
      // 在done事件中回调 doneCallbackthis.doneCallback();
    });
    compiler.hooks.compilation.tap("LogWebpackPlugin", () => {
      console.log("this compiler is starting a new compilation...");
    });
    compiler.hooks.compile.tap("LogWebpackPlugin", () => {
      console.log("the compiler is starting to compile...");
    });
  }
}
module.exports = LogWebpackPlugin;
