import React, { useState } from "react";
import { Form, Modal, Input, Select } from "antd";
import { monthSelection, makeYear } from "../../utilities";

const UpdateWork = ({ data, setData, visible, toggleVisible }) => {
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

  return (
    <Modal
      title="Edit Work Experience"
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
        <Form.Item name="ex_from_month">
          <Select placeholder="From month" options={monthSelection} />
        </Form.Item>
        <Form.Item name="ex_from_year">
          <Select placeholder="From year" options={makeYear()} />
        </Form.Item>
        <Form.Item name="ex_to_month">
          <Select placeholder="To Month" options={monthSelection} />
        </Form.Item>
        <Form.Item name="ex_to_year">
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
