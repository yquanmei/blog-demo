/*
 * @Author: yquanmei
 * @Date: 2022-07
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-08
 * @FilePath: /learn-demo/babel-plugins/ui-import/src/index cop.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// import { Button } from "@ichint/ichintui";
// ReactDOM.render(<Button>xxxx</Button>);

import { Form, Input, Modal, Icon } from "@ichint/ichintui";
import { Button } from "antd";

const { DownloadOutlined } = Icon;
const { Item: FormItem } = Form;

const Login = () => {
  return (
    <>
      <Form>
        <FormItem />
      </Form>
      <Button type="primary" size="small" icon={<DownloadOutlined />}>
        下载
      </Button>
    </>
  );
};
export default Login;
