import React, { useState } from "react";
import ojimage from "../../images/oj.png";
import { RiUserSearchLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import "./DashBoard.css";

const DashBoard = () => {
  const [hoverStateCard1, setHoverStateCard1] = useState("");
  const [hoverStateCard2, setHoverStateCard2] = useState("");

  return (
    <div className="body">
      <img className="" src={ojimage} alt={"Oman Jobs"} />
      <div>
        <span className="welcome-message">
          <h1 className="text-orange bold">Welcome</h1>
          <h1 className="text-grey">Admin!</h1>
        </span>
        <div className="main-card">
          <div
            className="card"
            onMouseEnter={() => setHoverStateCard1("hover")}
            onMouseLeave={() => setHoverStateCard1("")}
          >
            <RiUserSearchLine className="card-icon" />
            <h2 className={`bolder ${hoverStateCard1}`}>Search CV</h2>
            <p className={hoverStateCard1 ? hoverStateCard1 : "text-grey"}>
              Here, You can view all the CV with profile details.
            </p>
            <div className="go-corner" href="#">
              <div className="go-arrow">→</div>
            </div>
          </div>
          <div
            className="card"
            onMouseEnter={() => setHoverStateCard2("hover")}
            onMouseLeave={() => setHoverStateCard2("")}
          >
            <AiOutlineUsergroupAdd className="card-icon" />
            <h2 className={`bolder ${hoverStateCard2}`}>Build CV</h2>
            <p className={hoverStateCard2 ? hoverStateCard2 : "text-grey"}>
              Here you can Create CV for Jobseeker or Modify the CV.
            </p>
            <div className="go-corner" href="#">
              <div className="go-arrow">→</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
