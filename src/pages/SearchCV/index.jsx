import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { Table, message, Pagination, Button, Input, Popover } from "antd";
import { FaFilter } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { RiMessage3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import moment from "moment";
import { makeFiltered, checkImageIcon } from "../../utilities";
import { FaSearch } from "react-icons/fa";
import { m } from "framer-motion";
import { useQuery } from "react-query";
import "./searchcv.css";
import Filter from "./Filter";

const SearchCV = () => {
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };
  const history = JSON.parse(localStorage.getItem("filter"));
  const pageHistory = JSON.parse(localStorage.getItem("page"));
  const [isLoading, setLoading] = useState(false);
  const [show, toggleShow] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(pageHistory || 1);
  const [total, setTotal] = useState(0);
  const [isSearchPop, toggleSearchPop] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [filterData, setFilterData] = useState({
    jobTitle: history ? history.jobTitle : "",
    name: history ? history.name : "",
    jobCategory: history ? history.jobCategory : "",
    maritalStatus: history ? history.maritalStatus : "",
    age: history ? history.age : "",
    gender: history ? history.gender : "",
    nationality: history ? history.nationality : "",
    searchByFromdate: history ? history.searchByFromdate : "",
    searchByTodate: history ? history.searchByTodate : "",
  });

  const { data: nationalityResult } = useQuery(
    ["nationality"],
    () => axios.get("/api/nationality"),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const newData = data.data.data.map((item) => ({
          label: `${!item.nationality ? "None" : item.nationality} - (${
            !item.nationality ? "All" : item.cnt
          })`,
          value: item.nationality,
        }));
        return newData;
      },
    }
  );

  const { data: jobCategoryResult } = useQuery(
    ["category"],
    () => axios.get("/api/category"),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        const newData = data.data.data.map((item) => ({
          label: `${!item.category ? "None" : item.category} - (${
            !item.category ? "All" : item.cnt
          })`,
          value: `${!item.category ? "" : item.category}`,
        }));
        return newData;
      },
    }
  );

  const onChange = (page) => {
    localStorage.setItem("page", JSON.stringify(page));
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

  const getData = async (data, page) => {
    setLoading(true);
    let config = {
      headers: {
        Authorization: token,
      },
      params: {
        page: page,
        search: data.Search,
        JobCategory: data.JobCategory,
        Age: data.Age,
        JobTitle: data.JobTitle,
        Nationality: data.Nationality,
        Gender: data.Gender,
        MaritalStatus: data.MaritalStatus,
        // searchByFromdate: data.SearchByFromdate,
        // searchByTodate: data.SearchByTodate,
      },
    };
    try {
      const Data = await axios.get(`/api/cv`, config);
      if (Data.status === 200) {
        setLoading(false);
        setData(Data.data);
        setTotal(Data.data.TotalDisplay[0].total);
      } else {
        if (Data.status === 201) {
          message.error(Data.data.error, "error");
        } else {
          message.error("Something Went Wrong!");
        }
      }
    } catch (err) {
      message.error("Something Went Wrong!");
    }
  };

  const columns = [
    {
      title: "Image",
      width: "120px",
      render: (record) => (
        <img
          src={
            record.image
              ? `/files/images/${record.image}`
              : checkImageIcon(record.gender)
          }
          alt={"User"}
          width={90}
          className="image-user"
        />
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
        <div className="flex-small-gap-column">
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
          {record.alt_email && (
            <div
              className="pointer link flex-small-gap"
              onClick={() =>
                window.open(
                  `mailto:${record.alt_email}?subject=${encodeURIComponent(
                    "Oman Jobs"
                  )}&body=${encodeURIComponent("For Recruiter - Write here")}`
                )
              }
            >
              <HiMail className="large-text" />
              {record.alt_email}
            </div>
          )}
        </div>
      ),
      width: "320px",
    },
    {
      title: "Phone",
      render: (record) => (
        <div className="flex-small-gap-column">
          {record.mobile && (
            <div
              className="pointer link-green flex-small-gap"
              onClick={() => window.open(`https://wa.me/${record.mobile}`)}
            >
              <RiMessage3Fill className="large-text" />
              {record.mobile}
            </div>
          )}
          {record.alt_phone && (
            <div
              className="pointer link-green flex-small-gap"
              onClick={() => window.open(`https://wa.me/${record.alt_phone}`)}
            >
              <RiMessage3Fill className="large-text" />
              {record.alt_phone}
            </div>
          )}
        </div>
      ),
      width: "200px",
    },
  ];

  useEffect(() => {
    document.title = "Search CV";
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
    getData(data, page);
  };

  const searchContainer = () => (
    <div className="flex-small-gap">
      <Input
        placeholder="Type to search..."
        value={filterData.name}
        onChange={(e) => setFilterData({ ...filterData, name: e.target.value })}
        onPressEnter={() => {
          setPage(1);
          refresh();
          localStorage.setItem("page", JSON.stringify(1));
          localStorage.setItem(
            "filter",
            JSON.stringify({ ...filterData, name: filterData.name })
          );
          toggleSearchPop(false);
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          setPage(1);
          refresh();
          localStorage.setItem("page", JSON.stringify(1));
          localStorage.setItem(
            "filter",
            JSON.stringify({ ...filterData, name: filterData.name })
          );
          toggleSearchPop(false);
        }}
      >
        Search
      </Button>
    </div>
  );

  return (
    <m.div
      className="searchCV"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <div>
        <Navigation
          previous_page={"Dashboard"}
          previous_path={"/Dashboard"}
          current_page={"Search CV"}
          customFilterButton={
            <div className="flex-small-gap">
              <Popover
                placement="rightBottom"
                title={""}
                content={searchContainer}
                trigger="click"
                visible={isSearchPop}
                onVisibleChange={toggleSearchPop}
              >
                <Button
                  className="button-primary filter-modal-button"
                  type="primary"
                  loading={isLoading}
                >
                  <FaSearch className="filter-icon" />
                </Button>
              </Popover>
              <Button
                className="button-primary filter-modal-button"
                type="primary"
                onClick={() => {
                  toggleShow(true);
                }}
                loading={isLoading}
              >
                <FaFilter className="filter-icon" />
              </Button>
            </div>
          }
        />
        <div className="table">
          {show && (
            <Filter
              filterData={filterData}
              setFilterData={setFilterData}
              jobCategoryResult={jobCategoryResult}
              nationalityResult={nationalityResult}
              onDateChange={onDateChange}
              toggleShow={toggleShow}
              refresh={refresh}
              setPage={setPage}
            />
          )}
          {Object.keys(filterData).filter(
            (filterValue, _index) => filterData[filterValue]
          ).length > 0 &&
            !show &&
            !isSearchPop &&
            makeFiltered(
              filterData,
              setFilterData,
              isLoading,
              getData,
              setPage
            )}
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
              total={total}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </m.div>
  );
};

export default SearchCV;
