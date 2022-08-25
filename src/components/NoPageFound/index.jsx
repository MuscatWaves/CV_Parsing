import React, { useEffect } from "react";
import { Result } from "antd";
import "./page.css";
import Waves from "../Waves";

const PageNotFound = () => {
  useEffect(() => {
    document.title = "Page not found";
  }, []);

  return (
    <div className="not-page-found">
      <Result
        className="zoom-in-animation"
        status="404"
        title={
          <div className="bolder" style={{ fontSize: "44px" }}>
            {"404"}
          </div>
        }
        subTitle={
          <div className="medium-text bold">
            {"Sorry, the page you visited does not exist."}
          </div>
        }
      />
      <div className="copyright text-light-grey slide-in-top-animation">
        @ 2022 Copyright Powered by Oman Jobs
      </div>
      <Waves />
    </div>
  );
};

export default PageNotFound;
