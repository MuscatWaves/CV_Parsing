import { Spin } from "antd";
import React, { useEffect } from "react";
import ojimage from "../../images/oj.png";
import { m } from "framer-motion";
import "./loader.css";

const Loader = ({ minHeight }) => {
  useEffect(() => {
    document.title = "Loading";
  }, []);

  return (
    <m.div
      className="loading-data"
      style={{ minHeight: minHeight }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <div className="inner-loading-data">
        <img src={ojimage} className="loader-image" alt="Oman jobs" />
        <Spin size="large" />
      </div>
    </m.div>
  );
};

export default Loader;
