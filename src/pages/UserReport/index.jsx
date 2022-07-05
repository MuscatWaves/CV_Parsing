import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";
import Cookies from "universal-cookie";
import Navigation from "../../components/Navigation";
import { Table, message } from "antd";

const UserReport = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const rootUrl =
    process.env.NODE_ENV === "production" ? "https://cv.omanjobs.om" : "";

  const getAllUserReportList = async () => {
    setLoading(true);
    await axios({
      method: "GET",
      url: `${rootUrl}/api/userlist.php`,
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
    getAllUserReportList();
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
    <div>
      <Header />
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={"User Reports"}
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

export default UserReport;
