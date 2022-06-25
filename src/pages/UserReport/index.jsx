import React from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Table } from "antd";

const UserReport = () => {
  const dummyData = [
    {
      id: 1,
      name: "User 1",
      email: "user@email.com",
      type: "Main-Account",
      uploaded_cv: 28,
      pending_failed: 229,
      parsed: 58,
    },
    {
      id: 2,
      name: "User 2",
      email: "user2@email.com",
      type: "Sub-Account",
      uploaded_cv: 128,
      pending_failed: 329,
      parsed: 582,
    },
    {
      id: 3,
      name: "User 3",
      email: "user3@email.com",
      type: "Sub-Account",
      uploaded_cv: 900,
      pending_failed: 2,
      parsed: 522,
    },
    {
      id: 4,
      name: "User 4",
      email: "user4@email.com",
      type: "Sub-Account",
      uploaded_cv: 3328,
      pending_failed: 2329,
      parsed: 5822,
    },
    {
      id: 1,
      name: "User 5",
      email: "user5@email.com",
      type: "Sub-Account",
      uploaded_cv: 28,
      pending_failed: 29,
      parsed: 582,
    },
    {
      id: 6,
      name: "User 6",
      email: "user6@email.com",
      type: "Sub-Account",
      uploaded_cv: 2328,
      pending_failed: 22329,
      parsed: 58223,
    },
  ];

  const columns = [
    {
      title: "Name",
      render: (record) => (
        <div>
          <div className="text-black bolder">{record.name}</div>
          <div className="small-text text-light-grey">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Account Type",
      dataIndex: "type",
    },
    {
      title: "Uploaded",
      render: (record) => <div className="text-blue">{record.uploaded_cv}</div>,
    },
    {
      title: "Pending/Failed",
      render: (record) => (
        <div className="text-red">{record.pending_failed}</div>
      ),
    },
    {
      title: "Parsed",
      render: (record) => <div className="text-green">{record.parsed}</div>,
    },
  ];

  return (
    <div>
      <Header />
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={"User Reports"}
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

export default UserReport;
