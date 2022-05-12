#!/usr/bin/env node

const chalk = require("chalk");
const commander = require("commander");
const semver = require("semver"); // npm的语义版本包
const fs = require("fs-extra");
const inquirer = require('inquirer');
// const ora = require('ora');
// const { currentPath } = require("../utils");
const { downloadByGit, enums } = require("../src/downloadTemplates");
const packageJson = require("../package.json");
const requiredNodeVersion = packageJson.engines.node;
// let tempName;
// let projectName;
// let forceDel = false;
// let inputIndex;
// let templateName;

// 检测node版本
async function checkNodeVersion(wanted, cliName) {
  // 检测node版本是否符合要求范围
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        "You are using Node" +
          process.version +
          ", but this version of " +
          cliName +
          "requires Node" +
          wanted +
          ".\nPlease upgratde your Node version."
      )
    );
    process.exit(1);
  }
}
checkNodeVersion(requiredNodeVersion, "web-cli");

// 列出支持的项目模板 ls
commander
  .name("list")
  .option("-l, --list", "支持的模板名及模板简介", () => {
    let lists = enums;
    console.log("支持的模板名：", Object.keys(lists));
    console.log("模板简介：", Object.keys(lists).map(item => `${item}(${enums[item].description})`).join(','));
    process.exit(1);
  });

commander.parse(process.argv)

// 列出模板类型
const choices = Object.keys(enums);
inquirer
  .prompt([
  {
    type: 'rawlist',
    name: 'template',
    choices,
    message: 'What template do you need?'
  }
])
.then(ans => {
  create(ans.template);
})

// 下载文件
async function create(downloadUrl) {
  try {
    // 若不存在，直接从git下载
    downloadByGit('', downloadUrl);
  } catch (err) {
    console.log(chalk.red(err));
    process.exit(1);
  }
}



// commander
//   .version("v" + packageJson.version, "-v, --version")
//   .arguments("<templateName>")
//   .arguments("<projectName")
//   .alias("cp")
//   .description("create ichint project")
//   .action(function (index, name) {
//     console.log("index:", index);
//     console.log("name:", name);
//     inputIndex = index;
//     templateName = index;
//     // projectName = name;
//     if (templateName) {
      // create('ichint-umi-pc', commander.force);
//     } else {
//       console.log(`the template ${inputIndex} you want download do not exist`);
//     }
//   });
// commander.parse(process.argv);







// commander
//   .version("v" + packageJson.version, "-v, --version")
//   .arguments("<templateName>")
//   .arguments("<projectName")
//   .alias("cp")
//   .description("create ichint project")
//   .action(function (index, name) {
//     console.log("index:", index);
//     console.log("name:", name);
//     inputIndex = index;
//     templateName = index;
//     // projectName = name;
//     if (templateName) {
//       create(templateName, commander.force);
//     } else {
//       console.log(`the template ${inputIndex} you want download do not exist`);
//     }
//   });
// commander.parse(process.argv);

// 处理非法命令
// commander.arguments("<command>").action((cmd) => {
//   // 不退出输出帮助信息
//   commander.outputHelp();
//   console.log(chalk.red(`Unkown command ${chalk.yellow(cmd)}.`));
// });

// 参数
// 帮助信息 --h -help

// 支持的命令(智能匹配命令)

// 列出支持的项目模板 ls

// 文件操作、模板操作
// 创建文件
// async function create(temp, project, force = false) {
//   tempName = temp;
//   projectName = project;
//   forceDel = force;
//   const file = currentPath + projectName;
//   try {
//     // 检测项目文件夹是否已经存在
//     const res = await fs.pathExists(file);
//     // 若存在
//     if (res) {
//       if (forceDel) {
//         console.log(chalk.green("force remove the exist directory"));
//         await fs.remove(file);
//         // 模板下载
//         downloadByGit(renameFile, tempName);
//       } else {
//         console.log(
//           chalk.red(
//             "Error, In this directory, the project name already exsites !"
//           )
//         );
//         console.log(
//           chalk.green("you can use option -f to force delete the directory !")
//         );
//       }
//     }
//     // 若不存在，直接从git下载
//     downloadByGit(renameFile, tempName);
//   } catch (err) {
//     console.log(chalk.red(err));
//   }
// }
// async function create(temp, project, force = false) {
//   tempName = temp;
//   projectName = project;
//   forceDel = force;
//   const file = currentPath + projectName;
//   try {
//     // 检测项目文件夹是否已经存在
//     const res = await fs.pathExists(file);
//     // 若存在
//     if (res) {
//       if (forceDel) {
//         console.log(chalk.green("force remove the exist directory"));
//         await fs.remove(file);
//         // 模板下载
//         downloadByGit(renameFile, tempName);
//       } else {
//         console.log(
//           chalk.red(
//             "Error, In this directory, the project name already exsites !"
//           )
//         );
//         console.log(
//           chalk.green("you can use option -f to force delete the directory !")
//         );
//       }
//     }
//     // 若不存在，直接从git下载
//     downloadByGit(renameFile, tempName);
//   } catch (err) {
//     console.log(chalk.red(err));
//   }
// }


// 重命名gitclone 下来的文件为项目文件名
// async function renameFile() {
//   const oldPath = currentPath + tempName;
//   const nowPath = currentPath + projectName;
// }
