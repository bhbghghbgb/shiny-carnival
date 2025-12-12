import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";
import { useLoginPage } from "../hooks/useloginPage";

/**
 * Component form đăng nhập, dùng hook riêng để tách logic
 */
const LoginForm: React.FC = () => {
  const { form, loading, handleSubmit } = useLoginPage();

  return (
    <Form
      form={form}
      name="login"
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
      className="w-full"
    >
      <Form.Item
        label="Tên đăng nhập"
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Nhập tên đăng nhập"
          size="large"
          className="rounded-xl"
        />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Nhập mật khẩu"
          size="large"
          className="rounded-xl"
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        block
        size="large"
        loading={loading}
        className="rounded-xl shadow-md mt-2"
      >
        Đăng nhập
      </Button>
    </Form>
  );
};

export default LoginForm;
