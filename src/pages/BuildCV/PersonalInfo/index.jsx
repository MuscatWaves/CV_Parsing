import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  notification,
  Steps,
  Radio,
  Tag,
} from "antd";
import Header from "../../../components/Header";
import Navigation from "../../../components/Navigation";
import axios from "axios";
import Cookies from "universal-cookie";
import moment from "moment";
import Loader from "../../../components/Loader";
import CustomDatePicker from "../../../components/DatePicker";
import { formatInput } from "../../../utilities";
import { m } from "framer-motion";
import "./buildcv.css";

const BuildCV = () => {
  const dataParams = useParams();
  const [form] = Form.useForm();
  const { Step } = Steps;
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
  const [currentStep, setCurrentStep] = useState(0);
  const [date, selectDate] = useState();

  console.log(countryResult);

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
          setUserData({
            user: response.data.user[0],
            attachments: response.data.attachments,
          });
          selectDate(moment(response.data.user[0].DOB));
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
      url: `/api/category`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          const result = response.data.data.map((item) => ({
            label: item.category,
            value: item.category,
          }));
          result.shift();
          result.shift();
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
      url: `/api/nationality`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          const uniqueIds = [];
          const resultNationality = response.data.data
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
          resultNationality.shift();
          setCountryResult(resultNationality);
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
      setLoading(true);
      var data = JSON.stringify({
        ...(dataParams.id && { id: dataParams.id }),
        email: values.email.trim(),
        name: checkValue(values.name, "str"),
        country: checkValue(values.country, "str"),
        nationality: checkValue(values.nationality, "str"),
        mobile: checkValue(Number(values.phone_number), "int"),
        gender: checkValue(values.gender, "str"),
        presentaddress: checkValue(values.address, "str"),
        maritalstatus: checkValue(values.martial_status, "str"),
        job: checkValue(values.job_title, "str"),
        language: checkValue(values.languages, "str"),
        skills: checkValue(values.skills, "str"),
        education: checkValue(values.education, "str"),
        company: checkValue(values.work_exp, "str"),
        category: checkValue(values.job_category, "str"),
        DOB: date.format("YYYY/MM/DD") + " 00:00:00",
        url: checkValue(values.work_portfolio_photos, "str"),
        passport: checkValue(values.passport_number, "str"),
        civil_id: checkValue(values.civil_id_number, "str"),
        height: checkValue(Number(values.height), "int"),
        weight: checkValue(Number(values.weight), "int"),
        passport_doc: null,
        education_doc: null,
        experience_doc: null,
        civil_doc: null,
        driving_doc: null,
        interview: checkValue(values.interview_link, "str"),
        test_doc: null,
        wpv: checkValue(values.work_portfolio_videos, "str"),
        alt_email: checkValue(values.alt_email, "str"),
        alt_phone: checkValue(values.alt_phone_number, "str"),
      });

      var config = {
        method: dataParams.id ? "put" : "post",
        url: "/api/cv",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            dataParams.id
              ? message.success("The profile has been updated successfully")
              : message.success("The profile has been created successfully");
            setLoading(false);
            dataParams.id
              ? window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              : navigateTo(`/cv/update/buildEdu/${response.data.id}`);
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
              message.error("Something Went Wrong!");
              setLoading(false);
            }
          }
        })
        .catch(function (response) {
          notification.error({
            message: (
              <div className="bold text-red">
                {"Unable to create this profile"}
              </div>
            ),
            description: (
              <div className="bolder">{response.response.data.error}</div>
            ),
            duration: 6,
          });
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setLoading(false);
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

  const changeStep = (value) => {
    setCurrentStep(value);
    if (value === 1) {
      navigate(`/cv/update/buildEdu/${dataParams.id}`);
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

  return (
    <m.div
      className="cv-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
              title="Education"
              description="Education details of the candidate"
              disabled={!dataParams.id}
            />
            <Step
              title="Experience"
              description="Work Experience of the candidate"
              disabled={!dataParams.id}
            />
            <Step
              title="CV & Picture"
              disabled={!dataParams.id}
              description={"Updating the Candidate Picture & CV"}
            />
            <Step
              // title={<div className="bolder text-black">Complete Setup</div>}
              title="Complete Setup"
              disabled={!dataParams.id}
            />
          </Steps>
        </div>
      </div>
      <div className="buildCvForm--wrapper-whole-body">
        {(userDataLoading === "loaded" && (
          <m.div
            className="buildCvForm--body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Personal Information</h1>
            <Form
              form={form}
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
                  skills: formatInput(userData.user.skills),
                  education: userData.user.education,
                  work_exp: userData.user.company,
                  address: formatInput(userData.user.presentaddress),
                  languages: formatInput(userData.user.language),
                }),
              }}
            >
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
              <Form.Item
                name="job_title"
                label={"Job Title"}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Job Title" />
              </Form.Item>
              <Form.Item name="gender" label={"Gender"}>
                <Radio.Group optionType="button" buttonStyle="solid">
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Radio.Group>
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
                  loading={countryMenuLoading}
                />
              </Form.Item>
              <div style={{ marginTop: "10px" }}>
                <Tag
                  color="blue"
                  onClick={() =>
                    form.setFieldsValue({
                      country: "India",
                      nationality: "Indian",
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  India
                </Tag>
                <Tag
                  color="blue"
                  onClick={() =>
                    form.setFieldsValue({
                      country: "Pakistan",
                      nationality: "Pakistani",
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  Pakistan
                </Tag>
                <Tag
                  color="blue"
                  onClick={() =>
                    form.setFieldsValue({
                      country: "Bangladesh",
                      nationality: "Bangladeshi",
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  Bangladesh
                </Tag>
                <Tag
                  color="blue"
                  onClick={() =>
                    form.setFieldsValue({
                      country: "Nepal",
                      nationality: "Nepali, Nepalese",
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  Nepal
                </Tag>
                <Tag
                  color="blue"
                  onClick={() =>
                    form.setFieldsValue({
                      country: "Philippines",
                      nationality: "Philippine, Filipino",
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  Philipinnes
                </Tag>
              </div>
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
              <Form.Item
                name="alt_phone_number"
                label={"Alternative Phone Number"}
              >
                <Input placeholder="Alternative Phone Number" type="number" />
              </Form.Item>
              <Form.Item label="Languages" name="languages">
                <Input placeholder="Please enter candidate's known language" />
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
              <Form.Item
                label="Skills"
                name="skills"
                className="two-column"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
              </Form.Item>
              <Form.Item label="Address" name="address" className="two-column">
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
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
          </m.div>
        )) || <Loader minHeight={"70vh"} />}
      </div>
      <div className="copyright-1">@ 2022 Copyright Powered by Oman Jobs</div>
    </m.div>
  );
};

export default BuildCV;
