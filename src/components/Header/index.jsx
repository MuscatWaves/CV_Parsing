import React from "react";
import { Button } from "antd";
import ojimage from "../../images/oj.png";
import "./header.css";

const Header = () => {
  return (
    <div className="header">
      <img src={ojimage} className="header-image" alt="Oman jobs" />
      <Button className="header-btn" type="primary" danger>
        Logout
      </Button>
    </div>
  );
};

export default Header;
