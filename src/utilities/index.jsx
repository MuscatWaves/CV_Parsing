import moment from "moment";
import { categorySelection } from "../pages/CVProfile/constants";
import Cookies from "universal-cookie";
import { message } from "antd";
import { GiCancel } from "react-icons/gi";
import maleUserImage from "../images/male-user.png";
import femaleUserImage from "../images/female-user.png";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import axios from "axios";

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
  localStorage.removeItem("page");
  const cookies = new Cookies();
  cookies.set("token", "", { path: "/", expires: new Date(Date.now()) });
  message.success("Logged Out");
  navigate("/");
};

export const makeFiltered = (
  filterData,
  setFilterData,
  isLoading,
  getData,
  setPage
) => (
  <div className="filtered-list">
    {Object.keys(filterData).map(
      (filterValue, index) =>
        filterData[filterValue] && (
          <div
            className="each-filter flex-small-gap medium-text slide-in-left-animation"
            key={filterValue}
          >
            <div>{`${removeUnderScore(filterValue)} : ${
              (filterValue !== "searchByFromdate" &&
                filterValue !== "searchByTodate" &&
                removeUnderScore(filterData[filterValue])) ||
              filterData[filterValue]
            }`}</div>
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
                    setPage(1);
                    localStorage.setItem("page", JSON.stringify(1));
                    localStorage.setItem(
                      "filter",
                      JSON.stringify({ ...filterData, [filterValue]: "" })
                    );
                    getData(updateData, 1);
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
          setPage(1);
          localStorage.setItem("page", JSON.stringify(1));
          localStorage.setItem("filter", JSON.stringify({ ...newData }));
          getData(data, 1);
        }}
        style={{ marginBottom: "10px" }}
      >
        Reset All
      </div>
    )}
  </div>
);

export const checkImageIcon = (gender) =>
  gender.toLowerCase() === "male" ? maleUserImage : femaleUserImage;

export const TriggerCvDownload = ({
  setPdfDownloadLoading,
  CvDownload,
  userData,
}) => {
  setPdfDownloadLoading(true);
  message.info("Your pdf is being processed");
  var printMe = CvDownload.current;
  var HTML_Width = printMe.clientWidth;
  var HTML_Height = printMe.clientHeight;
  var top_left_margin = 15;
  var PDF_Width = HTML_Width + top_left_margin * 2;
  var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;
  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  htmlToImage.toPng(printMe).then(function (dataUrl) {
    var imgData = dataUrl;
    var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
    pdf.addImage(
      imgData,
      "PNG",
      top_left_margin,
      top_left_margin,
      canvas_image_width,
      canvas_image_height
    );

    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(
        imgData,
        "PNG",
        top_left_margin,
        -(PDF_Height * i) + top_left_margin * 4,
        canvas_image_width,
        canvas_image_height
      );
    }

    pdf.save(userData.user.name + ".pdf");
    setPdfDownloadLoading(false);
    message.success("Your pdf download has been successful");
  });
};

export const string = (str, isLoading) => {
  if (typeof str !== "string") {
    return "";
  }
  return (
    isLoading === "loaded" &&
    str
      .split(/\r\n|\n/)
      .map((line, i) =>
        line === "" ? <br key={i} /> : <div key={i}>{line}</div>
      )
  );
};

export const skills = (userData, isLoading) =>
  (isLoading === "loaded" &&
    userData.user.skills !== "" &&
    userData.user.skills.split(/\r\n|\n/)) ||
  "";

export const updateStatus = (id, type, list, setList) => {
  const newArray = list.map((each) => {
    if (each.id === id) {
      if (type === "upload") {
        return { ...each, upload: true };
      }
      if (type === "uploaded") {
        return { ...each, uploaded: true };
      }
      if (type === "error") {
        return { ...each, upload: false };
      }
    }
    return each;
  });
  setList(newArray);
};

export const showPdf = (url, setLoading) => {
  setLoading && setLoading(true);
  axios(`${url}`, {
    method: "GET",
    responseType: "blob", //Force to receive data in a Blob Format
  })
    .then((response) => {
      //Create a Blob from the PDF Stream
      const file = new Blob([response.data], { type: "application/pdf" });
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      window.open(fileURL);
      setLoading && setLoading(false);
    })
    .catch((error) => {
      message.error(error);
      setLoading && setLoading(false);
    });
};

export const showImage = (data) => {
  var image = new Image();
  image.src = data;

  var w = window.open("");
  w.document.write(image.outerHTML);
};
