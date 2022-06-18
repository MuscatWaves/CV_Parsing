import React, { useMemo } from "react";
import { Form, Input, Button, DatePicker, Select } from "antd";
import Header from "../../components/Header";
import countryList from "react-select-country-list";
import Navigation from "../../components/Navigation";
import "./buildcv.css";

function BuildCV() {
  const handleSubmit = (values) => {
    console.log(values);
  };

  const countryOptions = useMemo(() => countryList().getData(), []);

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
      >
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
          <Select
            placeholder="Select Country"
            options={countryOptions}
            showSearch
          ></Select>
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
        <Form.Item label="Education" name="education" className="two-column">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Work Experience"
          name="work_experience"
          className="two-column"
        >
          <Input.TextArea />
        </Form.Item>
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
}

export default BuildCV;
