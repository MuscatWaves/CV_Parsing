import React, { useState } from "react";
import { Form, Modal, Input, Select, message } from "antd";
import { monthSelectionLabel, makeYear } from "../../../utilities";
import axios from "axios";
import Cookies from "universal-cookie";

const UpdateEducation = ({
  data,
  setData,
  visible,
  toggleVisible,
  getUserData,
  setPageLoading,
  userId,
  dataParams,
  setUserData,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("token");

  const handleCancel = () => {
    toggleVisible(false);
    setData({});
    form.resetFields();
  };

  const handleUploadModal = async (values) => {
    var bodyFormDataUpdate = new FormData();
    if (!data.id) {
      bodyFormDataUpdate.append("userid", userId);
      bodyFormDataUpdate.append("name", values.edu_name);
      bodyFormDataUpdate.append("college", values.college);
      bodyFormDataUpdate.append("location", values.edu_loc);
      bodyFormDataUpdate.append("from_year", values.edu_from_year || "");
      bodyFormDataUpdate.append("from_month", values.edu_from_month || "");
      bodyFormDataUpdate.append("to_year", values.edu_to_year || "");
      bodyFormDataUpdate.append("to_month", values.edu_to_month || "");
    } else {
      bodyFormDataUpdate.append("id", data.id);
      bodyFormDataUpdate.append("userid", userId);
      bodyFormDataUpdate.append("name", values.edu_name);
      bodyFormDataUpdate.append("college", values.college);
      bodyFormDataUpdate.append("location", values.edu_loc);
      bodyFormDataUpdate.append("from_year", values.edu_from_year || "");
      bodyFormDataUpdate.append("from_month", values.edu_from_month || "");
      bodyFormDataUpdate.append("to_year", values.edu_to_year || "");
      bodyFormDataUpdate.append("to_month", values.edu_to_month || "");
    }
    setLoading(true);
    await axios({
      method: !data.id ? "POST" : "PUT",
      url: `/api/education`,
      data: bodyFormDataUpdate,
      headers: {
        Authorization: token,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          !data.id
            ? message.success("The Education has been sucessfully added")
            : message.success("The Education has been sucessfully updated");
          toggleVisible(false);
          setData({});
          form.resetFields();
          setPageLoading("loading");
          getUserData(dataParams, setUserData, setPageLoading);
          setLoading(false);
        } else {
          if (response.status === 201) {
            message.error(response.data.error);
            setLoading(false);
          } else {
            message.error("Something Went Wrong!");
            setLoading(false);
          }
        }
      })
      .catch(function (response) {
        message.error(response.response.data.error);
        setLoading(false);
      });
  };

  return (
    <Modal
      title={!data.id ? "Add Education" : "Edit Education"}
      visible={visible}
      onCancel={handleCancel}
      okText={!data.id ? "Add" : "Update"}
      onOk={form.submit}
      confirmLoading={isLoading}
    >
      <Form
        size="large"
        layout="vertical"
        onFinish={handleUploadModal}
        form={form}
        scrollToFirstError={true}
        initialValues={{
          ...(data.id && {
            edu_name: data.name,
            college: data.college,
            edu_from_month: data.from_month,
            edu_from_year: data.from_year,
            edu_to_month: data.to_month,
            edu_to_year: data.to_year,
            edu_loc: data.location,
          }),
        }}
      >
        <Form.Item
          name="edu_name"
          label={"Course Name"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Course Name" />
        </Form.Item>
        <Form.Item
          name="college"
          label={"College/School Name"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="College/School Name" />
        </Form.Item>
        <Form.Item
          name="edu_loc"
          label={"Location"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Location" />
        </Form.Item>
        <Form.Item name="edu_from_month" label={"From Month"}>
          <Select
            placeholder="From Month"
            options={monthSelectionLabel}
            allowClear
          />
        </Form.Item>
        <Form.Item name="edu_from_year" label={"From Year"}>
          <Select
            placeholder="From Year"
            options={makeYear()}
            showSearch
            allowClear
          />
        </Form.Item>
        <Form.Item name="edu_to_month" label={"To month"}>
          <Select
            placeholder="To month"
            options={monthSelectionLabel}
            allowClear
          />
        </Form.Item>
        <Form.Item name="edu_to_year" label={"To Year"}>
          <Select
            placeholder="To Year"
            options={makeYear()}
            showSearch
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateEducation;
