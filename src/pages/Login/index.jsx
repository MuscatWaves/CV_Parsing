import React, { useEffect, useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Input, Button, Form, message } from "antd";
import ojimage from "../../images/oj-small.png";
import FormData from "form-data";
import isEmail from "validator/lib/isEmail";
import axios from "axios";
import Cookies from "universal-cookie";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
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
    var bodyFormData = new FormData();
    bodyFormData.append("email", Email);
    bodyFormData.append("password", Password);
    bodyFormData.append("login", "login");
    await axios({
      method: "POST",
      url: `/api/login`,
      data: bodyFormData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response.status === 200 && response.data.token) {
          message.success(response.data.ok);
          cookies.set("token", response.data.token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
          });
          navigate("/dashboard");
          setLoading(false);
        } else {
          if (response.status === 201) {
            message.error(response.data.error);
            setLoading(false);
          } else {
            message.error(`Ouch, Something went terribly wrong`);
            setLoading(false);
          }
        }
      })
      .catch(function (response) {
        setLoading(false);
        message.error(response.response.data.error);
      });
  };

  return (
    <m.div
      className="login-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
      >
        <div className="login-image-container">
          <img className="oj-image" src={ojimage} alt={"Oman Jobs"} />
        </div>
        <p className="login-welcome-message">Welcome back!</p>
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
          {isLoading ? (
            <m.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              Authenticating
            </m.span>
          ) : (
            "Login"
          )}
        </Button>
      </Form>
    </m.div>
  );
};

export default Login;
