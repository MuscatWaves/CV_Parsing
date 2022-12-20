import React, { useState, useEffect } from "react";
import { m } from "framer-motion";
import Header from "../../../components/Header";
import Navigation from "../../../components/Navigation";
import { Steps, message, Button, Modal } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
import { AiFillEdit, AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { codeMonth, formatInput, string } from "../../../utilities";
import { ArrowRightOutlined } from "@ant-design/icons";
import UpdateWork from "./UpdateWork";
import "./buildEx.css";

const BuildExperience = () => {
  const dataParams = useParams();
  const [userDataLoading, setUserDataLoading] = useState("none");
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  //   States

  const [isUpdateWeModal, setUpdateWeModal] = useState(false);
  const [updateWeData, setUpdateWeData] = useState({});
  const [isDeleteWeModal, setDeleteWeModal] = useState(false);
  const [deleteWeData, setDeleteWeData] = useState("");
  const [isDeleteWeLoading, setDeleteWeLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);

  useEffect(() => {
    document.title = "CV - Experience";
  }, []);

  const deleteWorkExpData = async () => {
    var bodyFormDataDelete = new FormData();
    bodyFormDataDelete.append("id", deleteWeData.id);
    bodyFormDataDelete.append("userId", deleteWeData.id);
    setDeleteWeLoading(true);
    await axios({
      method: "DELETE",
      url: `/api/experience`,
      data: bodyFormDataDelete,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("The Work experience has been sucessfully deleted");
          setDeleteWeLoading(false);
          setDeleteWeData("");
          setDeleteWeModal(false);
          getUserData();
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
            setDeleteWeLoading(false);
          } else {
            message.error("Something Went Wrong!", "error");
            setDeleteWeLoading(false);
          }
        }
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
        setDeleteWeLoading(false);
      });
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
          setUserData(response.data.experience);
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

  const changeStep = (value) => {
    setCurrentStep(value);
    if (value === 0) {
      navigate(`/cv/update/${dataParams.id}`);
    }
    if (value === 1) {
      navigate(`/cv/update/buildEdu/${dataParams.id}`);
    }
    if (value === 3) {
      navigate(`/cv/update/buildCvPic/${dataParams.id}`);
    }
    if (value === 4) {
      navigate(`/searchcv/profile/app/${dataParams.id}`);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isUpdateWeModal && (
        <UpdateWork
          data={updateWeData}
          setData={setUpdateWeData}
          visible={isUpdateWeModal}
          toggleVisible={setUpdateWeModal}
          getUserData={getUserData}
          setPageLoading={userDataLoading}
          userId={dataParams.id}
          setUserData={setUserData}
          dataParams={dataParams}
        />
      )}
      <Modal
        title="Delete Work Experience Confirmation"
        open={isDeleteWeModal}
        onOk={() => deleteWorkExpData()}
        onCancel={() => {
          setDeleteWeData("");
          setDeleteWeModal(false);
        }}
        okText={"Delete"}
        okType={"danger"}
        confirmLoading={isDeleteWeLoading}
      >
        <p>{`Are you sure you want to delete "${deleteWeData.name}" from Experience?`}</p>
      </Modal>
      <Header />
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={dataParams.id ? "Update Resume" : "Create a resume"}
      />
      <div className="steps-holder-wrapper">
        <div className="steps-holder">
          <Steps
            progressDot
            current={currentStep}
            onChange={changeStep}
            items={[
              {
                title: (
                  <div className="bolder text-black">Personal Information</div>
                ),
                description: (
                  <div className="text-light-grey">
                    Basic Information of the candidate
                  </div>
                ),
              },
              {
                title: <div className="bolder text-black">Education</div>,
                description: (
                  <div className="text-light-grey">
                    Education details of the candidate
                  </div>
                ),
              },
              {
                title: <div className="bolder text-black">Experience</div>,
                description: (
                  <div className="text-light-grey">
                    Work Experience of the candidate
                  </div>
                ),
              },
              {
                title: "CV & Picture",
                description: "Updating the Candidate Picture & CV",
              },
              { title: "Complete Setup" },
            ]}
          ></Steps>
        </div>
      </div>
      <div className="buildCvExForm--wrapper-whole-body">
        <h1>{`Work Experience Details`}</h1>
        {(userDataLoading === "loaded" && (
          <m.div
            className="buildCvExForm--body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="buildex-bodu-button-wrapper">
              <div className="bolder text-black large-text">
                {userData.length > 0
                  ? `${userData.length} Experiences`
                  : "No Experience Added"}
              </div>
              <Button
                className="button-primary filter-modal-button no-margin-top"
                type="primary"
                onClick={() => {
                  setUpdateWeData({});
                  setUpdateWeModal(true);
                }}
              >
                <AiOutlinePlus style={{ fontSize: "22px" }} />
              </Button>
            </div>
            <div className="buildex-body">
              <div className="flex-gap-column">
                {userData.map((work) => (
                  <div key={work.id}>
                    <div className="flex-between" style={{ padding: 0 }}>
                      <div className="medium-2-text bolder text-orange">
                        {work.name && formatInput(work.name)}
                      </div>
                      <div className="flex-small-gap">
                        <AiFillEdit
                          style={{ fontSize: "22px" }}
                          onClick={() => {
                            setUpdateWeData(work);
                            setUpdateWeModal(true);
                          }}
                          className="hover-blue"
                        />
                        <AiFillDelete
                          style={{ fontSize: "22px" }}
                          className="hover-red"
                          onClick={() => {
                            setDeleteWeData(work);
                            setDeleteWeModal(true);
                          }}
                        />
                      </div>
                    </div>
                    <div className="medium-text bolder">{work.designation}</div>
                    <div className="text-light-grey bold">{`${
                      work.from_month && codeMonth(work.from_month)
                    } ${work.from_year && work.from_year}${
                      (work.from_month || work.from_year) && ` - `
                    }${work.to_month && codeMonth(work.to_month)} ${
                      work.to_month === "Present" ? "" : work.to_year
                    }`}</div>
                    <div
                      className="bold text-grey medium-text small-margin-top"
                      style={{ textAlign: "justify" }}
                    >
                      {work.description &&
                        string(work.description, userDataLoading)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="next-page-button-edu">
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                shape="round"
                onClick={() =>
                  navigate(`/cv/update/buildCvPic/${dataParams.id}`)
                }
              >
                Upload CV / Pic
              </Button>
            </div>
          </m.div>
        )) || <Loader minHeight={"65vh"} />}
      </div>
      <div className="copyright-1">@ 2022 Copyright Powered by Oman Jobs</div>
    </m.div>
  );
};

export default BuildExperience;
