<!--
 * @Author: yquanmei
 * @Date: 2022-07
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-08
 * @FilePath: /learn-demo/babel-plugins/ui-import/README.md
 * @Description: 
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved. 
-->
# 文件目录
```
|- plugin # babel插件
|- scripts
|- src # 项目文件
|- webpack.config.js # 打包项目
```
# 项目调试
npm i
.vscode/launch.json中添加debug的配置
vscode点debug按钮启动

## 调试方式
### npm方式
.vscode/launch.json
```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-node",
      "request": "launch",
      "name": "plugin test",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}/webpack.config.js",
      "cwd": "${workspaceFolder}",
      "restart": true,
      "console": "integratedTerminal",
      "runtimeArgs": [
        "run-script",
        "build"
      ],
    }
  ]
}
```


### 直接运行文件的方式
.vscode/launch.json
```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-node",
      "request": "launch",
      "name": "plugin test",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}/scripts/build.js",
      "cwd": "${workspaceFolder}",
      "restart": true,
      "console": "integratedTerminal",   
    }
  ]
}
```

# 运行命令
`npm run build`：启动项目（以引入插件的方式启动项目）
`npm run build:plugin`: 打包插件

# 项目使用流程
- es 文件夹下编写插件
- `npm run build:plugin:gulp`  // 打包插件
- `npm run build`  // 启动项目