import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import Header from "../../components/Header";
import jwt from "jsonwebtoken";
import { InboxOutlined } from "@ant-design/icons";
import Navigation from "../../components/Navigation";
import { message, Select, Upload } from "antd";
import { removeUnderScore } from "../../utilities";
import "./uploadcv.css";
import Loader from "../../components/Loader";

const UploadCV = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const mainUser = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
  const [selectedCategory, setSelectedCategory] = useState();
  const [jobCategoryResult, setJobCategoryResult] = useState([]);
  const [jobMenuLoading, setJobMenuLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { Dragger } = Upload;
  const props = {
    name: "file",
    multiple: true,
    onChange(info) {
      setFileList(info.fileList);
    },
    maxCount: "5",
  };

  const getJobCategoryCount = async () => {
    setJobMenuLoading(true);
    await axios({
      method: "GET",
      url: `/api/get.php?industry=true`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          const result = response.data.map((item) => ({
            label: item.name,
            value: item.name,
          }));
          setJobCategoryResult(result);
          setJobMenuLoading(false);
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
          } else {
            message.error("Something Went Wrong!", "error");
          }
        }
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
      });
  };

  console.log(fileList);

  const getAllUser = async () => {
    setLoading(true);
    await axios({
      method: "GET",
      url: `/api/userlist.php`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      params: {
        row: 0,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          const ourUser = response.data.data.filter(
            (user) => user.id === Number(mainUser.id)
          );
          setData(ourUser[0]);
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
          } else {
            message.error("Something Went Wrong!", "error");
          }
        }
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
      });
  };

  useEffect(() => {
    getAllUser();
    getJobCategoryCount();
    // eslint-disable-next-line
  }, []);

  const personalStatus = {
    name: data.name || "",
    email: data.email || "",
    CVs_parsed: data.parsed || 0,
    CVs_pending: data.pending || 0,
    total_CVs_parsed: data.parsed + data.pending || 0,
  };

  return (
    <div>
      <Header />
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={"Upload CV"}
      />
      <div>
        {(!isLoading && (
          <div className="uploadCV">
            <div className="status-list slide-in-left-animation">
              <div className="bolder large-text text-orange">
                Status Information
              </div>
              {Object.keys(personalStatus).map((keyName, i) => (
                <div key={i}>
                  <div className="bolder text-black medium-text">
                    {removeUnderScore(keyName)}
                  </div>
                  <div className="bolder text-grey medium-text">
                    {personalStatus[keyName]}
                  </div>
                </div>
              ))}
            </div>
            <div className="status-list upload-box slide-in-right-animation">
              <div className="flex-small-gap-column">
                <div className="bolder text-grey">{"Job Category"}</div>
                <Select
                  placeholder={"Select the Job category"}
                  options={jobCategoryResult}
                  loading={jobMenuLoading}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                />
              </div>
              <div>
                <Dragger
                  {...props}
                  beforeUpload={() => {
                    return false;
                  }}
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Max - 5 files
                  </p>
                </Dragger>
              </div>
            </div>
          </div>
        )) || <Loader minHeight={"70vh"} />}
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default UploadCV;
