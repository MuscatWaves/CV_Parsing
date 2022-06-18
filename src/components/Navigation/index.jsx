import React from "react";
import { useNavigate } from "react-router-dom";
import { AiFillCaretRight } from "react-icons/ai";
import "./navigation.css";

const Navigation = ({ previous_page, previous_path, current_page }) => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="navigation-header">
      <p
        className="pointer text-grey"
        onClick={() => navigateTo(previous_path)}
      >
        {previous_page}
      </p>
      <AiFillCaretRight className="navigation-icon text-grey" />
      <p className="text-orange">{current_page}</p>
    </div>
  );
};

export default Navigation;
