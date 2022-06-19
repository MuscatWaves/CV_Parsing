import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("../pages/Login"));
const DashBoard = lazy(() => import("../pages/DashBoard"));
const BuildCV = lazy(() => import("../pages/BuildCV"));
const SearchCV = lazy(() => import("../pages/SearchCV"));
const CVprofile = lazy(() => import("../pages/CVProfile"));

const Routing = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading</div>}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/dashboard" element={<DashBoard />}></Route>
            <Route path="/buildcv" element={<BuildCV />}></Route>
            <Route path="/searchcv" element={<SearchCV />}></Route>
            <Route path="/searchcv/profile/:id" element={<CVprofile />}></Route>
          </Routes>
        </Router>
      </Suspense>
    </div>
  );
};

export default Routing;
