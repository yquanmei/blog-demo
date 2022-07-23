/*
 * @Author: yquanmei
 * @Date: 2022-07
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-07
 * @FilePath: /learn-demo/babel-plugins/plugin/jsx-transform.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
module.exports = function ({ types: t }) {
  return {
    visitor: {
      // 处理 JSXElement
      JSXElement(path) {
        // 得到当前 JSX的节点结构
        const node = path.node;

        // JSXOpeningElement
        const { openingElement } = node;
        // 获取这个JSX标签的名字
        const tagName = openingElement.name.name;
        // 不考虑 JSX上的props，直接传递null
        const attributes = t.nullLiteral();

        // React
        const reactIdentifier = t.identifier("React");
        // createElement
        const createElementIdentifier = t.identifier("createElement");

        // React.createElement
        const callee = t.memberExpression(
          reactIdentifier,
          createElementIdentifier
        );
        // 调用React.createElement需要传递的参数
        const args = [t.stringLiteral(tagName), attributes];

        // 生成React.createElement('xxx', null, children)
        const callRCExpression = t.callExpression(callee, args);
        callRCExpression.arguments = callRCExpression.arguments.concat(
          path.node.children
        );

        // 用生成的createElement结构替换之前的jsx结构
        path.replaceWith(callRCExpression, path.node);
      },
      // 处理 JSXText 节点
      JSXText(path) {
        const nodeText = path.node.value;
        // 直接用 string 替换 原来的节点
        path.replaceWith(t.stringLiteral(nodeText), path.node);
      },
    },
  };
};
