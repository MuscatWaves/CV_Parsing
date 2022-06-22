import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import backgroundImage from "../images/main-background.webp";

const Login = lazy(() => import("../pages/Login"));
const DashBoard = lazy(() => import("../pages/DashBoard"));
const BuildCV = lazy(() => import("../pages/BuildCV"));
const SearchCV = lazy(() => import("../pages/SearchCV"));
const CVprofile = lazy(() => import("../pages/CVProfile"));
const UserManage = lazy(() => import("../pages/UserManage"));

const Routing = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <img src={backgroundImage} alt="Oman Jobs" />
          </div>
        }
      >
        <Router>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/dashboard" element={<DashBoard />}></Route>
            <Route path="/buildcv" element={<BuildCV />}></Route>
            <Route path="/searchcv" element={<SearchCV />}></Route>
            <Route path="/searchcv/profile/:id" element={<CVprofile />}></Route>
            <Route path="/userManage" element={<UserManage />}></Route>
          </Routes>
        </Router>
      </Suspense>
    </div>
  );
};

export default Routing;
