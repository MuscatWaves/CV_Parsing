import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "../components/Loader";

const Login = lazy(() => import("../pages/Login"));
const DashBoard = lazy(() => import("../pages/DashBoard"));
const BuildCV = lazy(() => import("../pages/BuildCV"));
const SearchCV = lazy(() => import("../pages/SearchCV"));
const CVprofile = lazy(() => import("../pages/CVProfile"));
const UserManage = lazy(() => import("../pages/UserManage"));

const Routing = () => {
  return (
    <div>
      <Suspense fallback={<Loader />}>
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
