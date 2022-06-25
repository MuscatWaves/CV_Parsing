import React, { useState } from "react";
import { Table, Button } from "antd";
import { FaCheck } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import UserForm from "./UserForm";

const UserManage = () => {
  const [isModalOpen, toggleModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const dummyData = [
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      ucaccess: "0",
      rcaccess: "0",
      scaccess: "0",
      bcaccess: "0",
      amuaccess: "0",
      uraccess: "0",
    },
    {
      id: 2,
      name: "Prabin",
      email: "prabin@example.com",
      ucaccess: "0",
      rcaccess: "0",
      scaccess: "1",
      bcaccess: "0",
      amuaccess: "1",
      uraccess: "0",
    },
    {
      id: 3,
      name: "Sam",
      email: "sam@example.com",
      ucaccess: "0",
      rcaccess: "1",
      scaccess: "1  ",
      bcaccess: "0",
      amuaccess: "0",
      uraccess: "0",
    },
  ];

  const renderCheckMark = (res) =>
    res === "0" ? (
      <FaCheck className="large-text text-green" />
    ) : (
      <TiCancel className="large-text text-red" />
    );

  const columns = [
    {
      title: "Username",
      render: (record) => (
        <div>
          <div className="text-black bolder">{record.name}</div>
          <div className="small-text text-light-grey">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Permission/Access",
      align: "center",
      children: [
        {
          title: "Upload CV",
          render: (record) => renderCheckMark(record.ucaccess),
          align: "center",
        },
        {
          title: "Search CV",
          render: (record) => renderCheckMark(record.scaccess),
          align: "center",
        },
        {
          title: "Rejected CV",
          render: (record) => renderCheckMark(record.rcaccess),
          align: "center",
        },
        {
          title: "Add/Manage User",
          render: (record) => renderCheckMark(record.amuaccess),
          align: "center",
        },
        {
          title: "User Report",
          render: (record) => renderCheckMark(record.uraccess),
          align: "center",
        },
        {
          title: "Build CV",
          render: (record) => renderCheckMark(record.bcaccess),
          align: "center",
        },
      ],
    },
    {
      title: "Action",
      render: (record) => (
        <Button
          type="primary"
          shape="round"
          icon={<EditOutlined />}
          onClick={() => {
            setEditData(record);
            toggleModal(true);
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <Header />
      {isModalOpen && (
        <UserForm
          isModalOpen={isModalOpen}
          setModal={toggleModal}
          editData={editData}
          setEditData={setEditData}
        />
      )}
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={"Add/Manage Users"}
        customFilterButton={
          <div>
            <Button
              className="button-primary filter-modal-button"
              type="primary"
              onClick={() => toggleModal(true)}
              icon={<PlusOutlined />}
            >
              New User
            </Button>
          </div>
        }
      />
      <div className="table">
        <Table
          dataSource={dummyData}
          columns={columns}
          loading={false}
          pagination={false}
          rowKey={"id"}
        />
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default UserManage;
