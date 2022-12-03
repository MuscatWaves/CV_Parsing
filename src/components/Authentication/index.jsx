import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const cookies = new Cookies();
  const token = cookies?.get("token");

  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (!token) {
      navigateTo("/notAuthorized");
    }
  });

  return <></>;
};

export default Authentication;
