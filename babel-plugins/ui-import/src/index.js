import React from "react";
import { Button, Affix, Icon } from "@ichint/ichintui";
// import { DownloadOutlined } from "@ant-design/icons";
const { DownloadOutlined } = Icon;

import ReactDOM from "react-dom/client";

const appEl = document.getElementById("root");
const root = ReactDOM.createRoot(appEl);

root.render(
  <Button type="primary" icon={<DownloadOutlined />}>
    按钮
  </Button>
);
