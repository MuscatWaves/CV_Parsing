import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Table, message, Pagination } from "antd";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./searchcv.css";
import axios from "axios";
import Cookies from "universal-cookie";

const SearchCV = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const navigateTo = (path) => {
    navigate(path);
  };

  const getData = async () => {
    setLoading(true);
    await axios({
      method: "GET",
      url: `/api/searchcv.php`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      params: {
        row: page * 10 - 10,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          setData(response.data.data);
          page === 1 && setTotal(response.data.data[0].id);
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

  const onChange = (page) => {
    setPage(page);
  };

  const columns = [
    {
      title: "Image",
      width: "120px",
      key: "images",
      render: (record) =>
        (record.image && (
          <img
            src={`${window.location.origin}/files/images/${record.image}`}
            alt={"User"}
            width={90}
            className="image-user"
          />
        )) || (
          <div className="no-user">
            <FaUser className="no-user-icon" />
            <p>No Image</p>
          </div>
        ),
    },
    { title: "Name", dataIndex: "name", key: "name", width: "150px" },
    { title: "Job", dataIndex: "job", key: "id", width: "150px" },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
      ellipsis: true,
    },
    { title: "Gender", dataIndex: "gender", key: "id", width: "120px" },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "id",
      width: "180px",
    },
    {
      title: "DOB",
      render: (record) => <div>{record.DOB.replace("00:00:00", "")}</div>,
      key: "dob",
      width: "180px",
    },
    {
      title: "Last seen by",
      dataIndex: "last_seen_by",
      key: "last_seen_by",
      width: "120px",
      align: "center",
    },
  ];

  useEffect(() => {
    getData();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // eslint-disable-next-line
  }, [page]);

  return (
    <div className="searchCV">
      <Header />
      <div>
        <Navigation
          previous_page={"Dashboard"}
          previous_path={"/Dashboard"}
          current_page={"Search CV"}
        />
        <div className="table">
          <Table
            dataSource={data}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) =>
                  navigateTo(`/searchcv/profile/${record.id}`), // click row
              };
            }}
            columns={columns}
            responsive
            loading={isLoading}
            pagination={false}
          />
          <div className="pagination">
            <div className="pagination-total">{`Showing ${
              page === 1 ? 1 : page * 10 - 10
            } to ${page * 10} of ${total}`}</div>
            <Pagination
              current={page}
              onChange={onChange}
              total={total}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default SearchCV;
