import { RiUserSearchLine } from "react-icons/ri";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { RiFileUserLine } from "react-icons/ri";
import { TbFileUpload } from "react-icons/tb";
import { FiUserX } from "react-icons/fi";

export const cards = (isLoggedIn) => [
    {
      id: 1,
      name: "card1",
      icon: TbFileUpload,
      title: "Upload CV",
      description: "To upload bulk CV's for parsing",
      permission: isLoggedIn.uploadcv_access === 0 ? true : false,
      path: "/uploadcv",
    },
    {
      id: 2,
      name: "card2",
      icon: FiUserX,
      title: "Rejected CV",
      description: "Here are the list of the Rejected CV by API.",
      permission: isLoggedIn.rejectedcv_access === 0 ? true : false,
      path: "/rejectedcv",
    },
    {
      id: 3,
      name: "card3",
      icon: RiUserSearchLine,
      title: "Search CV",
      description: "Here, You can view all the CV with profile details.",
      permission: isLoggedIn.searchcv_access === 0 ? true : false,
      path: "/searchcv",
    },
    {
      id: 4,
      name: "card4",
      icon: RiFileUserLine,
      title: "Build CV",
      description: "Here you can Create CV for Jobseeker or Modify the CV.",
      permission: isLoggedIn.buildcv_access === 0 ? true : false,
      path: "/cv/create",
    },
    {
      id: 5,
      name: "card5",
      icon: AiOutlineUsergroupAdd,
      title: "Add/Manage User",
      description:
        "Here you can add/manage account to provide the access to this dashboard.",
      permission: isLoggedIn.type === 1 ? true : false,
      path: "/userManage",
    },
    {
      id: 6,
      name: "card6",
      icon: HiOutlineDocumentReport,
      title: "User Report",
      description:
        "Here you can View the User Report. How many CV uploaded by user.",
      permission: isLoggedIn.userreport_access === 0 ? true : false,
      path: "/userReport",
    },
  ];

  export const intial = {
    opacity: 0,
    x: "-50px",
  }

  export const animate = {
    opacity: 1,
    x: "0",
    transition: {
      type: "spring",
      damping: 8,
      stiffness: 40,
    },
  }

  export const c_intial = {
    opacity: 0,
    y: "-50px",
  }

  export const c_animate = {
    opacity: 1,
    y: "0",
    transition: {
      type: "spring",
      damping: 8,
      stiffness: 40,
    },
  }