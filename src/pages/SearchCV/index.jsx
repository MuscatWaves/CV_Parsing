import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Table, message, Pagination, Button, Select, Input } from "antd";
import { FaUser, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import moment from "moment";
import {
  martialStatusSelectOption,
  ageSelectOptions,
  genderSelectOptions,
} from "./constants.ts";
import "./searchcv.css";

const SearchCV = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [jobCategoryResult, setJobCategoryResult] = useState([]);
  const [nationalityResult, setNationalityResult] = useState([]);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const navigateTo = (path) => {
    navigate(path);
  };
  const [filterData, setFilterData] = useState({
    jobTitle: "",
    name: "",
    jobCategory: "",
    martialStatus: "",
    age: "",
    gender: "",
    nationality: "",
  });

  const [show, toggleShow] = useState(false);

  const onChange = (page) => {
    setPage(page);
  };

  const getJobCategoryCount = async () => {
    setLoading(true);
    await axios({
      method: "GET",
      url: `/api/countget.php?category=true`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          const result = response.data.map((item) => ({
            label: `${!item.category ? "None" : item.category} - (${
              !item.category ? "All" : item.cnt
            })`,
            value: `${!item.category ? "" : item.category}`,
          }));
          setJobCategoryResult(result);
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

  const getNationalityCount = async () => {
    setLoading(true);
    await axios({
      method: "GET",
      url: `/api/countget.php?nationality=true`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          const result = response.data.map((item) => ({
            label: `${!item.nationality ? "None" : item.nationality} - (${
              !item.nationality ? "All" : item.cnt
            })`,
            value: item.nationality,
          }));
          setNationalityResult(result);
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
        searchByFromdate: "",
        searchByTodate: "",
        JobTitle: filterData.jobTitle,
        Age: filterData.age,
        JobCategory: filterData.jobCategory,
        Nationality: filterData.nationality,
        Gender: filterData.gender,
        MaritalStatus: filterData.martialStatus,
        Search: filterData.name,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          setData(response.data);
          setTotal(response.data.TotalDisplayRecords);
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

  const columns = [
    {
      title: "Image",
      width: "120px",
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
    {
      title: "Name",
      width: "250px",
      render: (record) => (
        <div>
          <div className="text-black">{record.name}</div>
          <div className="small-text text-grey">{record.email}</div>
          <div className="very-small-text text-light-grey">{`Last seen by ${
            record.username
          } at ${moment(record.seendate).format("D MMMM YYYY hh:mm a")}`}</div>
        </div>
      ),
    },
    { title: "Job", dataIndex: "job", width: "150px" },
    {
      title: "Education",
      dataIndex: "education",
      ellipsis: true,
    },
    { title: "Gender", dataIndex: "gender", width: "120px" },
    {
      title: "Nationality",
      dataIndex: "nationality",
      width: "150px",
    },
    {
      title: "DOB",
      render: (record) => <div>{record.DOB.replace("00:00:00", "")}</div>,
      width: "150px",
    },
  ];

  useEffect(() => {
    getJobCategoryCount();
    getNationalityCount();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getData();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // eslint-disable-next-line
  }, [page]);

  const Filter = () => (
    <div className="filter-modal slide-in-top-animation">
      <div className="medium-text bolder text-black">Filter Options</div>
      <div className="filter-modal-inner">
        <div className="each-filter-modal-inner">
          <div className="bolder text-grey">Age</div>
          <Select
            className="select-options"
            value={filterData.age}
            options={ageSelectOptions}
            onChange={(value) => setFilterData({ ...filterData, age: value })}
          />
        </div>
        <div className="each-filter-modal-inner">
          <div className="bolder text-grey">Job Category</div>
          <Select
            className="select-options"
            value={filterData.jobCategory}
            options={jobCategoryResult}
            onChange={(value) =>
              setFilterData({ ...filterData, jobCategory: value })
            }
          />
        </div>
        <div className="each-filter-modal-inner">
          <div className="bolder text-grey">Nationality</div>
          <Select
            className="select-options"
            value={filterData.nationality}
            options={nationalityResult}
            onChange={(value) =>
              setFilterData({ ...filterData, nationality: value })
            }
          />
        </div>
        <div className="each-filter-modal-inner">
          <div className="bolder text-grey">Gender</div>
          <Select
            className="select-options"
            value={filterData.gender}
            options={genderSelectOptions}
            onChange={(value) =>
              setFilterData({ ...filterData, gender: value })
            }
          />
        </div>
        <div className="each-filter-modal-inner">
          <div className="bolder text-grey">Maratial Status</div>
          <Select
            className="select-options"
            value={filterData.martialStatus}
            options={martialStatusSelectOption}
            onChange={(value) =>
              setFilterData({ ...filterData, martialStatus: value })
            }
          />
        </div>
        <div className="each-filter-modal-inner">
          <div className="bolder text-grey">Job Title</div>
          <Input
            value={filterData.jobTitle}
            onChange={(value) =>
              setFilterData({ ...filterData, jobTitle: value })
            }
          />
        </div>
      </div>
      <hr
        style={{
          height: "1px",
          width: "100%",
          borderColor: "white",
          backgroundColor: "grey",
        }}
      />
      <div className="filter-section-division">
        <Button
          className="button-primary filter-search-button"
          type="primary"
          onClick={() => getData()}
        >
          Search
        </Button>
      </div>
    </div>
  );

  return (
    <div className="searchCV">
      <Header />
      <div>
        <Navigation
          previous_page={"Dashboard"}
          previous_path={"/Dashboard"}
          current_page={"Search CV"}
          customFilterButton={
            <Button
              className="button-primary filter-modal-button"
              type="primary"
              onClick={() => toggleShow(!show)}
            >
              <FaFilter className="filter-icon" /> Filter
            </Button>
          }
        />
        <div className="table">
          {show && Filter()}
          <Table
            dataSource={data.data}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) =>
                  navigateTo(`/searchcv/profile/${record.id}`), // click row
              };
            }}
            columns={columns}
            loading={isLoading}
            pagination={false}
            rowKey={"id"}
          />
          <div className="pagination">
            <div className="pagination-total">{`Showing ${
              page === 1 ? 1 : page * 10 - 10
            } to ${page * 10} of ${total}`}</div>
            <Pagination
              current={page}
              onChange={onChange}
              total={data.TotalDisplayRecords}
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
