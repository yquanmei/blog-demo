/*
 * @Author: yquanmei
 * @Date: 2022-08
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-08
 * @FilePath: /learn-demo/babel-plugins/ui-import/src/index.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
import React from "react";
import { Form, Input, Space, Button } from "@ichint/ichintui";
// import { Form, Input, Space, Button } from "antd";

const { TextArea } = Input;

const Reply = (props) => {
  return (
    <Form form={form} name="reply">
      <Form.Item
        name="remark"
        label="审批意见"
        rules={[
          {
            required: true,
            message: "请输入审批意见",
          },
        ]}
      >
        <TextArea
          showCount={true}
          maxLength={200}
          style={{ width: "350px" }}
        ></TextArea>
      </Form.Item>
      <Button>1</Button>
    </Form>
  );
};

export default Reply;
