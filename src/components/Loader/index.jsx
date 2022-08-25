import React, { useEffect } from "react";
import ojimage from "../../images/oj-small.png";
import { LazyMotion, domAnimation, AnimatePresence, m } from "framer-motion";
import "./loader.css";
import Spinner from "../Spinner";

const Loader = ({ minHeight }) => {
  useEffect(() => {
    document.title = "Loading";
  }, []);

  return (
    <AnimatePresence>
      <LazyMotion features={domAnimation}>
        <m.div
          className="loading-data"
          style={{ minHeight: minHeight }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inner-loading-data">
            <img
              src={ojimage}
              className="loader-image"
              alt="Oman jobs"
              loading="lazy"
            />
          </div>
          <Spinner />
        </m.div>
      </LazyMotion>
    </AnimatePresence>
  );
};

export default Loader;
