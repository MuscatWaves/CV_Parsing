import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { FaCheck } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import Header from "../../components/Header";
import axios from "axios";
import Navigation from "../../components/Navigation";
import Cookies from "universal-cookie";
import moment from "moment";
import UserForm from "./UserForm";
import { useQuery } from "react-query";
import { m } from "framer-motion";

const UserManage = () => {
  const [isModalOpen, toggleModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const {
    data = [],
    isFetching,
    refetch,
  } = useQuery(
    ["usermanage"],
    () =>
      axios.get("/api/user", {
        headers: {
          Authorization: token,
        },
      }),
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    document.title = "User Manage";
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
          <div className="text-black bold">{record.name}</div>
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
      title: "Account Status",
      render: (record) => (
        <div className={record.status === 0 ? "text-green" : "text-red"}>
          {record.status === 0 ? "Active" : "Deactivated"}
        </div>
      ),
      width: "200px",
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
        {
          title: "User Reports",
          render: (record) => renderCheckMark(record.userreport_access),
          align: "center",
        },
        {
          title: "CV View/Download",
          render: (record) => renderCheckMark(record.cvView),
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
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      {isModalOpen && (
        <UserForm
          isModalOpen={isModalOpen}
          setModal={toggleModal}
          editData={editData}
          setEditData={setEditData}
          getData={refetch}
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
          dataSource={data.data?.data}
          columns={columns}
          loading={isFetching}
          pagination={false}
          rowKey={"id"}
        />
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </m.div>
  );
};

export default UserManage;
