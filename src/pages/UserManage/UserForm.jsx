import React from "react";
import { Button, Form, Drawer, Input, Switch } from "antd";
import Password from "antd/lib/input/Password";

const UserForm = ({ isModalOpen, setModal }) => {
  const [form] = Form.useForm();

  const onClose = () => {
    setModal(false);
  };

  const handleCreateUser = (values) => {
    console.log(values);
  };

  return (
    <Drawer
      title="Basic Drawer"
      placement="right"
      onClose={onClose}
      visible={isModalOpen}
    >
      <Form
        className="buildCvForm"
        layout="vertical"
        onFinish={handleCreateUser}
        form={form}
        scrollToFirstError={true}
        initialValues={{
          uv_access: false,
          sc_access: false,
          rc_access: false,
          bc_access: false,
        }}
      >
        <Form.Item
          name="name"
          label={"Name"}
          rules={[
            {
              required: true,
              message: "No Username provided",
            },
          ]}
        >
          <Input placeholder={"Enter name of the user"} />
        </Form.Item>
        <Form.Item
          name="email"
          label={"Email"}
          rules={[
            {
              required: true,
              message: "No Email provided",
            },
          ]}
        >
          <Input placeholder={"Enter email of the user"} />
        </Form.Item>
        <Form.Item
          name="password"
          label={"Password"}
          rules={[
            {
              required: true,
              message: "No Password provided",
            },
          ]}
        >
          <Password placeholder={"Enter name of the user"} />
        </Form.Item>
        <p className="bolder text-black">Permissions</p>
        <div className="grid-2">
          <Form.Item
            name={"uv_access"}
            label={"Upload CV access"}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name={"sc_access"}
            label={"Search CV access"}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name={"rc_access"}
            label={"Rejected CV access"}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name={"bc_access"}
            label={"Build CV access"}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>
        </div>
        <div className="flex-at-end">
          <Button className="" type="primary" htmlType="submit">
            Create Account
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default UserForm;
