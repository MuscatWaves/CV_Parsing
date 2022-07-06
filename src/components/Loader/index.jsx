import { Spin } from "antd";
import React, { useEffect } from "react";
import ojimage from "../../images/oj.png";
import "./loader.css";

const Loader = ({ minHeight }) => {
  useEffect(() => {
    document.title = "Loading";
  }, []);

  return (
    <div className="loading-data" style={{ minHeight: minHeight }}>
      <div className="inner-loading-data">
        <img src={ojimage} className="loader-image" alt="Oman jobs" />
        <Spin size="large" />
      </div>
    </div>
  );
};

export default Loader;
