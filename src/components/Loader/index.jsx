import { Spin } from "antd";
import React from "react";
import ojimage from "../../images/oj.png";
import "./loader.css";

const Loader = () => {
  return (
    <div className="loading-data">
      <div className="inner-loading-data">
        <img src={ojimage} className="loader-image" alt="Oman jobs" />
        <Spin size="large" />
      </div>
    </div>
  );
};

export default Loader;
