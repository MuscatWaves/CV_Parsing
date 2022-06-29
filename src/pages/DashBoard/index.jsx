import React, { useState, useEffect } from "react";
import ojimage from "../../images/oj.png";
import { RiUserSearchLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd, AiOutlinePoweroff } from "react-icons/ai";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { RiFileUserLine } from "react-icons/ri";
import { TbFileUpload } from "react-icons/tb";
import { FiUserX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken";
import { Button, message } from "antd";
import Cookies from "universal-cookie";
import Authentication from "../../components/Authentication";
import "./DashBoard.css";

const DashBoard = () => {
  const [hoverState, setHoverState] = useState({
    card1: "",
    card2: "",
    card3: "",
    card4: "",
    card5: "",
    card6: "",
  });
  const [isLoggedIn, setLoggedIn] = useState({});

  const cookies = new Cookies();
  const token = cookies.get("token");

  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  const cards = [
    {
      id: 1,
      name: "card1",
      icon: TbFileUpload,
      title: "Upload CV",
      description: "To upload bulk CV's for parsing",
      permission: isLoggedIn.ucaccess === "0" ? true : false,
      path: "/Dashboard",
    },
    {
      id: 2,
      name: "card2",
      icon: FiUserX,
      title: "Rejected CV",
      description: "Here are the list of the Rejected CV by API.",
      permission: isLoggedIn.rcaccess === "0" ? true : false,
      path: "/rejectedcv",
    },
    {
      id: 3,
      name: "card3",
      icon: RiUserSearchLine,
      title: "Search CV",
      description: "Here, You can view all the CV with profile details.",
      permission: isLoggedIn.scaccess === "0" ? true : false,
      path: "/searchcv",
    },
    {
      id: 4,
      name: "card4",
      icon: RiFileUserLine,
      title: "Build CV",
      description: "Here you can Create CV for Jobseeker or Modify the CV.",
      permission: isLoggedIn.bcaccess === "0" ? true : false,
      path: "/buildcv",
    },
    {
      id: 5,
      name: "card5",
      icon: AiOutlineUsergroupAdd,
      title: "Add/Manage User",
      description:
        "Here you can add/manage account to provide the access to this dashboard.",
      permission: isLoggedIn.type === "1" ? true : false,
      path: "/userManage",
    },
    {
      id: 6,
      name: "card6",
      icon: HiOutlineDocumentReport,
      title: "User Report",
      description:
        "Here you can View the User Report. How many CV uploaded by user.",
      permission: isLoggedIn.type === "1" ? true : false,
      path: "/userReport",
    },
  ];

  useEffect(() => {
    if (token) {
      try {
        var user = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
        setLoggedIn(user);
      } catch (err) {}
    }
  }, [token]);

  const removeCookie = () => {
    const cookies = new Cookies();
    cookies.set("token", "", { path: "/", expires: new Date(Date.now()) });
    message.success("Logged Out");
    navigateTo("/");
  };

  const checkNumberOfCards = () =>
    cards.filter((card) => card?.permission).length;

  return (
    <div className="dashboard">
      <Authentication />
      <div className="dashboard-lg">
        <Button
          className="header-log-out-btn"
          type="primary"
          danger
          onClick={removeCookie}
          shape={"round"}
        >
          <AiOutlinePoweroff className="large-text" />
        </Button>
      </div>
      <div className="dashboard-body">
        <div>
          <img className="oj-image-dashboard" src={ojimage} alt={"Oman Jobs"} />
        </div>
        <div>
          <span className="welcome-message">
            <h1 className="text-orange bold">Welcome</h1>
            <h1 className="text-grey">{isLoggedIn.name}</h1>
          </span>
          <div
            className={
              checkNumberOfCards() > 4 ? "main-card grid-3" : "main-card"
            }
          >
            {cards.map(
              (card) =>
                card.permission && (
                  <div
                    key={card.id}
                    className="card"
                    onMouseEnter={() =>
                      setHoverState((hover) => ({
                        ...hover,
                        [card.name]: "hover",
                      }))
                    }
                    onMouseLeave={() =>
                      setHoverState((hover) => ({ ...hover, [card.name]: "" }))
                    }
                    onClick={() => navigateTo(card.path)}
                  >
                    <card.icon
                      className={
                        hoverState[card.name]
                          ? "card-icon"
                          : "card-icon text-orange"
                      }
                    />
                    <h2 className={`bolder ${hoverState[card.name]}`}>
                      {card.title}
                    </h2>
                    <p
                      className={
                        hoverState[card.name]
                          ? hoverState[card.name]
                          : "text-light-grey"
                      }
                    >
                      {card.description}
                    </p>
                    <div className="go-corner" href="#">
                      <div className="go-arrow">→</div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default DashBoard;
