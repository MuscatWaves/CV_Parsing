import React, { useState } from "react";
import { Form, Modal, Input, Select, message } from "antd";
import { monthSelectionLabel, makeYear } from "../../utilities";
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
      bodyFormDataUpdate.append("add_education", true);
      bodyFormDataUpdate.append("id", userId);
      bodyFormDataUpdate.append("edu_name[]", values.edu_name);
      bodyFormDataUpdate.append("college[]", values.college);
      bodyFormDataUpdate.append("edu_loc[]", values.edu_loc);
      bodyFormDataUpdate.append("edu_from_year[]", values.edu_from_year);
      bodyFormDataUpdate.append("edu_from_month[]", values.edu_from_month);
      bodyFormDataUpdate.append("edu_to_year[]", values.edu_to_year);
      bodyFormDataUpdate.append("edu_to_month[]", values.edu_to_month);
    } else {
      bodyFormDataUpdate.append("update_education", true);
      bodyFormDataUpdate.append("id", data.id);
      bodyFormDataUpdate.append("edu_name", values.edu_name);
      bodyFormDataUpdate.append("college", values.college);
      bodyFormDataUpdate.append("edu_loc", values.edu_loc);
      bodyFormDataUpdate.append("edu_from_year", values.edu_from_year);
      bodyFormDataUpdate.append("edu_from_month", values.edu_from_month);
      bodyFormDataUpdate.append("edu_to_year", values.edu_to_year);
      bodyFormDataUpdate.append("edu_to_month", values.edu_to_month);
    }
    setLoading(true);
    await axios({
      method: "POST",
      url: `/api/react-post.php`,
      data: bodyFormDataUpdate,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
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
          getUserData();
          setLoading(false);
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
        <Form.Item name="edu_name">
          <Input placeholder="Course Name" />
        </Form.Item>
        <Form.Item name="college">
          <Input placeholder="College/School Name" />
        </Form.Item>
        <Form.Item name="edu_loc">
          <Input placeholder="Location" />
        </Form.Item>
        <Form.Item
          name="edu_from_month"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="From Month" options={monthSelectionLabel} />
        </Form.Item>
        <Form.Item
          name="edu_from_year"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="From Year" options={makeYear()} showSearch />
        </Form.Item>
        <Form.Item
          name="edu_to_month"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="To month" options={monthSelectionLabel} />
        </Form.Item>
        <Form.Item
          name="edu_to_year"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="To Year" options={makeYear()} showSearch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateEducation;
