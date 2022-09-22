/*
 * @Author: yquanmei
 * @Date: 2022-08
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-08
 * @FilePath: /learn-demo/chrome-plugins/cdsn-copy-code/js/popup.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// 这里的js其实是操作popup.html产生的dom的
document.addEventListener("DOMContentLoaded", function () {
  // 获取开关按钮的初始值。这里{ type: 'get_editable' }是可以随意定义的，可以传递任何你想传递的信息
  sendMessageToContentScript({ type: "get_editable" }, (response) => {
    toggle.checked = ["true", true].includes(response) ? "checked" : null;
  });

  // 切换contentEditable状态
  toggle.addEventListener("change", () => {
    sendMessageToContentScript({ type: "toggle" });
  });
});

// 向content_scripts发送消息的函数
function sendMessageToContentScript(message, callback) {
  // 这里用到了tabs，所以前面配置文件需要配置"permissions": ["tabs"]
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
      if (callback) callback(response);
    });
  });
}
