module.exports = function () {
  const getMes = require("./b");
  console.log("我是a文件");
  const message = getMes();
  console.log(message);
};
