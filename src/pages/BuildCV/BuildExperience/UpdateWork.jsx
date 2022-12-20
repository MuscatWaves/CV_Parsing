import React, { useState } from "react";
import {
  Form,
  Modal,
  Input,
  Select,
  message,
  notification,
  Button,
} from "antd";
import { monthSelectionLabel, makeYear, formatInput } from "../../../utilities";
import axios from "axios";
import Cookies from "universal-cookie";
import "../PersonalInfo/buildcv.css";

const UpdateWork = ({
  data,
  setData,
  visible,
  toggleVisible,
  getUserData,
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
      bodyFormDataUpdate.append("userid", userId);
      bodyFormDataUpdate.append("name", values.ex_name || "");
      bodyFormDataUpdate.append(
        "description",
        // eslint-disable-next-line
        (values.desc && values.desc.replace(/[^\x00-\x7F]/g, "-")) || ""
      );
      bodyFormDataUpdate.append("designation", values.desg || "");
      bodyFormDataUpdate.append("from_year", values.ex_from_year || "");
      bodyFormDataUpdate.append("from_month", values.ex_from_month || "");
      bodyFormDataUpdate.append("to_year", values.ex_to_year || "");
      bodyFormDataUpdate.append("to_month", values.ex_to_month || "");
    } else {
      bodyFormDataUpdate.append("id", data.id);
      bodyFormDataUpdate.append("userid", userId);
      bodyFormDataUpdate.append("name", values.ex_name || "");
      bodyFormDataUpdate.append(
        "description",
        // eslint-disable-next-line
        (values.desc && values.desc.replace(/[^\x00-\x7F]/g, "-")) || ""
      );
      bodyFormDataUpdate.append("designation", values.desg || "");
      bodyFormDataUpdate.append("from_year", values.ex_from_year || "");
      bodyFormDataUpdate.append("from_month", values.ex_from_month || "");
      bodyFormDataUpdate.append("to_year", values.ex_to_year || "");
      bodyFormDataUpdate.append("to_month", values.ex_to_month || "");
    }

    setLoading(true);
    await axios({
      method: !data.id ? "POST" : "PUT",
      url: `/api/experience`,
      data: bodyFormDataUpdate,
      headers: {
        Authorization: token,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success(response.data.message);
          toggleVisible(false);
          getUserData();
          setData({});
          form.resetFields();
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
        notification.error({
          message: (
            <div className="bold text-red">
              {"Unable to create this Experience"}
            </div>
          ),
          description: (
            <div className="bolder">
              {"Please remove any apostrophe or unicode characters from text!"}
            </div>
          ),
          duration: 6,
        });
        setLoading(false);
      });
  };

  return (
    <Modal
      title={!data.id ? "Add Work Experience" : "Edit Work Experience"}
      open={visible}
      onCancel={handleCancel}
      footer={false}
    >
      <Form
        size="large"
        layout="vertical"
        onFinish={handleUploadModal}
        form={form}
        scrollToFirstError={true}
        initialValues={{
          ex_name: data.name && formatInput(data.name),
          desg: data.designation,
          ex_from_month: data.from_month,
          ex_from_year: data.from_year,
          ex_to_month: data.to_month,
          ex_to_year: data.to_year,
          desc: data.description && formatInput(data.description),
        }}
      >
        <Form.Item
          name="ex_name"
          label="Company Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            placeholder="Company Name"
            rules={[
              {
                required: true,
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name={"desg"}
          label="Designation"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Designation" />
        </Form.Item>
        <Form.Item name="ex_from_month" label="From Month">
          <Select
            placeholder="From month"
            options={monthSelectionLabel}
            allowClear
          />
        </Form.Item>
        <Form.Item name="ex_from_year" label="From Year">
          <Select
            placeholder="From year"
            options={makeYear()}
            showSearch
            allowClear
          />
        </Form.Item>
        <Form.Item name="ex_to_month" label={"To Month"}>
          <Select
            placeholder="To Month"
            options={monthSelectionLabel}
            allowClear
          />
        </Form.Item>
        <Form.Item name="ex_to_year" label={"To Year"}>
          <Select
            placeholder="To Year"
            options={makeYear()}
            showSearch
            allowClear
          />
        </Form.Item>
        <Form.Item name="desc" label={"Description"}>
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 8 }}
            placeholder="Description"
          />
        </Form.Item>
        <div className="flex-at-end">
          <Button
            className="button-primary grid-last-btn"
            type="primary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="button-primary grid-last-btn"
            type="primary"
            htmlType="submit"
            loading={isLoading}
          >
            {!data.id ? "Add Experience" : "Edit Experience"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateWork;
