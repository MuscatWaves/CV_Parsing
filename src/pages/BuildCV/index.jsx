import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Space,
  notification,
} from "antd";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import axios from "axios";
import Cookies from "universal-cookie";
import moment from "moment";
import "./buildcv.css";
import Loader from "../../components/Loader";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CustomDatePicker from "../../components/DatePicker";
import { monthSelectionLabel, makeYear } from "../../utilities";

const BuildCV = () => {
  const dataParams = useParams();
  const cookies = new Cookies();
  const token = cookies.get("token");
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };
  const [jobCategoryResult, setJobCategoryResult] = useState([]);
  const [nationalityResult, setNationalityResult] = useState([]);
  const [countryResult, setCountryResult] = useState([]);
  const [countryMenuLoading, setCountryMenuLoading] = useState(false);
  const [jobMenuLoading, setJobMenuLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [userDataLoading, setUserDataLoading] = useState("none");
  const [date, selectDate] = useState();

  // const [fileList, setFileList] = useState([]);

  // const beforeUpload = (file) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     setFileList((prev) => [...prev, { url: reader.result }]);
  //   };

  //   // then upload `file` from the argument manually
  //   return false;
  // };

  const getUserData = async () => {
    setUserDataLoading("loading");
    await axios({
      method: "GET",
      url: `/api/user.php?id=${dataParams.id}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setUserData({
            user: response.data.data.user[0],
            attachments: response.data.data.attachments,
          });
          selectDate(moment(response.data.data.user[0].DOB));
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

  const getNationalityCount = async () => {
    setCountryMenuLoading(true);
    await axios({
      method: "GET",
      url: `/api/get.php?nationality=true`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          const uniqueIds = [];
          const resultNationality = response.data
            .map((item) => ({
              label: item.nationality,
              value: item.nationality,
            }))
            .filter((element) => {
              const isDuplicate = uniqueIds.includes(element.label);

              if (!isDuplicate) {
                uniqueIds.push(element.label);

                return true;
              }

              return false;
            });
          const resultCountry = response.data
            .map((item) => ({
              label: item.country,
              value: item.country,
            }))
            .filter((country) => country.label !== "");
          setCountryResult(resultCountry);
          setNationalityResult(resultNationality);
          setCountryMenuLoading(false);
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

  const checkValue = (value, type) => {
    if (type === "int") {
      return !value ? 0 : value;
    } else {
      return !value ? "" : value;
    }
  };

  useEffect(() => {
    document.title = "Build CV";
    getJobCategoryCount();
    getNationalityCount();
    dataParams.id && getUserData();
    !dataParams.id && setUserDataLoading("loaded");
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (values) => {
    if (date?.format("MM/DD/YYYY")) {
      const profilePicture =
        values.profile_picture.length !== 0
          ? values.profile_picture[0].originFileObj
          : null;
      const cvFile =
        values.profile_cv.length !== 0
          ? values.profile_cv[0].originFileObj
          : null;
      var bodyFormDataBuild = new FormData();
      bodyFormDataBuild.append("Add_Cv", true);
      dataParams.id && bodyFormDataBuild.append("update", dataParams.id);
      bodyFormDataBuild.append("name", checkValue(values.name, "str"));
      bodyFormDataBuild.append("email", values.email.trim());
      bodyFormDataBuild.append("dob", date.format("MM/DD/YYYY"));
      bodyFormDataBuild.append("job", checkValue(values.job_title, "str"));
      bodyFormDataBuild.append("gender", checkValue(values.gender, "str"));
      bodyFormDataBuild.append("country", checkValue(values.country, "str"));
      bodyFormDataBuild.append(
        "alt_email",
        checkValue(values.alt_email, "str")
      );
      bodyFormDataBuild.append(
        "alt_phone",
        checkValue(values.alt_phone_number, "str")
      );
      bodyFormDataBuild.append(
        "nationality",
        checkValue(values.nationality, "str")
      );
      bodyFormDataBuild.append(
        "maritalstatus",
        checkValue(values.martial_status, "str")
      );
      bodyFormDataBuild.append(
        "category",
        checkValue(values.job_category, "str")
      );
      bodyFormDataBuild.append(
        "mobile",
        checkValue(Number(values.phone_number), "int")
      );
      bodyFormDataBuild.append(
        "url",
        checkValue(values.work_portfolio_photos, "str")
      );
      bodyFormDataBuild.append(
        "wpv",
        checkValue(values.work_portfolio_videos, "str")
      );
      bodyFormDataBuild.append(
        "interview",
        checkValue(values.interview_link, "str")
      );
      bodyFormDataBuild.append(
        "passport",
        checkValue(values.passport_number, "str")
      );
      bodyFormDataBuild.append(
        "civil_id",
        checkValue(values.civil_id_number, "str")
      );
      bodyFormDataBuild.append(
        "height",
        checkValue(Number(values.height), "int")
      );
      bodyFormDataBuild.append(
        "weight",
        checkValue(Number(values.weight), "int")
      );
      bodyFormDataBuild.append("skills", checkValue(values.skills, "str"));
      bodyFormDataBuild.append(
        "education",
        checkValue(values.education, "str")
      );
      bodyFormDataBuild.append("company", checkValue(values.work_exp, "str"));
      bodyFormDataBuild.append("address", checkValue(values.address, "str"));
      bodyFormDataBuild.append("language", checkValue(values.languages, "str"));
      profilePicture && bodyFormDataBuild.append("image", profilePicture);
      cvFile && bodyFormDataBuild.append("cv", cvFile);
      !dataParams.id &&
        values.new_education &&
        values.new_education.map((education) => {
          bodyFormDataBuild.append("edu_name[]", education.edu_name);
          bodyFormDataBuild.append("college[]", education.college);
          bodyFormDataBuild.append("edu_loc[]", education.edu_loc);
          bodyFormDataBuild.append(
            "edu_from_year[]",
            education.edu_from_year || ""
          );
          bodyFormDataBuild.append(
            "edu_from_month[]",
            education.edu_from_month || ""
          );
          bodyFormDataBuild.append(
            "edu_to_year[]",
            education.edu_to_year || ""
          );
          bodyFormDataBuild.append(
            "edu_to_month[]",
            education.edu_to_month || ""
          );
          return "";
        });
      !dataParams.id &&
        values.new_work_exp &&
        values.new_work_exp.map((work) => {
          bodyFormDataBuild.append("ex_name[]", work.ex_name);
          bodyFormDataBuild.append("desc[]", work.desc);
          bodyFormDataBuild.append("desg[]", work.desg);
          bodyFormDataBuild.append("ex_from_year[]", work.ex_from_year || "");
          bodyFormDataBuild.append("ex_from_month[]", work.ex_from_month || "");
          bodyFormDataBuild.append("ex_to_year[]", work.ex_to_year || "");
          bodyFormDataBuild.append("ex_to_month[]", work.ex_to_month || "");
          return "";
        });
      setLoading(true);
      await axios({
        method: "POST",
        url: `/api/react-post.php`,
        data: bodyFormDataBuild,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(function (response) {
          if (response.status === 200) {
            dataParams.id
              ? message.success("The profile has been updated successfully")
              : message.success("The profile has been created successfully");
            setLoading(false);
            dataParams.id
              ? navigateTo(`/searchcv/profile/app/${dataParams.id}`)
              : navigateTo(`/searchcv`);
          } else {
            if (response.status === 201) {
              notification.error({
                message: (
                  <div className="bold text-red">
                    {"Unable to create this profile"}
                  </div>
                ),
                description: (
                  <div className="bolder">{response.data.error}</div>
                ),
                duration: 6,
              });
              setLoading(false);
            } else {
              message.error("Something Went Wrong!", "error");
              setLoading(false);
            }
          }
        })
        .catch(function (response) {
          message.error("Something Went Wrong!", "error");
        });
    } else {
      notification.error({
        message: (
          <div className="bold text-red">{"Unable to create this profile"}</div>
        ),
        description: <div className="bolder">{`Invalid Date of Birth`}</div>,
        duration: 6,
      });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="cv-body">
      <Header />
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={dataParams.id ? "Update Resume" : "Create a resume"}
      />
      {(userDataLoading === "loaded" && (
        <Form
          className="buildCvForm"
          onSubmit={(e) => e.preventDefault()}
          onFinish={handleSubmit}
          size="large"
          layout="vertical"
          scrollToFirstError={true}
          initialValues={{
            profile_picture: [],
            profile_cv: [],
            ...(dataParams.id && {
              profile_picture: [
                {
                  uid: "-1",
                  name: userData.user.image,
                  status: "done",
                  url: `${window.origin}/files/images/${userData.user.image}`,
                },
              ],
              profile_cv: [
                {
                  uid: "-1",
                  name: userData.user.cv,
                  status: "done",
                  url: `/files/cv/${userData.user.cv}`,
                },
              ],
              alt_phone_number: userData.user.alt_phone,
              alt_email: userData.user.alt_email,
              name: userData.user.name,
              email: userData.user.email,
              job_title: userData.user.job,
              gender: userData.user.gender,
              country: userData.user.country,
              nationality: userData.user.nationality,
              martial_status: userData.user.maritalstatus,
              job_category: userData.user.category,
              phone_number: userData.user.mobile,
              work_portfolio_photos: userData.user.url,
              work_portfolio_videos: userData.user.wpv,
              interview_link: userData.user.interview,
              passport_number: userData.user.passport,
              civil_id_number: userData.user.civil_id,
              height: userData.user.height,
              weight: userData.user.weight,
              skills: userData.user.skills,
              education: userData.user.education,
              work_exp: userData.user.company,
              address: userData.user.presentaddress,
              languages: userData.user.language,
            }),
          }}
        >
          <Form.Item
            name="profile_picture"
            label="Candidate's Picture"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the candidate's profile picture"
          >
            {/* <ImgCrop grid rotate> */}
            <Upload
              name="profile-pic"
              listType="picture"
              accept=".jpeg,.png,.jpg"
              maxCount={1}
              beforeUpload={() => {
                /* update state here */
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
            {/* </ImgCrop> */}
          </Form.Item>
          <Form.Item
            name="profile_cv"
            label="CV/Resume"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the candidate's profile picture"
          >
            <Upload
              name="cv profile"
              listType="picture"
              accept=".pdf,.docx,.xslx"
              maxCount={1}
              beforeUpload={() => {
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="name" label={"Name"}>
            <Input placeholder="Name of the candidate" />
          </Form.Item>
          <CustomDatePicker date={date} selectDate={selectDate} />
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Email of the candidate*" />
          </Form.Item>
          <Form.Item name="job_title" label={"Job Title"}>
            <Input placeholder="Job Title" />
          </Form.Item>
          <Form.Item name="gender" label={"Gender"}>
            <Select placeholder="Select Gender">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="martial_status" label={"Martial Status"}>
            <Select placeholder="Martial Status">
              <Select.Option value="single">Single</Select.Option>
              <Select.Option value="married">Married</Select.Option>
              <Select.Option value="widowed">Widowed</Select.Option>
              <Select.Option value="divorced">Divorced</Select.Option>
              <Select.Option value="seperated">Seperated</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="country" label={"Country"}>
            <Select
              placeholder="Country"
              options={countryResult}
              showSearch
              disabled={countryMenuLoading}
            />
          </Form.Item>
          <Form.Item name="nationality" label={"Nationality"}>
            <Select
              placeholder="Select Nationality"
              options={nationalityResult}
              showSearch
              loading={countryMenuLoading}
            ></Select>
          </Form.Item>
          <Form.Item name="job_category" label={"Job Category"}>
            <Select
              placeholder="Select Job Category"
              options={jobCategoryResult}
              showSearch
              loading={jobMenuLoading}
            ></Select>
          </Form.Item>
          <Form.Item name="phone_number" label={"Phone Number"}>
            <Input placeholder="Phone Number" type="number" />
          </Form.Item>
          <Form.Item name="alt_email" label={"Alternative Email"}>
            <Input placeholder="Alternative Email" type="email" />
          </Form.Item>
          <Form.Item name="alt_phone_number" label={"Alternative Phone Number"}>
            <Input placeholder="Alternative Phone Number" type="number" />
          </Form.Item>
          {dataParams.id && userData.user.education && (
            <Form.Item
              label="Education"
              name="education"
              className="two-column"
            >
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
            </Form.Item>
          )}
          {dataParams.id && userData.user.company && (
            <Form.Item
              label="Work Experience"
              name="work_exp"
              className="two-column"
            >
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
            </Form.Item>
          )}

          {/* Education Grid */}

          {!dataParams.id && (
            <Form.Item label="Education" className="two-column">
              <Form.List name="new_education">
                {(fields, { add, remove }) => (
                  <div className="flex-all-across">
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key}>
                        <Space key={key} className={"education-section-build"}>
                          <Form.Item
                            {...restField}
                            name={[name, "edu_name"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing Education Name",
                              },
                            ]}
                          >
                            <Input placeholder="Course Name" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "college"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing College Name",
                              },
                            ]}
                          >
                            <Input placeholder="College/School Name" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "edu_loc"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing Location",
                              },
                            ]}
                          >
                            <Input placeholder="Location" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "edu_from_month"]}
                          >
                            <Select
                              placeholder="From Month"
                              options={monthSelectionLabel}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "edu_from_year"]}
                          >
                            <Select
                              placeholder="From Year"
                              options={makeYear()}
                              showSearch
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "edu_to_month"]}
                          >
                            <Select
                              placeholder="To month"
                              options={monthSelectionLabel}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "edu_to_year"]}
                          >
                            <Select
                              placeholder="To Year"
                              options={makeYear()}
                              showSearch
                            />
                          </Form.Item>
                        </Space>
                        <MinusCircleOutlined
                          style={{ marginBottom: "20px", fontSize: "25px" }}
                          onClick={() => remove(name)}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Education
                      </Button>
                    </Form.Item>
                  </div>
                )}
              </Form.List>
            </Form.Item>
          )}

          {/* Work Experience */}

          {!dataParams.id && (
            <Form.Item label="Work Experience" className="two-column">
              <Form.List name="new_work_exp">
                {(fields, { add, remove }) => (
                  <div className="flex-all-across">
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key}>
                        <Space key={key} className={"work-exp-section-build"}>
                          <Form.Item
                            {...restField}
                            name={[name, "ex_name"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing Experience Name",
                              },
                            ]}
                          >
                            <Input placeholder="Company Name" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "desg"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing Designation",
                              },
                            ]}
                          >
                            <Input placeholder="Designation" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "ex_from_month"]}
                          >
                            <Select
                              placeholder="From month"
                              options={monthSelectionLabel}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "ex_from_year"]}
                          >
                            <Select
                              placeholder="From year"
                              options={makeYear()}
                              showSearch
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "ex_to_month"]}
                          >
                            <Select
                              placeholder="To Month"
                              options={monthSelectionLabel}
                            />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, "ex_to_year"]}>
                            <Select
                              placeholder="To Year"
                              options={makeYear()}
                              showSearch
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "desc"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing Description",
                              },
                            ]}
                          >
                            <Input.TextArea
                              autoSize={{ minRows: 4, maxRows: 8 }}
                              placeholder="Description"
                            />
                          </Form.Item>
                        </Space>
                        <MinusCircleOutlined
                          style={{ marginBottom: "20px", fontSize: "25px" }}
                          onClick={() => remove(name)}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Work Experience
                      </Button>
                    </Form.Item>
                  </div>
                )}
              </Form.List>
            </Form.Item>
          )}

          {/*  */}

          <Form.Item label="Skills" name="skills" className="two-column">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            className="two-column"
            autoSize={{ minRows: 3, maxRows: 6 }}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item className="two-column" label="Languages" name="languages">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="work_portfolio_photos"
            label="Work Portfolio Photos"
            rules={[
              {
                type: "url",
                message: "This field must be a valid url.",
              },
            ]}
          >
            <Input placeholder="Work Portfolio Photos Link" />
          </Form.Item>
          <Form.Item
            name="work_portfolio_videos"
            label="Work Portfolio Videos"
            rules={[
              {
                type: "url",
                message: "This field must be a valid url.",
              },
            ]}
          >
            <Input placeholder="Work Portfolio Videos Link" />
          </Form.Item>
          <Form.Item
            className="two-column"
            name="interview_link"
            label="Interview Link"
            rules={[
              {
                type: "url",
                message: "This field must be a valid url.",
              },
            ]}
          >
            <Input placeholder="Interview Link" />
          </Form.Item>
          <Form.Item name="passport_number" label="Passport Number">
            <Input placeholder="Passport Number" />
          </Form.Item>
          <Form.Item name="civil_id_number" label="Civil ID Number">
            <Input placeholder="Civil ID number" />
          </Form.Item>
          <Form.Item name="height" label="Height (in cm)">
            <Input placeholder="Height" />
          </Form.Item>
          <Form.Item name="weight" label="Weight (in kg)">
            <Input placeholder="Weight" />
          </Form.Item>
          <Button
            className="button-primary grid-last-btn"
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            {dataParams.id ? "Update CV" : "Create CV"}
          </Button>
        </Form>
      )) || <Loader minHeight={"70vh"} />}
      <div className="copyright-1">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default BuildCV;
