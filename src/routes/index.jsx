import React, { lazy, Suspense } from "react";
import { LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "../components/Loader";
import ScrollToTop from "./ScrollToTop";

const Login = lazy(() => import("../pages/Login"));
const DashBoard = lazy(() => import("../pages/DashBoard"));
const BuildCV = lazy(() => import("../pages/BuildCV/PersonalInfo"));
const SearchCV = lazy(() => import("../pages/SearchCV"));
const CVprofile = lazy(() => import("../pages/CVProfile"));
const UserManage = lazy(() => import("../pages/UserManage"));
const UserReport = lazy(() => import("../pages/UserReport"));
const RejectedCV = lazy(() => import("../pages/RejectedCV"));
const UploadCV = lazy(() => import("../pages/UploadCV"));
const PageNotFound = lazy(() => import("../components/NoPageFound"));
const NotAuthorize = lazy(() => import("../components/NotAuthorize"));
const BuildEducation = lazy(() => import("../pages/BuildCV/BuildEducation"));
const BuildExperience = lazy(() => import("../pages/BuildCV/BuildExperience"));

const Routing = () => {
  return (
    <div>
      <Suspense fallback={<Loader minHeight={"80vh"} />}>
        <Router>
          <AnimatePresence>
            <LazyMotion features={domAnimation}>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Login />}></Route>
                <Route path="/dashboard" element={<DashBoard />}></Route>
                <Route path="/cv/create" element={<BuildCV />}></Route>
                <Route path="/cv/update/:id" element={<BuildCV />}></Route>
                <Route path="/searchcv" element={<SearchCV />}></Route>
                <Route
                  path="/searchcv/profile/:type/:id"
                  element={<CVprofile />}
                ></Route>
                <Route path="/cv/:id/:name" element={<CVprofile />}></Route>
                <Route path="/userManage" element={<UserManage />}></Route>
                <Route path="/userReport" element={<UserReport />}></Route>
                <Route path="/rejectedcv" element={<RejectedCV />}></Route>
                <Route path="/uploadcv" element={<UploadCV />}></Route>
                <Route path="/notAuthorized" element={<NotAuthorize />}></Route>
                <Route
                  path="/cv/update/buildEdu/:id"
                  element={<BuildEducation />}
                ></Route>
                <Route
                  path="/cv/update/buildEx/:id"
                  element={<BuildExperience />}
                ></Route>
                <Route path="*" element={<PageNotFound />}></Route>
              </Routes>
            </LazyMotion>
          </AnimatePresence>
        </Router>
      </Suspense>
    </div>
  );
};

export default Routing;
