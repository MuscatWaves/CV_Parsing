import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, Upload, message } from "antd";
// import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import axios from "axios";
import Cookies from "universal-cookie";
import moment from "moment";
import "./buildcv.css";

const BuildCV = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [jobCategoryResult, setJobCategoryResult] = useState([]);
  const [nationalityResult, setNationalityResult] = useState([]);
  const [countryResult, setCountryResult] = useState([]);
  const [countryMenuLoading, setCountryMenuLoading] = useState(false);
  const [jobMenuLoading, setJobMenuLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);

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

  useEffect(() => {
    getJobCategoryCount();
    getNationalityCount();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (values) => {
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
    values.name && bodyFormDataBuild.append("name", values.name);
    bodyFormDataBuild.append("email", values.email);
    bodyFormDataBuild.append("dob", moment(values.dob).format("MM/DD/YYYY"));
    values.job_title && bodyFormDataBuild.append("job", values.job_title);
    values.gender && bodyFormDataBuild.append("gender", values.gender);
    values.country && bodyFormDataBuild.append("country", values.country);
    values.nationality &&
      bodyFormDataBuild.append("nationality", values.nationality);
    values.martial_status &&
      bodyFormDataBuild.append("maritalstatus", values.martial_status);
    values.job_category &&
      bodyFormDataBuild.append("category", values.job_category);
    values.phone_number &&
      bodyFormDataBuild.append("mobile", Number(values.phone_number));
    values.work_portfolio_photos &&
      bodyFormDataBuild.append("url", values.work_portfolio_photos);
    values.work_portfolio_videos &&
      bodyFormDataBuild.append("wpv", values.work_portfolio_videos);
    values.interview_link &&
      bodyFormDataBuild.append("interview", values.interview_link);
    values.passport_number &&
      bodyFormDataBuild.append("passport", values.passport_number);
    values.civil_id_number &&
      bodyFormDataBuild.append("civil_id", values.civil_id_number);
    values.height && bodyFormDataBuild.append("height", Number(values.height));
    values.weight && bodyFormDataBuild.append("weight", Number(values.weight));
    values.skills && bodyFormDataBuild.append("skills", values.skills);
    values.education && bodyFormDataBuild.append("education", values.education);
    values.work_exp && bodyFormDataBuild.append("company", values.work_exp);
    values.address && bodyFormDataBuild.append("address", values.address);
    values.languages && bodyFormDataBuild.append("language", values.languages);
    profilePicture && bodyFormDataBuild.append("image", profilePicture);
    cvFile && bodyFormDataBuild.append("cv", cvFile);
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
          message.success("The profile has been created successfully");
          setLoading(false);
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
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
  };

  const normFile = (e) => {
    console.log(e);
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
        current_page={"Create a resume"}
      />
      <Form
        className="buildCvForm"
        onFinish={handleSubmit}
        size="large"
        layout="vertical"
        scrollToFirstError={true}
        initialValues={{
          profile_picture: [],
          profile_cv: [],
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
        <Form.Item name="name">
          <Input placeholder="Name of the candidate" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Email of the candidate*" />
        </Form.Item>
        <Form.Item
          name="dob"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker placeholder="Date of Birth*" />
        </Form.Item>
        <Form.Item name="job_title">
          <Input placeholder="Job Title" />
        </Form.Item>
        <Form.Item name="gender">
          <Select placeholder="Select Gender">
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="martial_status">
          <Select placeholder="Martial Status">
            <Select.Option value="single">Single</Select.Option>
            <Select.Option value="married">Married</Select.Option>
            <Select.Option value="widowed">Widowed</Select.Option>
            <Select.Option value="divorced">Divorced</Select.Option>
            <Select.Option value="seperated">Seperated</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="country">
          <Select
            placeholder="Country"
            options={countryResult}
            showSearch
            disabled={countryMenuLoading}
          />
        </Form.Item>
        <Form.Item name="nationality">
          <Select
            placeholder="Select Nationality"
            options={nationalityResult}
            showSearch
            loading={countryMenuLoading}
          ></Select>
        </Form.Item>
        <Form.Item name="job_category">
          <Select
            placeholder="Select Job Category"
            options={jobCategoryResult}
            showSearch
            loading={jobMenuLoading}
          ></Select>
        </Form.Item>
        <Form.Item name="phone_number">
          <Input placeholder="Phone Number" type="number" />
        </Form.Item>
        <Form.Item label="Education" name="education" className="two-column">
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
        </Form.Item>
        <Form.Item
          label="Work Experience"
          name="work_exp"
          className="two-column"
        >
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
        </Form.Item>
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
          Create Account
        </Button>
      </Form>
      <div className="copyright-1">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default BuildCV;
