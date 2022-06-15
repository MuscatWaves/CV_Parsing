import React, { useState } from "react";
import {
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Input, Button } from "antd";
import ojimage from "../../images/oj.png";
import "./Login.css";
import { RiLockPasswordLine } from "react-icons/ri";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [turnOn, setTurnOn] = useState(false);

  return (
    <div className="body">
      <div className="login-body">
        <img className="oj-image" src={ojimage} />
        <p className="oj-title">Log in to CV Parser</p>
        <div className="name-bodies">
          <p className="name-title">Email</p>
          <Input
            className="input-primary"
            size="large"
            type={"email"}
            placeholder={"Enter your email"}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            prefix={<UserOutlined />}
            style={{ fontWeight: "600" }}
          ></Input>
        </div>
        <div className="name-bodies">
          <p className="name-title">Password</p>
          <Input
            className="input-primary"
            type={"password"}
            size="large"
            placeholder="Enter your password"
            prefix={<RiLockPasswordLine />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="button-primary"
          size="large"
          loading={turnOn}
          onClick={() => {
            console.log(userName, userPassword);
            setTurnOn(!turnOn);
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
