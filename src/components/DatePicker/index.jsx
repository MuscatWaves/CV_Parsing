import React, { useState } from "react";
import { Select } from "antd";
import moment from "moment";
import "./datepicker.css";

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

  const makeYear = () => {
    const yearSelection = range(1950, moment().year());
    let newYear = [];
    yearSelection.map(
      (year) => (newYear = [...newYear, { label: year, value: year }])
    );
    return newYear;
  };

  const makeDays = () => {
    const days = range(1, moment(`${year}-${month}`, "YYYY-MM").daysInMonth());
    let newDays = [];
    days.map((day) => (newDays = [...newDays, { label: day, value: day }]));
    return newDays;
  };

  const monthSelection = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  return (
    <div className="custom-datepicker">
      <div className="bold">Date of Birth</div>
      <div className="custom-datepicker-wrapper">
        <Select
          label={"Year"}
          value={year}
          placeholder={"Year"}
          options={makeYear()}
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
        <Select
          label={"Day"}
          value={day}
          options={month && year && makeDays()}
          onChange={(value) => {
            setDay(value);
            selectDate(moment(`${year}-${month}-${value}`));
          }}
          placeholder={"Day"}
          disabled={!(month && year)}
          showSearch
        />
      </div>
    </div>
  );
};

export default CustomDatePicker;
