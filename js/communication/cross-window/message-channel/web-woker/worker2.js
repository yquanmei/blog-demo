/*
 * @Author: yquanmei
 * @Date: 2022-12
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-12
 * @FilePath: /learn-demo/js/communication/cross-window/message-channel/web-woker/worker2.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
onmessage = function (e) {
  console.log("2,Message received from main script");
  var workerResult = "2,Result: " + e.data[0] * e.data[1];
  console.log("2,Posting message back to main script");
  postMessage(workerResult);
};
