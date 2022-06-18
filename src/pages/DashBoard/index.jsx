import React, { useState } from "react";
import ojimage from "../../images/oj.png";
import { RiUserSearchLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";
import { Button } from "antd";

const DashBoard = () => {
  const [hoverState, setHoverState] = useState({
    card1: "",
    card2: "",
    card3: "",
    card4: "",
    card5: "",
    card6: "",
  });

  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const cards = [
    {
      id: 1,
      name: "card1",
      icon: RiUserSearchLine,
      title: "Search CV",
      description: "Here, You can view all the CV with profile details.",
      permission: true,
      path: "/searchcv",
    },
    {
      id: 2,
      name: "card2",
      icon: AiOutlineUsergroupAdd,
      title: "Build CV",
      description: "Here you can Create CV for Jobseeker or Modify the CV.",
      permission: true,
      path: "/buildcv",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-lg">
        <Button type="primary" danger>
          Logout
        </Button>
      </div>
      <div className="dashboard-body">
        <img className="oj-image-dashboard" src={ojimage} alt={"Oman Jobs"} />
        <div>
          <span className="welcome-message">
            <h1 className="text-orange bold">Welcome</h1>
            <h1 className="text-grey">Admin!</h1>
          </span>
          <div className="main-card">
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
                    <RiUserSearchLine className="card-icon" />
                    <h2 className={`bolder ${hoverState[card.name]}`}>
                      {card.title}
                    </h2>
                    <p
                      className={
                        hoverState[card.name]
                          ? hoverState[card.name]
                          : "text-grey"
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
