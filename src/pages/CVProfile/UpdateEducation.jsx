import React, {useState} from "react";
import { Form, Modal, Input, Select } from "antd";
import { monthSelection, makeYear } from "../../utilities";

const UpdateEducation = ({ data, setData, visible, toggleVisible }) => {
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);

  const handleCancel = () => {
    toggleVisible(false);
    setData({});
    form.resetFields();
  };

  const handleUploadModal = (values) => {
    setLoading(true);
    console.log(values);
    setLoading(false);
  };

  return <Modal
  title="Edit Education"
  visible={visible}
  onCancel={handleCancel}
  okText={"Submit"}
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
      edu_name: data.name,
      college: data.college,
      edu_from_month: data.from_month,
      edu_from_year: data.from_year,
      edu_to_month: data.to_month,
      edu_to_year: data.to_year,
      edu_loc: data.location,
    }}
  >
    <Form.Item
                            name="edu_name"
                          >
                            <Input placeholder="Course Name" />
                          </Form.Item>
                          <Form.Item
                            name="college"
                          >
                            <Input placeholder="College/School Name" />
                          </Form.Item>
                          <Form.Item
                            name="edu_loc"
                          >
                            <Input placeholder="Location" />
                          </Form.Item>
                          <Form.Item
                            name="edu_from_month"
                          >
                            <Select
                              placeholder="From Month"
                              options={monthSelection}
                            />
                          </Form.Item>
                          <Form.Item
                            name="edu_from_year"
                          >
                            <Select
                              placeholder="From Year"
                              options={makeYear()}
                            />
                          </Form.Item>
                          <Form.Item
                            name="edu_to_month"
                          >
                            <Select
                              placeholder="To month"
                              options={monthSelection}
                            />
                          </Form.Item>
                          <Form.Item
                            name="edu_to_year"
                          >
                            <Select
                              placeholder="To Year"
                              options={makeYear()}
                            />
                          </Form.Item>
  </Form>
</Modal>;
};

export default UpdateEducation;
