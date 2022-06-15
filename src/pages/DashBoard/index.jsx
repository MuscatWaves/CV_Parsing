import React from "react";
import ojimage from "../../images/oj.png";
import { RiUserSearchLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import "./DashBoard.css";

const DashBoard = () => {
  return (
    <div className="body">
      <img className="" src={ojimage} alt={"Oman Jobs"} />
      <div>
        <span className="welcome-message">
          <h1 className="text-orange bold">Welcome</h1>
          <h1 className="text-grey">Admin!</h1>
        </span>
        <div className="main-card">
          <div className="card">
            <RiUserSearchLine className="card-icon" />
            <h2 className="bolder">Search CV</h2>
            <p className="text-grey">
              Here, You can view all the CV with profile details.
            </p>
            <div className="go-corner" href="#">
              <div className="go-arrow">→</div>
            </div>
          </div>
          <div className="card">
            <AiOutlineUsergroupAdd className="card-icon" />
            <h2 className="bolder">Build CV</h2>
            <p className="text-grey">
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
