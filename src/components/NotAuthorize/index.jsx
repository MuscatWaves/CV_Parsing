import React, { useEffect } from "react";
import { Result, Button } from "antd";
import "../NoPageFound/page.css";
import { useNavigate } from "react-router-dom";

const NotAuthorize = () => {
  useEffect(() => {
    document.title = "Page not found";
  }, []);

  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="not-page-found">
      <Result
        className="zoom-in-animation"
        status="403"
        title={<div className="large-text bolder">{"403"}</div>}
        subTitle={
          <div className="medium-text bolder">
            {"Sorry, you are not authorized to access this page."}
          </div>
        }
        extra={
          <Button type="primary" onClick={() => navigateTo("/")}>
            Back To Login
          </Button>
        }
      />
      <div className="copyright text-light-grey slide-in-top-animation">
        @ 2022 Copyright Powered by Oman Jobs
      </div>
    </div>
  );
};

export default NotAuthorize;
