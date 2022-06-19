import React from "react";
import { Button, message } from "antd";
import ojimage from "../../images/oj.png";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Authentication from "../../components/Authentication";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  const removeCookie = () => {
    const cookies = new Cookies();
    cookies.set("token", "", { path: "/", expires: new Date(Date.now()) });
    message.success("Logged Out");
    navigateTo("/");
  };

  return (
    <div className="header">
      <img
        src={ojimage}
        className="header-image"
        alt="Oman jobs"
        onClick={() => navigateTo("/dashboard")}
      />
      <Authentication />
      <Button
        className="header-btn"
        type="primary"
        danger
        onClick={removeCookie}
      >
        Logout
      </Button>
    </div>
  );
};

export default Header;
