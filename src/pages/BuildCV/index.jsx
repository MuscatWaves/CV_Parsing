import React from "react";
import { Form, Input, Button, DatePicker, Select, Upload, Space } from "antd";
import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import "./buildcv.css";

const BuildCV = () => {
  const handleSubmit = (values) => {
    console.log(values);
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
        current_page={"Create a resume"}
      />
      <Form
        className="buildCvForm"
        onFinish={handleSubmit}
        size="large"
        layout="vertical"
        scrollToFirstError={true}
      >
        <Form.Item
          name="profile_picture"
          label="Candidate's Picture"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Upload the candidate's profile picture"
        >
          <Upload
            name="profile-pic"
            listType="picture"
            accept=".jpeg,.png,.jpg"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
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
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Name of the candidate*" />
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
        <Form.Item name="dob">
          <DatePicker placeholder="Date of Birth" />
        </Form.Item>
        <Form.Item
          name="job_title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Job Title*" />
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
          <Select placeholder="Select Country" options={[]} showSearch></Select>
        </Form.Item>
        <Form.Item name="nationality">
          <Input placeholder="Nationality" />
        </Form.Item>
        <Form.Item name="job_category">
          <Input placeholder="Job Category" />
        </Form.Item>
        <Form.Item name="phone_number">
          <Input placeholder="Phone Number" type="number" />
        </Form.Item>
        <Form.Item
          label="Career Summary"
          name="career_summary"
          className="two-column"
        >
          <Input.TextArea />
        </Form.Item>
        <div className="two-column">
          <p className="bold">Education</p>
          <Form.List name="education">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing Name",
                        },
                      ]}
                    >
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "institution_name"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing institution name",
                        },
                      ]}
                    >
                      <Input placeholder="Institution Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "institution_location"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing institution location",
                        },
                      ]}
                    >
                      <Input placeholder="Institution Location" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "year"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing passed out year",
                        },
                      ]}
                    >
                      <Input placeholder="Year" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
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
              </>
            )}
          </Form.List>
        </div>
        <div className="two-column">
          <p className="bold">Work Experience</p>
          <Form.List name="work_experience">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div className="flex-small-gap">
                    <div>
                      <div className="flex-small-gap">
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing Name",
                            },
                          ]}
                        >
                          <Input placeholder="Name" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "location"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing location",
                            },
                          ]}
                        >
                          <Input placeholder="Location" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "job"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing job",
                            },
                          ]}
                        >
                          <Input placeholder="Job" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "year_from"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing year from",
                            },
                          ]}
                        >
                          <Input placeholder="Year From" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "year_to"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing year to",
                            },
                          ]}
                        >
                          <Input placeholder="Year to" />
                        </Form.Item>
                      </div>
                      <Form.Item
                        {...restField}
                        name={[name, "info"]}
                        rules={[
                          {
                            required: true,
                            message: "Missing information ",
                          },
                        ]}
                      >
                        <Input.TextArea
                          autoSize={{
                            minRows: 4,
                            maxRows: 10,
                          }}
                          placeholder={"Information"}
                        />
                      </Form.Item>
                    </div>
                    <MinusCircleOutlined
                      className={"red-icon"}
                      onClick={() => remove(name)}
                    />
                  </div>
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
              </>
            )}
          </Form.List>
        </div>
        <Form.Item label="Skills" name="skills" className="two-column">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Address" name="address" className="two-column">
          <Input.TextArea />
        </Form.Item>
        <Form.Item className="two-column" label="Languages" name="languages">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="work_portfolio_photos" label="Work Portfolio Photos">
          <Input placeholder="Work Portfolio Photos" />
        </Form.Item>
        <Form.Item name="work_portfolio_videos" label="Work Portfolio Videos">
          <Input placeholder="Work Portfolio Videos" />
        </Form.Item>
        <Form.Item
          className="two-column"
          name="interview_link"
          label="Interview Link"
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
        >
          Create Account
        </Button>
      </Form>
      <div className="copyright-1">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default BuildCV;
