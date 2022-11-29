import React from "react";
import { m } from "framer-motion";
import {
  martialStatusSelectOption,
  ageSelectOptions,
  genderSelectOptions,
} from "./constants.ts";
import { item } from "../CVProfile/constants";
import { Button, Select, Input, DatePicker } from "antd";
import dayjs from "dayjs";

const Filter = ({
  filterData,
  setFilterData,
  jobCategoryResult,
  nationalityResult,
  userRelatedData,
  onDateChange,
  toggleShow,
  refresh,
  setPage,
}) => {
  const { RangePicker } = DatePicker;
  return (
    <m.div
      className="filter-modal"
      variants={item}
      initial="hidden"
      animate="show"
    >
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
            value={[
              (dayjs(filterData.searchByFromdate).isValid() &&
                dayjs(filterData.searchByFromdate)) ||
                "",
              (dayjs(filterData.searchByTodate).isValid() &&
                dayjs(filterData.searchByTodate)) ||
                "",
            ]}
            presets={[
              { label: "Today", value: [dayjs(), dayjs()] },
              {
                label: "Yesterday",
                value: [dayjs().add(-1, "d"), dayjs().add(-1, "d")],
              },
              { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
              {
                label: "Last 14 Days",
                value: [dayjs().add(-14, "d"), dayjs()],
              },
              {
                label: "Last 30 Days",
                value: [dayjs().add(-30, "d"), dayjs()],
              },
              {
                label: "Last 90 Days",
                value: [dayjs().add(-90, "d"), dayjs()],
              },
            ]}
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
          <div className="bolder text-grey">Users</div>
          <Select
            className="select-options"
            value={filterData.user}
            options={userRelatedData.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            onChange={(value) => setFilterData({ ...filterData, user: value })}
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
          className=""
          type="text"
          onClick={() => {
            toggleShow(false);
            refresh();
            localStorage.setItem("filter", JSON.stringify(filterData));
          }}
        >
          Cancel
        </Button>
        <Button
          className="button-primary filter-search-button"
          type="primary"
          onClick={() => {
            setPage(1);
            refresh();
            toggleShow(false);
            localStorage.setItem("page", JSON.stringify(1));
            localStorage.setItem("filter", JSON.stringify(filterData));
          }}
        >
          Search
        </Button>
      </div>
    </m.div>
  );
};

export default Filter;
