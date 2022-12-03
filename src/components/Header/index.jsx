import React from "react";
import { Button } from "antd";
import ojimage from "../../images/oj-small.png";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Authentication from "../../components/Authentication";
import jwt from "jsonwebtoken";
import { AiOutlinePoweroff } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { removeCookie } from "../../utilities";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies?.get("token");
  const navigateTo = (path) => {
    navigate(path);
  };
  const user =
    (token && jwt?.verify(token, process.env.REACT_APP_JWT_KEY)) || "";

  return (
    <div className="header">
      <img
        src={ojimage}
        className="header-image"
        alt="Oman jobs"
        onClick={() => navigateTo("/dashboard")}
      />
      <Authentication />
      <div className="flex-small-gap">
        <FiUser className="large-text text-light-grey" />
        <div className="text-light-grey bolder">
          {user?.data ? user.data[0].name : ""}
        </div>
        <Button
          className="header-log-out-btn"
          type="primary"
          danger
          onClick={() => removeCookie(navigate)}
          shape={"round"}
          title={"Log Off"}
        >
          <AiOutlinePoweroff className="large-text" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
