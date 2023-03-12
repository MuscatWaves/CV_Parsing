import React, { useState, useEffect } from "react";
import { m } from "framer-motion";
import Header from "../../../components/Header";
import Navigation from "../../../components/Navigation";
import { Steps, message, Button, Modal, notification } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
import { AiFillEdit, AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { codeMonth, formatInput } from "../../../utilities";
import UpdateEducation from "./UpdateEducation";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./buildEdu.css";

const BuildEducation = () => {
  const dataParams = useParams();
  const [userDataLoading, setUserDataLoading] = useState("none");
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  //   States

  const [isUpdateEduModal, setUpdateEduModal] = useState(false);
  const [updateEduData, setUpdateEduData] = useState({});
  const [isDeleteEduModal, setDeleteEduModal] = useState(false);
  const [deleteEduData, setDeleteEduData] = useState("");
  const [isDeleteEduLoading, setDeleteEduLoading] = useState(false);

  useEffect(() => {
    document.title = "CV - Education";
  }, []);

  const deleteEducationData = async () => {
    var bodyFormDataDelete = new FormData();
    bodyFormDataDelete.append("id", deleteEduData.id);
    setDeleteEduLoading(true);
    await axios({
      method: "DELETE",
      url: `/api/education`,
      data: bodyFormDataDelete,
      headers: {
        Authorization: token,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("The education has been sucessfully deleted");
          setDeleteEduLoading(false);
          setDeleteEduModal(false);
          setDeleteEduData("");
          getUserData();
        } else {
          if (response.status === 201) {
            message.error(response.data.error);
            setDeleteEduLoading(false);
          } else {
            message.error("Something Went Wrong!");
            setDeleteEduLoading(false);
          }
        }
      })
      .catch(function (response) {
        message.error("Something Went Wrong!");
        setDeleteEduLoading(false);
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
          setUserData(response.data.education);
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

  const changeStep = (value) => {
    setCurrentStep(value);
    if (value === 0) {
      navigate(`/cv/update/${dataParams.id}`);
    }
    if (value === 2) {
      navigate(`/cv/update/buildEx/${dataParams.id}`);
    }
    if (value === 3) {
      navigate(`/cv/update/buildCvPic/${dataParams.id}`);
    }
    if (value === 4) {
      navigate(`/searchcv/profile/app/${dataParams.id}`);
    }
  };

  useEffect(() => {
    getUserData(); // eslint-disable-next-line
  }, []);

  const displayError = () =>
    notification.error({
      message: (
        <div className="bold text-red">
          {"Unable to proceed on creation of this profile"}
        </div>
      ),
      description: (
        <div className="bolder">{"Please have atleast 1 education added"}</div>
      ),
      duration: 6,
    });

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isUpdateEduModal && (
        <UpdateEducation
          data={updateEduData}
          setData={setUpdateEduData}
          visible={isUpdateEduModal}
          toggleVisible={setUpdateEduModal}
          getUserData={getUserData}
          setPageLoading={setUserDataLoading}
          userId={dataParams.id}
          dataParams={dataParams}
          setUserData={setUserData}
        />
      )}
      <Modal
        title="Delete Education Confirmation"
        open={isDeleteEduModal}
        onOk={deleteEducationData}
        onCancel={() => {
          setDeleteEduData("");
          setDeleteEduModal(false);
        }}
        okText={"Delete"}
        okType={"danger"}
        confirmLoading={isDeleteEduLoading}
      >
        <p>{`Are you sure you want to delete "${deleteEduData.name}" from Education?`}</p>
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
            onChange={(value) =>
              userData?.length < 1 ? displayError() : changeStep(value)
            }
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
                title: "Experience",
                description: "Work Experience of the candidate",
              },
              {
                title: "CV & Picture",
                description: "Updating the Candidate Picture & CV",
              },
              {
                title: "Complete Setup",
              },
            ]}
          ></Steps>
        </div>
      </div>
      <div className="buildCvEduForm--wrapper-whole-body">
        <h1>{`Education Details`}</h1>
        {(userDataLoading === "loaded" && (
          <m.div
            className="buildCvEduForm--body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="buildedu-bodu-button-wrapper">
              <div className="bolder text-black large-text">
                {userData.length > 0
                  ? `${userData.length} Educations`
                  : "No Educations Added"}
              </div>
              <Button
                className="button-primary filter-modal-button no-margin-top"
                type="primary"
                onClick={() => {
                  setUpdateEduData({});
                  setUpdateEduModal(true);
                }}
              >
                <AiOutlinePlus style={{ fontSize: "22px" }} />
              </Button>
            </div>
            <div className="buildedu-body">
              <div className="flex-gap-column">
                {userData.map((education) => (
                  <div key={education.id}>
                    <div className="flex-between" style={{ padding: 0 }}>
                      <div className="medium-text bolder text-orange">
                        {formatInput(education.name)}
                      </div>
                      <div className="flex-small-gap">
                        <AiFillEdit
                          className="hover-blue"
                          style={{ fontSize: "22px" }}
                          onClick={() => {
                            setUpdateEduData(education);
                            setUpdateEduModal(true);
                          }}
                        />
                        <AiFillDelete
                          className="hover-red"
                          style={{ fontSize: "22px" }}
                          onClick={() => {
                            setDeleteEduData(education);
                            setDeleteEduModal(true);
                          }}
                        />
                      </div>
                    </div>
                    <div className="medium-text bolder">
                      {formatInput(education.college)}
                    </div>
                    <div className="text-light-grey bold">{`${
                      education.from_month && codeMonth(education.from_month)
                    } ${education.from_year && `${education.from_year}`}${
                      (education.from_month || education.from_year) && ` - `
                    }${education.to_month && codeMonth(education.to_month)} ${
                      education.to_year && education.to_year
                    }`}</div>
                    <div className="bold text-grey medium-text">
                      {education.location}
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
                  userData.length < 1
                    ? displayError()
                    : navigate(`/cv/update/buildEx/${dataParams.id}`)
                }
              >
                Add Experience
              </Button>
            </div>
          </m.div>
        )) || <Loader minHeight={"65vh"} />}
      </div>
    </m.div>
  );
};

export default BuildEducation;
