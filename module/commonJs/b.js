const say = require("./a");
const object = {
  name: "JavaScript大魔王",
  author: "aSuncat",
};
console.log("我是 b 文件");
console.log("打印 a 模块", say);

setTimeout(() => {
  console.log("异步打印 a 模块", say);
}, 0);

module.exports = function () {
  return object;
};
