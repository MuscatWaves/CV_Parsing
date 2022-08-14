import React, { useState, useEffect } from "react";
import { m } from "framer-motion";
import Header from "../../../components/Header";
import Navigation from "../../../components/Navigation";
import { Steps, message, Divider, Button } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
import { checkImageIcon, checkWhichFile, showPdf } from "../../../utilities";
import FileUpload from "../../../components/FileUpload";
import "./updateCvPic.css";

const UpdateCvPic = () => {
  const dataParams = useParams();
  const [userDataLoading, setUserDataLoading] = useState("none");
  const { Step } = Steps;
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [isCvPicModal, toggleCvPicModal] = useState(false);
  const [cvPicType, setCvPicType] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(3);

  const changeStep = (value) => {
    setCurrentStep(value);
    if (value === 0) {
      navigate(`/cv/update/${dataParams.id}`);
    }
    if (value === 1) {
      navigate(`/cv/update/buildEdu/${dataParams.id}`);
    }
    if (value === 2) {
      navigate(`/cv/update/buildEx/${dataParams.id}`);
    }
  };

  const getUserData = async () => {
    setUserDataLoading("loading");
    await axios({
      method: "GET",
      url: `/api/cv/${dataParams.id}`,
      headers: {
        Authorization: token,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setUserData(response.data.user[0]);
          setUserDataLoading("loaded");
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
            setUserDataLoading("loaded");
          } else {
            message.error("Something Went Wrong!", "error");
            setUserDataLoading("loaded");
          }
        }
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
      });
  };

  useEffect(() => {
    getUserData(); // eslint-disable-next-line
  }, []);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FileUpload
        isUploadModal={isCvPicModal}
        toggleUploadModal={toggleCvPicModal}
        userId={dataParams.id}
        dataParams={dataParams}
        setUserData={setUserData}
        setLoading={setUserDataLoading}
        getUserData={getUserData}
        cvPicType={cvPicType}
        userData={userData}
        showPdf={showPdf}
      />
      <Header />
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={dataParams.id ? "Update Resume" : "Create a resume"}
      />
      <div className="steps-holder-wrapper">
        <div className="steps-holder">
          <Steps progressDot current={currentStep} onChange={changeStep}>
            <Step
              title={
                <div className="bolder text-black">Personal Information</div>
              }
              description={
                <div className="text-light-grey">
                  Basic Information of the candidate
                </div>
              }
            />
            <Step
              title={<div className="bolder text-black">Education</div>}
              description={
                <div className="text-light-grey">
                  Education details of the candidate
                </div>
              }
            />
            <Step
              title={<div className="bolder text-black">Experience</div>}
              description={
                <div className="text-light-grey">
                  Work Experience of the candidate
                </div>
              }
            />
            <Step
              title={
                <div className="bolder text-black">Upload CV & Picture</div>
              }
              description={
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    navigate(`/searchcv/profile/app/${dataParams.id}`);
                  }}
                >
                  Complete Setup
                </Button>
              }
            />
          </Steps>
        </div>
      </div>
      <div className="buildCvExForm--wrapper-whole-body">
        <h1>{`Upload CV / Profile Picture`}</h1>
        {(userDataLoading === "loaded" && (
          <m.div
            className="buildCvPicForm--body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="flex-small-gap1-column"
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <div className="flex-small-gap" style={{ margin: "2rem 0" }}>
                <Button
                  className="button-primary grid-last-btn"
                  type="primary"
                  onClick={() => {
                    setCvPicType("dp");
                    toggleCvPicModal(true);
                  }}
                >
                  {userData.image
                    ? "Update Profile Picture"
                    : "Upload Profile Picture"}
                </Button>
                <Button
                  className="button-primary grid-last-btn"
                  type="primary"
                  onClick={() => {
                    setCvPicType("cv");
                    toggleCvPicModal(true);
                  }}
                >
                  {userData.cv ? "Update CV" : "Upload CV"}
                </Button>
              </div>
              <div className="medium-text text-grey bolder">
                Current Profile Picture
              </div>
              <div>
                <img
                  className={"cvprofile-picture"}
                  src={
                    userData.image
                      ? `/files/images/${userData.image}`
                      : checkImageIcon(userData.gender)
                  }
                  alt="user"
                  width={"170px"}
                  height={"170px"}
                />
              </div>
            </div>
            <Divider />
            <div>
              <div className="medium-text text-grey bolder">
                Current Uploaded CV
              </div>
              <div
                style={{
                  margin: "20px",
                  width:
                    (checkWhichFile(userData.cv) === "docx" ||
                      checkWhichFile(userData.cv) === "doc") &&
                    "40vw",
                }}
              >
                {checkWhichFile(userData.cv) === "pdf" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      type="primary"
                      onClick={() =>
                        showPdf(
                          `https://cvparse.fra1.cdn.digitaloceanspaces.com/files/cv/${userData.cv}#view=fitH`,
                          setCvLoading
                        )
                      }
                      loading={cvLoading}
                    >
                      View Original PDF
                    </Button>
                  </div>
                )}
                {(checkWhichFile(userData.cv) === "docx" ||
                  checkWhichFile(userData.cv) === "doc") && (
                  <iframe
                    title={"DOC file for Candidate Resume"}
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=https://cvparse.fra1.cdn.digitaloceanspaces.com/files/cv/${userData.cv}`}
                    width="100%"
                    height="800px"
                    frameborder="0"
                  ></iframe>
                )}
                {userData.cv === "" && (
                  <div className="medium-text text-light-grey">
                    No CV uploaded
                  </div>
                )}
              </div>
            </div>
          </m.div>
        )) || <Loader minHeight={"65vh"} />}
      </div>
      <div className="copyright-1">@ 2022 Copyright Powered by Oman Jobs</div>
    </m.div>
  );
};

export default UpdateCvPic;
