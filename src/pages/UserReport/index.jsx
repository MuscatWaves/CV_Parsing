import React, { useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";
import Navigation from "../../components/Navigation";
import { Table } from "antd";
import { m } from "framer-motion";
import { useQuery } from "react-query";

const UserReport = () => {
  const { data = [], isFetching } = useQuery(["usermanage"], () =>
    axios.get("/api/userlist.php")
  );

  useEffect(() => {
    document.title = "User Report";
    // eslint-disable-next-line
  }, []);

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
      render: (record) => (
        <div>{record.type === 1 ? "Main Account" : "Sub Account"}</div>
      ),
    },
    {
      title: "Uploaded",
      render: (record) => (
        <div className="text-blue">{record.pending + record.parsed}</div>
      ),
    },
    {
      title: "Pending/Failed",
      render: (record) => <div className="text-red">{record.pending}</div>,
    },
    {
      title: "Parsed",
      render: (record) => <div className="text-green">{record.parsed}</div>,
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
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={"User Reports"}
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

export default UserReport;

//  Before - 117
//  After -
