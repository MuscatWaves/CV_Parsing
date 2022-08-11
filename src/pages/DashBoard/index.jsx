import React, { useState, useEffect } from "react";
import ojimage from "../../images/oj-small.png";
import { AiOutlinePoweroff } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken";
import { Button } from "antd";
import Cookies from "universal-cookie";
import Authentication from "../../components/Authentication";
import { m } from "framer-motion";
import "./DashBoard.css";
import { removeCookie } from "../../utilities";
import { animate, cards, c_animate, c_intial, intial } from "./constants";

const DashBoard = () => {
  const [isLoggedIn, setLoggedIn] = useState({});
  const cookies = new Cookies();
  const token = cookies.get("token");
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    document.title = "Dashboard";
    if (token) {
      try {
        var user = token && jwt.verify(token, process.env.REACT_APP_JWT_KEY);
        setLoggedIn(user.data[0]);
      } catch (err) {}
    }
  }, [token]);

  const checkNumberOfCards = () =>
    cards(isLoggedIn).filter((card) => card?.permission).length;

  return (
    <m.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Authentication />
      <div className="dashboard-lg">
        <Button
          className="header-log-out-btn"
          type="primary"
          danger
          onClick={() => removeCookie(navigateTo)}
          shape={"round"}
        >
          <AiOutlinePoweroff className="large-text" />
        </Button>
      </div>
      <div className="dashboard-body">
        <m.div initial={intial} animate={animate}>
          <img className="oj-image-dashboard" src={ojimage} alt={"Oman Jobs"} />
        </m.div>
        <m.div initial={c_intial} animate={c_animate}>
          <m.span className="welcome-message">
            <h1 className="text-orange bold">Welcome</h1>
            <h1 className="text-grey">{isLoggedIn.name}</h1>
          </m.span>
          <m.div
            className={
              checkNumberOfCards() > 4 ? "main-card grid-3" : "main-card"
            }
          >
            {cards(isLoggedIn).map(
              (card, index) =>
                card.permission && (
                  <m.div
                    key={card.id}
                    className="card"
                    onClick={() => navigateTo(card.path)}
                  >
                    <div className="dash-card-icon">
                      <card.icon style={{ fontSize: "40px" }} />
                    </div>
                    <h2>{card.title}</h2>
                    <p>{card.description}</p>
                    <div className="go-corner" href="#">
                      <div className="go-arrow">→</div>
                    </div>
                  </m.div>
                )
            )}
          </m.div>
        </m.div>
      </div>
      <div className="copyright text-grey">
        @ 2022 Copyright Powered by Oman Jobs
      </div>
    </m.div>
  );
};

export default DashBoard;
