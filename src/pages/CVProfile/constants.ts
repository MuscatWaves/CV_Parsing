export const categorySelection =  [
    {label: "Education", value: 0},
    {label: "Experience", value: 1},
    {label: "Test Score", value: 2},
    {label: "Passport Copy", value: 3},
    {label: "Driving License", value: 4, },
    {label: "Training Certificate", value: 5},
    {label: "Attested Certificate", value: 6},
    {label: "Reference Check", value: 7},
]

export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.17,
    },
  },
};

export const item = {
  hidden: {
    opacity: 0,
    y: "120px",
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 40,
      damping: 9,
    },
  },
};
