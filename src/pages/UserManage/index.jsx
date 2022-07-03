import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import { FaCheck } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import axios from "axios";
import Cookies from "universal-cookie";
import Navigation from "../../components/Navigation";
import moment from "moment";
import UserForm from "./UserForm";

const UserManage = () => {
  const [isModalOpen, toggleModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const cookies = new Cookies();
  const token = cookies.get("token");

  const getAllUserManageList = async () => {
    setLoading(true);
    await axios({
      method: "GET",
      url: `/api/userlist.php`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      params: {
        row: 0,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          setData(response.data);
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

  useEffect(() => {
    getAllUserManageList();
    // eslint-disable-next-line
  }, []);

  const renderCheckMark = (res) =>
    res === 0 ? (
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
          <div className="small-text text-grey">{record.email}</div>
          <div className="very-small-text text-light-grey">
            {`Created on ${moment(record.created).format(
              "D MMMM YYYY hh:mm a"
            )}`}
          </div>
        </div>
      ),
      width: "350px",
    },
    {
      title: "Status",
      render: (record) => (
        <div className={record.status === 0 ? "text-green" : "text-red"}>
          {record.status === 0 ? "Active" : "Inactive"}
        </div>
      ),
      width: "150px",
    },
    {
      title: "Permission/Access",
      align: "center",
      children: [
        {
          title: "Upload CV",
          render: (record) => renderCheckMark(record.uploadcv_access),
          align: "center",
        },
        {
          title: "Search CV",
          render: (record) => renderCheckMark(record.searchcv_access),
          align: "center",
        },
        {
          title: "Rejected CV",
          render: (record) => renderCheckMark(record.rejectedcv_access),
          align: "center",
        },
        {
          title: "Build CV",
          render: (record) => renderCheckMark(record.buildcv_access),
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
      width: "150px",
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
          getData={getAllUserManageList}
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
          dataSource={data.data}
          columns={columns}
          loading={isLoading}
          pagination={false}
          rowKey={"id"}
        />
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default UserManage;
