import React, { useState } from "react";
import { Form, Modal, Input, Select, message } from "antd";
import { monthSelectionLabel, makeYear } from "../../utilities";
import axios from "axios";
import Cookies from "universal-cookie";

const UpdateWork = ({
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
      bodyFormDataUpdate.append("add_experience", true);
      bodyFormDataUpdate.append("id", userId);
      bodyFormDataUpdate.append("ex_name[]", values.ex_name);
      bodyFormDataUpdate.append("desc[]", values.desc);
      bodyFormDataUpdate.append("desg[]", values.desg);
      bodyFormDataUpdate.append("ex_from_year[]", values.ex_from_year);
      bodyFormDataUpdate.append("ex_from_month[]", values.ex_from_month);
      bodyFormDataUpdate.append("ex_to_year[]", values.ex_to_year);
      bodyFormDataUpdate.append("ex_to_month[]", values.ex_to_month);
    } else {
      bodyFormDataUpdate.append("update_experience", true);
      bodyFormDataUpdate.append("id", data.id);
      bodyFormDataUpdate.append("ex_name", values.ex_name);
      bodyFormDataUpdate.append("desc", values.desc);
      bodyFormDataUpdate.append("desg", values.desg);
      bodyFormDataUpdate.append("ex_from_year", values.ex_from_year);
      bodyFormDataUpdate.append("ex_from_month", values.ex_from_month);
      bodyFormDataUpdate.append("ex_to_year", values.ex_to_year);
      bodyFormDataUpdate.append("ex_to_month", values.ex_to_month);
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
            ? message.success("The Work Experience has been sucessfully added")
            : message.success(
                "The Work Experience has been sucessfully updated"
              );
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
      title={!data.id ? "Add Work Experience" : "Edit Work Experience"}
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
          ex_name: data.name,
          desg: data.designation,
          ex_from_month: data.from_month,
          ex_from_year: data.from_year,
          ex_to_month: data.to_month,
          ex_to_year: data.to_year,
          desc: data.description,
        }}
      >
        <Form.Item name="ex_name">
          <Input placeholder="Company Name" />
        </Form.Item>
        <Form.Item name={"desg"}>
          <Input placeholder="Designation" />
        </Form.Item>
        <Form.Item
          name="ex_from_month"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="From month" options={monthSelectionLabel} />
        </Form.Item>
        <Form.Item
          name="ex_from_year"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="From year" options={makeYear()} />
        </Form.Item>
        <Form.Item
          name="ex_to_month"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="To Month" options={monthSelectionLabel} />
        </Form.Item>
        <Form.Item
          name="ex_to_year"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="To Year" options={makeYear()} />
        </Form.Item>
        <Form.Item name="desc">
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 8 }}
            placeholder="Description"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateWork;
