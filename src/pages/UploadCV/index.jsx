import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import Header from "../../components/Header";
import jwt from "jsonwebtoken";
import Navigation from "../../components/Navigation";
import { message, Select } from "antd";
import { removeUnderScore } from "../../utilities";
import "./uploadcv.css";
import Loader from "../../components/Loader";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FormData from "form-data";

const UploadCV = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isLoading, setLoading] = useState("none");
  const [data, setData] = useState({});
  const mainUser = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
  const [selectedCategory, setSelectedCategory] = useState("Accounting");
  const [jobCategoryResult, setJobCategoryResult] = useState([]);
  const [jobMenuLoading, setJobMenuLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState({});

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

  const getAllUser = async () => {
    setLoading("loading");
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
          setLoading("loaded");
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

  useEffect(() => {
    document.title = "Upload CV";
  }, []);

  useEffect(() => {
    if (token) {
      try {
        var user = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
        setLoggedIn(user);
      } catch (err) {}
    }
  }, [token]);

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
        {(isLoading === "loaded" && (
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
                <FilePond
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple={true}
                  maxFiles={30}
                  server={{
                    process: (
                      fieldName,
                      file,
                      metadata,
                      load,
                      error,
                      progress,
                      abort,
                      transfer,
                      options
                    ) => {
                      const formData = new FormData();
                      formData.append(fieldName, file, file.name);
                      formData.append("cat", selectedCategory);
                      formData.append("user", isLoggedIn.id);

                      if (selectedCategory === undefined) {
                        error("Please select Category");
                        abort("Please select Category");
                      } else {
                        const request = new XMLHttpRequest();
                        request.open("POST", `/api/cvupload.php`);
                        request.upload.onprogress = (e) => {
                          progress(e.lengthComputable, e.loaded, e.total);
                        };
                        request.onload = function () {
                          if (request.status >= 200 && request.status < 300) {
                            load(request.responseText);
                          } else {
                            error("oh no");
                          }
                        };

                        request.send(formData);
                        return {
                          abort: () => {
                            request.abort();
                            abort();
                          },
                        };
                      }
                    },
                  }}
                  name="filepond"
                  labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />
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
