import React from "react";
import { useNavigate } from "react-router-dom";
import { AiFillCaretRight } from "react-icons/ai";
import { m } from "framer-motion";
import "./navigation.css";

const Navigation = ({
  previous_page,
  previous_path,
  current_page,
  second_path,
  third_page,
  customFilterButton,
}) => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      x: "120px",
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 40,
        damping: 9,
      },
    },
  };

  return (
    <div className="navigation-main">
      <m.div
        className="navigation-header"
        variants={container}
        animate="show"
        initial="hidden"
      >
        <m.p
          className="pointer text-grey"
          onClick={() => navigateTo(previous_path)}
        >
          {previous_page}
        </m.p>
        <m.div className="navigation-icon text-grey">
          <AiFillCaretRight />
        </m.div>
        <m.p
          className={third_page ? "pointer text-grey" : "text-orange"}
          onClick={() => third_page && navigateTo(second_path)}
          variants={item}
        >
          {current_page}
        </m.p>
        {third_page && (
          <>
            <m.div variants={item}>
              <AiFillCaretRight
                className="navigation-icon text-grey"
                variants={item}
              />
            </m.div>
            <m.p className="text-orange" variants={item}>
              {third_page}
            </m.p>
          </>
        )}
      </m.div>
      {customFilterButton && customFilterButton}
    </div>
  );
};

export default Navigation;
