import React from "react";
import { message } from "antd";
import Cookies from "universal-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");

  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (!token) {
      navigateTo("/");
      message.error("You need to login first!");
    }
  });

  return <></>;
};

export default Authentication;
