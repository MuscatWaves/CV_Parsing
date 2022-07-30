import React, { useEffect, useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Input, Button, Form, message } from "antd";
import ojimage from "../../images/oj.png";
import "./Login.css";
import FormData from "form-data";
import isEmail from "validator/lib/isEmail";
import axios from "axios";
import Cookies from "universal-cookie";
import { m } from "framer-motion";

const Login = () => {
  useEffect(() => {
    document.title = "Login";
  }, []);

  const [isLoading, setLoading] = useState(false);
  const cookies = new Cookies();
  const handleSubmit = async (values) => {
    const Email = values["email"];
    const Password = values["password"];
    setLoading(true);
    if (!isEmail(Email)) {
      message.error("Please Enter a valid Email");
      setLoading(false);
      return;
    }

    message.info("Authentication in progress");

    var bodyFormData = new FormData();
    bodyFormData.append("email", Email);
    bodyFormData.append("password", Password);
    bodyFormData.append("login", "login");
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
        if (response.status === 200 && response.data.token) {
          message.success("Login Successfull, Redirecting...", "success");
          cookies.set("token", response.data.token.token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
          });
          window.location.replace("/dashboard");
          setLoading(false);
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
            setLoading(false);
          } else {
            message.error("Something Went Wrong!", "error");
            setLoading(false);
          }
        }
      })
      .catch(function (response) {
        setLoading(false);
        message.error("Something Went Wrong!", "error");
      });
  };

  return (
    <m.div
      className="login-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
              placeholder="Email"
              size="large"
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
            <Input.Password
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
    </m.div>
  );
};

export default Login;
