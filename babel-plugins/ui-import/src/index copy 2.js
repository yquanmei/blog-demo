import { ConfigProvider, zhCN } from "@ichint/ichintui";

// 创建app根节点
const appEl = document.getElementById("root");
// 最新版本使用的是ReactDOM.createRoot
// 如果使用ReactDOM.render()控制台会报warnning错误
const root = ReactDOM.createRoot(appEl);

// 渲染
root.render(
  <div className="App">
    <ConfigProvider locale={zhCN}></ConfigProvider>
  </div>
);
