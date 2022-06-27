import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import {
  Table,
  message,
  Pagination,
  Button,
  Select,
  Input,
  DatePicker,
} from "antd";
import { FaUser, FaFilter } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { RiMessage3Fill } from "react-icons/ri";
import { GiCancel } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import moment from "moment";
import {
  martialStatusSelectOption,
  ageSelectOptions,
  genderSelectOptions,
} from "./constants.ts";
import { removeUnderScore } from "../../utilities";
import "./searchcv.css";

const SearchCV = () => {
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };
  const { RangePicker } = DatePicker;
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [jobCategoryResult, setJobCategoryResult] = useState([]);
  const [nationalityResult, setNationalityResult] = useState([]);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [filterData, setFilterData] = useState({
    jobTitle: "",
    name: "",
    jobCategory: "",
    maritalStatus: "",
    age: "",
    gender: "",
    nationality: "",
    searchByFromdate: "",
    searchByTodate: "",
  });

  const [show, toggleShow] = useState(false);

  const onChange = (page) => {
    setPage(page);
  };

  const onDateChange = (dates, dateStrings) => {
    if (dates) {
      setFilterData({
        ...filterData,
        searchByFromdate: dates[0],
        searchByTodate: dates[1],
      });
    } else {
      setFilterData({ ...filterData, from: "", to: "" });
    }
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

  const getData = async (data) => {
    console.log(data);
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
        MaritalStatus: data.MaritalStatus,
        searchByFromdate: data.SearchByFromdate,
        searchByTodate: data.SearchByTodate,
        JobTitle: data.JobTitle,
        Age: data.Age,
        JobCategory: data.JobCategory,
        Nationality: data.Nationality,
        Gender: data.Gender,
        Search: data.Search,
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
        <div
          className="pointer"
          onClick={() => navigateTo(`/searchcv/profile/app/${record.id}`)}
        >
          <div className="text-black">{record.name}</div>
          <div className="small-text text-grey">{`${record.nationality}, ${
            record.gender
          } (${moment().diff(
            moment(record.DOB).format("YYYY-MM-DD"),
            "years"
          )})`}</div>
          <div className="very-small-text text-light-grey">{`Last seen by ${
            record.username || "Nobody"
          } ${
            (record.username &&
              "at " + moment(record.seendate).format("D MMMM YYYY hh:mm a")) ||
            ""
          }`}</div>
        </div>
      ),
    },
    { title: "Job", dataIndex: "job", width: "250px" },
    {
      title: "Education",
      dataIndex: "education",
      ellipsis: true,
    },
    {
      title: "Skills",
      dataIndex: "skills",
      ellipsis: true,
    },
    {
      title: "Email",
      render: (record) => (
        <div
          className="pointer link flex-small-gap"
          onClick={() =>
            window.open(
              `mailto:${record.email}?subject=${encodeURIComponent(
                "Oman Jobs"
              )}&body=${encodeURIComponent("For Recruiter - Write here")}`
            )
          }
        >
          <HiMail className="large-text" />
          {record.email}
        </div>
      ),
      width: "320px",
    },
    {
      title: "Phone",
      render: (record) =>
        record.mobile && (
          <div
            className="pointer link-green flex-small-gap"
            onClick={() => window.open(`https://wa.me/${record.mobile}`)}
          >
            <RiMessage3Fill className="large-text" />
            {record.mobile}
          </div>
        ),
      width: "200px",
    },
  ];

  useEffect(() => {
    getJobCategoryCount();
    getNationalityCount();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    refresh();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // eslint-disable-next-line
  }, [page]);

  const refresh = () => {
    const data = {
      SearchByFromdate:
        (filterData.searchByFromdate &&
          moment(filterData.searchByFromdate).format("YYYY-MM-DD")) ||
        "",
      SearchByTodate:
        (filterData.searchByTodate &&
          moment(filterData.searchByTodate).format("YYYY-MM-DD")) ||
        "",
      JobTitle: filterData.jobTitle,
      Age: filterData.age,
      JobCategory: filterData.jobCategory,
      Nationality: filterData.nationality,
      Gender: filterData.gender,
      MaritalStatus: filterData.maritalStatus,
      Search: filterData.name,
    };
    getData(data);
  };

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
            value={filterData.maritalStatus}
            options={martialStatusSelectOption}
            onChange={(value) =>
              setFilterData({ ...filterData, maritalStatus: value })
            }
          />
        </div>
        <div className="each-filter-modal-inner">
          <div className="bolder text-grey">Date Selection</div>
          <RangePicker
            value={[filterData.searchByFromdate, filterData.searchByTodate]}
            ranges={{
              Today: [moment(), moment()],
              Yesterday: [
                moment().subtract(1, "day"),
                moment().subtract(1, "day"),
              ],
              "Last 30 Days": [moment().subtract(30, "days"), moment()],
              "This Month": [moment().startOf("month"), moment()],
              "Last Month": [
                moment().subtract(1, "month").startOf("month"),
                moment().subtract(1, "month").endOf("month"),
              ],
            }}
            onChange={onDateChange}
          />
        </div>
        <div className="each-filter-modal-inner">
          <div className="bolder text-grey">Job Title</div>
          <Input
            value={filterData.jobTitle}
            onChange={(e) =>
              setFilterData({ ...filterData, jobTitle: e.target.value })
            }
          />
        </div>
        <div className="each-filter-modal-inner">
          <div className="bolder text-grey">Name</div>
          <Input
            value={filterData.name}
            onChange={(e) =>
              setFilterData({ ...filterData, name: e.target.value })
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
        <Button className="" type="text" onClick={() => toggleShow(false)}>
          Cancel
        </Button>
        <Button
          className="button-primary filter-search-button"
          type="primary"
          onClick={() => {
            setPage(1);
            refresh();
            toggleShow(false);
          }}
        >
          Search
        </Button>
      </div>
    </div>
  );

  const makeFiltered = () => (
    <div className="filtered-list">
      {Object.keys(filterData).map(
        (filterValue, index) =>
          filterData[filterValue] && (
            <div
              className="each-filter flex-small-gap medium-text"
              key={filterValue}
            >
              <div>{`${removeUnderScore(filterValue)}: ${
                filterData[filterValue]
              }`}</div>
              <GiCancel
                className="pointer medium-text"
                onClick={() => {
                  setFilterData({ ...filterData, [filterValue]: "" });
                  const data = {
                    SearchByFromdate:
                      (filterData.searchByFromdate &&
                        moment(filterData.searchByFromdate).format(
                          "YYYY-MM-DD"
                        )) ||
                      "",
                    SearchByTodate:
                      (filterData.searchByTodate &&
                        moment(filterData.searchByTodate).format(
                          "YYYY-MM-DD"
                        )) ||
                      "",
                    JobTitle: filterData.jobTitle,
                    Age: filterData.age,
                    JobCategory: filterData.jobCategory,
                    Nationality: filterData.nationality,
                    Gender: filterData.gender,
                    MaritalStatus: filterData.maritalStatus,
                    Search: filterData.name,
                  };
                  const updateData = {
                    ...data,
                    [removeUnderScore(filterValue)]: "",
                  };
                  getData(updateData);
                }}
              />
            </div>
          )
      )}
      {Object.keys(filterData).filter(
        (filterValue, index) => filterData[filterValue]
      ).length > 0 && (
        <div
          className="bolder small-text pointer link"
          // key={index}
          onClick={() => {
            setFilterData({
              jobTitle: "",
              name: "",
              jobCategory: "",
              maritalStatus: "",
              age: "",
              gender: "",
              nationality: "",
              searchByFromdate: "",
              searchByTodate: "",
            });

            const data = {
              SearchByFromdate: "",
              SearchByTodate: "",
              JobTitle: "",
              Age: "",
              JobCategory: "",
              Nationality: "",
              Gender: "",
              MaritalStatus: "",
              Search: "",
            };
            getData(data);
          }}
          style={{ marginBottom: "10px" }}
        >
          Reset All
        </div>
      )}
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
              onClick={() => toggleShow(true)}
            >
              <FaFilter className="filter-icon" /> Filter
            </Button>
          }
        />
        <div className="table">
          {(show && Filter()) || makeFiltered()}
          <Table
            dataSource={data.data}
            columns={columns}
            loading={isLoading}
            pagination={false}
            rowKey={"id"}
          />
          <div className="pagination">
            <div className="pagination-total">{`Showing ${
              page === 1 ? 1 : page * 10 - 10 + 1
            } to ${page * 10 > total ? total : page * 10} of ${total}`}</div>
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
