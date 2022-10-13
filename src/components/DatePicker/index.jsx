import React, { useState } from "react";
import { Select } from "antd";
import moment from "moment";
import "./datepicker.css";
import { makeYear, monthSelection } from "../../utilities";

const CustomDatePicker = ({ date, selectDate }) => {
  const [day, setDay] = useState(date && moment(date).format("DD"));
  const [month, setMonth] = useState(date && moment(date).format("MM"));
  const [year, setYear] = useState(date && moment(date).format("YYYY"));

  const range = (start, end) => {
    /* generate a range : [start, start+1, ..., end-1, end] */
    var len = end - start + 1;
    var a = new Array(len);
    for (let i = 0; i < len; i++) a[i] = start + i;
    return a;
  };

  const makeDays = () => {
    const days = range(1, moment(`${year}-${month}`, "YYYY-MM").daysInMonth());
    let newDays = [];
    days.map((day) => (newDays = [...newDays, { label: day, value: day }]));
    return newDays;
  };

  return (
    <div className="custom-datepicker">
      <div className="bold flex-small-gap">
        <span className="text-red">*</span> Date of Birth
      </div>
      <div className="custom-datepicker-wrapper">
        <Select
          label={"Year"}
          value={year}
          placeholder={"Year"}
          options={makeYear("birth")}
          onChange={(value) => {
            setMonth(null);
            setDay(null);
            setYear(value);
          }}
          showSearch
        />
        <Select
          label={"Month"}
          options={monthSelection}
          placeholder={"Month"}
          value={month}
          onChange={(value) => {
            setDay(null);
            setMonth(value);
          }}
          disabled={!year}
          showSearch
        />
        {
          <Select
            label={"Day"}
            value={day}
            options={month && year && makeDays()}
            onChange={(value) => {
              setDay(value);
              selectDate(moment(`${year}-${month}-${value}`, "YYYY/MM/DD"));
            }}
            placeholder={"Day"}
            disabled={!(month && year)}
            showSearch
          />
        }
      </div>
    </div>
  );
};

export default CustomDatePicker;
