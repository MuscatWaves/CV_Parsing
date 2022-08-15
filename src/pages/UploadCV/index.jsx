import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import Header from "../../components/Header";
import jwt from "jsonwebtoken";
import Navigation from "../../components/Navigation";
import { Select } from "antd";
import { removeUnderScore } from "../../utilities";
import Loader from "../../components/Loader";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { useQuery } from "react-query";
import FormData from "form-data";
import "./uploadcv.css";

const UploadCV = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isLoading, setLoading] = useState("none");
  const [data, setData] = useState({});
  const mainUser = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
  const [selectedCategory, setSelectedCategory] = useState("Accounting");
  const [files, setFiles] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState({});

  const onSuccess = (data) => {
    const ourUser = data.data.data.filter(
      (user) => user.id === Number(mainUser.data[0].id)
    );
    setData(ourUser[0]);
    setLoading("loaded");
  };

  const { data: jobCategoryResult, isFetching } = useQuery(
    ["category"],
    () => axios.get("/api/category"),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const newData = data.data.data.map((item) => ({
          label: `${!item.category ? "None" : item.category} - (${
            !item.category ? "All" : item.cnt
          })`,
          value: `${!item.category ? "" : item.category}`,
        }));
        return newData;
      },
    }
  );

  useQuery(
    ["usermanage"],
    () =>
      axios.get("/api/user", {
        headers: {
          Authorization: token,
        },
      }),
    { refetchOnWindowFocus: false, onSuccess }
  );

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
                  loading={isFetching}
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
