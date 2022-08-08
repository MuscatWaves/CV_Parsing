import moment from "moment";
import { categorySelection } from "../pages/CVProfile/constants";
import Cookies from "universal-cookie";
import { message } from "antd";
import { GiCancel } from "react-icons/gi";

export const removeUnderScore = (str) => {
  var i,
    frags = str.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
};

export const monthSelection = [
  { label: "January", value: "01", code: "Jan" },
  { label: "February", value: "02", code: "Feb" },
  { label: "March", value: "03", code: "Mar" },
  { label: "April", value: "04", code: "April" },
  { label: "May", value: "05", code: "May" },
  { label: "June", value: "06", code: "Jun" },
  { label: "July", value: "07", code: "Jul" },
  { label: "August", value: "08", code: "Aug" },
  { label: "September", value: "09", code: "Sep" },
  { label: "October", value: "10", code: "Oct" },
  { label: "November", value: "11", code: "Nov" },
  { label: "December", value: "12", code: "Dec" },
];

export const monthSelectionLabel = [
  { label: "January", value: "January", code: "Jan" },
  { label: "February", value: "February", code: "Feb" },
  { label: "March", value: "March", code: "Mar" },
  { label: "April", value: "April", code: "Apr" },
  { label: "May", value: "May", code: "May" },
  { label: "June", value: "June", code: "Jun" },
  { label: "July", value: "July", code: "Jul" },
  { label: "August", value: "August", code: "Aug" },
  { label: "September", value: "September", code: "Sep" },
  { label: "October", value: "October", code: "Oct" },
  { label: "November", value: "November", code: "Nov" },
  { label: "December", value: "December", code: "Dec" },
  { label: "Present", value: "Present", code: "Present" },
];

export const makeYear = (birth) => {
  const range = (start, end) => {
    /* generate a range : [start, start+1, ..., end-1, end] */
    var len = end - start + 1;
    var a = new Array(len);
    for (let i = 0; i < len; i++) a[i] = start + i;
    return a;
  };
  let newYear = [];
  const yearSelection = range(1950, moment().year());
  yearSelection.map(
    (year) => (newYear = [...newYear, { label: year, value: String(year) }])
  );
  return birth ? newYear : newYear.reverse();
};

export const codeMonth = (value) => {
  const month = monthSelectionLabel.filter((month) => month.value === value);
  return month[0].code;
};

export const checkCategory = (cat, desc) => {
  const data = categorySelection.filter(
    (category) => category.value === Number(cat)
  )[0];
  return data.label;
};

export const groupBy = (array, property) => {
  var hash = {};
  for (var i = 0; i < array.length; i++) {
    if (!hash[array[i][property]]) hash[array[i][property]] = [];
    hash[array[i][property]].push(array[i]);
  }
  return hash;
};

export const checkWhichFile = (cv) => {
  var n = cv?.split(".");
  return n[n.length - 1];
};

export const removeCookie = (navigate) => {
  localStorage.removeItem("filter");
  const cookies = new Cookies();
  cookies.set("token", "", { path: "/", expires: new Date(Date.now()) });
  message.success("Logged Out");
  navigate("/");
};

export const makeFiltered = (filterData, setFilterData, isLoading, getData) => (
  <div className="filtered-list">
    {Object.keys(filterData).map(
      (filterValue, index) =>
        filterData[filterValue] && (
          <div
            className="each-filter flex-small-gap medium-text slide-in-left-animation"
            key={filterValue}
          >
            <div>{`${removeUnderScore(filterValue)} : ${removeUnderScore(
              filterData[filterValue]
            )}`}</div>
            {filterValue !== "searchByFromdate" &&
              filterValue !== "searchByTodate" &&
              !isLoading && (
                <GiCancel
                  className="pointer medium-text fade-in-animation"
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
                    localStorage.setItem(
                      "filter",
                      JSON.stringify({ ...filterData, [filterValue]: "" })
                    );
                  }}
                />
              )}
          </div>
        )
    )}
    {Object.keys(filterData).filter(
      (filterValue, index) => filterData[filterValue]
    ).length > 0 && (
      <div
        className="bolder small-text pointer link"
        onClick={() => {
          const newData = {
            jobTitle: "",
            name: "",
            jobCategory: "",
            maritalStatus: "",
            age: "",
            gender: "",
            nationality: "",
            searchByFromdate: "",
            searchByTodate: "",
          };
          setFilterData(newData);
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
          localStorage.setItem("filter", JSON.stringify({ ...newData }));
        }}
        style={{ marginBottom: "10px" }}
      >
        Reset All
      </div>
    )}
  </div>
);
