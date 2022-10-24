// /*
//  * @Author: yquanmei
//  * @Date: 2022-10
//  * @LastEditors: yquanmei
//  * @LastEditTime: 2022-10
//  * @FilePath: /learn-demo/webpack/perf/long-term-cache/src/index.js
//  * @Description:
//  * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
//  */
// import React from "react";
// import { createRoot } from "react-dom/client";
// const App = () => {
//   return <div>111</div>;
// };
// const appEl = document.getElementById("root");
// const root = createRoot(appEl);
// root.render(<App />, root);

import * as _ from "lodash";
import Print1 from "./print";

function component() {
  const element = document.createElement("div");

  // Lodash, now imported by this script
  element.innerHTML = _.join(["Hello", "webpack"], " ");
  // element.onclick = Print.bind(null, "Hello webpack!");
  element.onclick = Print1("Hello webpack!");

  return element;
}

document.body.appendChild(component());
