import React, { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Input, Button, Form, message } from "antd";
import ojimage from "../../images/oj.png";
import "./Login.css";
import FormData from "form-data";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import axios from "axios";

const Login = () => {
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const Email = values["email"];
    const Password = values["password"];
    setLoading(true);
    if (!isEmail(Email)) {
      message.error("Please Enter a valid Email");
      setLoading(false);
      return;
    }

    if (!isStrongPassword(Password)) {
      message.error(
        "Password must contains one upper case, one lower case, one numeric digit, minimum 8 characters, one special character"
      );
      setLoading(false);
      return;
    }

    var bodyFormData = new FormData();
    bodyFormData.append("email", Email);
    bodyFormData.append("password", Password);
    bodyFormData.append("Login", Password);
    await axios({
      method: "POST",
      url: `/api/login.php`,
      data: bodyFormData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        console.log(response);
        if (response.status === 200 && response.data.token) {
          setLoading(false);
          message.error("Login Successfull, Redirecting...", "success");
        } else {
          if (response.status === 201) {
            setLoading(false);
            message.error(response.data.error, "error");
          } else {
            setLoading(false);
            message.error("Something Went Wrong!", "error");
          }
        }
      })
      .catch(function (response) {
        setLoading(false);
        message.error("Something Went Wrong!", "error");
      });
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
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your Email!",
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
          loading={isLoading}
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
