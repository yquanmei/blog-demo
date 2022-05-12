/*
 * @Author: yquanmei
 * @Date: 2022-04
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-04
 */
const crossSpawn = require("cross-spawn");
const spawn = crossSpawn.sync;
const chalk = require("chalk");
const enums = require("./templates.json");

function downloadByGit(callback, template) {
  console.log(chalk.green("start download"));
  const { downloadUrl } = enums[template];
  const result = spawn(
    "git",
    ['clone', `https://github.com/${downloadUrl}.git
    { stdio: "inherit" }
  );
  const err = result.error;
  if (err) {
    console.log(chalk.red(err));
    return;
  }
  process.on('uncaughtException', () => {
    console.log('进入uncaughtException')
  })
   process.on('unhandledRejection', () => {
    console.log('进入unhandledRejection')
  })

  callback && callback();
}


module.exports = {
  downloadByGit,
  enums,
};
