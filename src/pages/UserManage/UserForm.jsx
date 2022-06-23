import { Drawer } from "antd";
import React from "react";

const UserForm = ({ isModalOpen, setModal }) => {
  const onClose = () => {
    setModal(false);
  };

  return (
    <Drawer
      title="Basic Drawer"
      placement="right"
      onClose={onClose}
      visible={isModalOpen}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
};

export default UserForm;
