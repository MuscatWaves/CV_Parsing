import React, { useEffect } from "react";
import { Result } from "antd";
import "./page.css";

const PageNotFound = () => {
  useEffect(() => {
    document.title = "Page not found";
  }, []);

  return (
    <div className="not-page-found">
      <Result
        className="zoom-in-animation"
        status="404"
        title={<div className="large-text bolder">{"404"}</div>}
        subTitle={
          <div className="medium-text bolder">
            {"Sorry, the page you visited does not exist."}
          </div>
        }
      />
      <div className="copyright text-light-grey slide-in-top-animation">
        @ 2022 Copyright Powered by Oman Jobs
      </div>
    </div>
  );
};

export default PageNotFound;
