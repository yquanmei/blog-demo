/*
 * @Author: yquanmei
 * @Date: 2022-07
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-07
 * @FilePath: /test-babel-plugins/src/index.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@ichint/ichintui";
const App = () => {
  return <Button type="primary">hello world</Button>;
};

const root = document.getElementById("root");
createRoot(root).render(<App />);
