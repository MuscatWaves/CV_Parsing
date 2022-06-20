import React, { useEffect } from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Table, message } from "antd";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./searchcv.css";
import axios from "axios";
import Cookies from "universal-cookie";

const SearchCV = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("token");
  const navigateTo = (path) => {
    navigate(path);
  };

  const getData = async () => {
    await axios({
      method: "GET",
      url: `/api/searchcv.php`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
    })
    .then(function (response) {
      if (response.status === 200) {
        console.log(response);
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
  }

  const columns = [
    {
      title: "Image",
      width: "120px",
      render: (record) =>
        (record.image && (
          <img src={record.image} alt={"User"} width={90} />
        )) || (
          <div>
            <FiUser />
            <p>No Image</p>
          </div>
        ),
    },
    { title: "Name", dataIndex: "name", key: "name", width: "150px" },
    { title: "Job", dataIndex: "job", key: "job", width: "150px" },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
      ellipsis: true,
    },
    { title: "Gender", dataIndex: "gender", key: "gender", width: "120px" },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
      width: "180px",
    },
    { title: "DOB", dataIndex: "dob", key: "dob", width: "180px" },
    {
      title: "Last seen by",
      dataIndex: "last_seen_by",
      key: "last_seen_by",
      width: "120px",
      align: "center",
    },
  ];

  const data = [
    {
      key: "1",
      name: "Shaik Rashed",
      job: "Landscape Designer",
      education:
        "B.A from Dr Br Ambedkar university, Vinjamur, Andhra Pradesh - Pursuing ITI",
      gender: "Female",
      nationality: "Indian",
      dob: "18 April, 1987",
      image: "https://cv.omanjobs.om/files/images/pic-1655297426.png",
      last_seen_by: "Admin at 26/11/2022 8:12pm",
      id: "220808A22",
    },
    {
      key: "2",
      name: "MOHAMED HANEEFA.A.W",
      job: "Landscape Designer",
      education:
        "Draughtsman (CIVIL) (National Council for Vocational Training certificate) course done fromCSI ITC, Kaliyakkavilai, Tamilnadu. India, on Year 2010. ...",
      gender: "Male",
      nationality: "Indian",
      dob: "11 May, 1988",
      image: "https://cv.omanjobs.om/files/images/pic-1655296444.png",
    },
    {
      key: "3",
      name: "ROHITH JAGADEESWARAN",
      job: "Sales Engineer - Pump",
      education:
        "Draughtsman (CIVIL) (National Council for Vocational Training certificate) course done fromCSI ITC, Kaliyakkavilai, Tamilnadu. India, on Year 2010. ...",
      gender: "Male",
      nationality: "Indian",
      dob: "14 September, 1987",
      image: "https://cv.omanjobs.om/files/images/pic-1655295646.png",
    },
  ];

  useEffect(() => {
    getData();
  }, []);

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
            // loading={true}
          />
        </div>
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default SearchCV;
