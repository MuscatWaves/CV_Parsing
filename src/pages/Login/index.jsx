import React, { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Input, Button, Form } from "antd";
import ojimage from "../../images/oj.png";
import "./Login.css";

const Login = () => {
  const [turnOn, setTurnOn] = useState(false);

  const handleSubmit = (values) => {
    console.log(values);
    setTurnOn(!turnOn);
  };

  return (
    <div className="body">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
      >
        <img className="oj-image" src={ojimage} alt={"Oman Jobs"} />
        <p className="oj-title">Log in to CV Parser</p>
        <div className="name-bodies">
          <p className="name-title">Email</p>
          <Form.Item
            className="input-primary"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              size="large"
              htmlType="email"
            />
          </Form.Item>
        </div>
        <div className="name-bodies">
          <p className="name-title">Password</p>
          <Form.Item
            className="input-primary"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              size="large"
            />
          </Form.Item>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          className="button-primary"
          size="large"
          loading={turnOn}
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
