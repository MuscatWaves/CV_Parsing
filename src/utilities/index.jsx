import moment from "moment";

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
