import { Button, Form, Input, Modal } from "@ichint/ichintui";

/**样式 */
import styles from "./login.less";

const Login = () => {
  return (
    <div className={styles.loginContent}>
      <Form
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        className={styles.loginForm}
        form={formInstance}
        onValuesChange={() => setError("")}
      >
        <Form.Item
          name="userName"
          getValueFromEvent={(e) => e.target.value.trim()}
        >
          <Input
            placeholder="请输入用户名"
            autoComplete="off"
            className={styles.commonInput}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
