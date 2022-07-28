import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import {
  removeUnderScore,
  codeMonth,
  checkCategory,
  groupBy,
  checkWhichFile,
} from "../../utilities";
import {
  DownOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { AiFillEdit, AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import {
  Button,
  Dropdown,
  Space,
  Menu,
  message,
  Table,
  Modal,
  Select,
  Form,
  Upload,
} from "antd";
import {
  FaUserCheck,
  FaFileDownload,
  FaClipboard,
  FaWhatsapp,
  FaUserEdit,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FcShare } from "react-icons/fc";
import { MdOutlineDeleteOutline } from "react-icons/md";
import axios from "axios";
import Cookies from "universal-cookie";
import moment from "moment";
import Loader from "../../components/Loader";
import { categorySelection, container, item } from "./constants.ts";
import jwt from "jsonwebtoken";
import "./cvprofile.css";
import { useNavigate } from "react-router-dom";
import maleUserImage from "../../images/male-user.png";
import femaleUserImage from "../../images/female-user.jpg";
import ojimage from "../../images/oj.png";
import FormData from "form-data";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import UpdateWork from "./UpdateWork";
import UpdateEducation from "./UpdateEducation";
import { m } from "framer-motion";

const CVprofile = () => {
  const dataParams = useParams();
  const [form] = Form.useForm();
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [userData, setUserData] = useState({
    user: {},
    attachments: [],
    educations: [],
    experience: [],
  });
  const [isLoading, setLoading] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [deleteModal, toggleDeleteModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [deletionData, setDeletionData] = useState("");
  const [isUploadModal, toggleUploadModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const CvDownload = useRef();
  const [isPdfDownloadLoading, setPdfDownloadLoading] = useState(false);

  // Update Work Experience

  const [isUpdateWeModal, setUpdateWeModal] = useState(false);
  const [updateWeData, setUpdateWeData] = useState({});
  const [isDeleteWeModal, setDeleteWeModal] = useState(false);
  const [deleteWeData, setDeleteWeData] = useState("");
  const [isDeleteWeLoading, setDeleteWeLoading] = useState(false);

  // Update Education

  const [isUpdateEduModal, setUpdateEduModal] = useState(false);
  const [updateEduData, setUpdateEduData] = useState({});
  const [isDeleteEduModal, setDeleteEduModal] = useState(false);
  const [deleteEduData, setDeleteEduData] = useState("");
  const [isDeleteEduLoading, setDeleteEduLoading] = useState(false);

  //Delete CV

  const [deleteCVModal, setDeleteCVModal] = useState(false);
  const [deleteCVLoading, setDeleteCVLoading] = useState(false);

  const user =
    dataParams.type === "app" &&
    jwt.verify(token, process.env.REACT_APP_JWT_KEY);
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  const UploadProps = {
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    // fileList,
  };

  const makeTitle = () => {
    document.title = `${userData.user.name} - ${userData.user.job}`;
  };

  const lastSeen = async () => {
    var bodyFormDataLastSeen = new FormData();
    bodyFormDataLastSeen.append("lastseen", true);
    bodyFormDataLastSeen.append("id", user.id);
    bodyFormDataLastSeen.append("candidate", userData.user.id);

    await axios({
      method: "POST",
      url: `/api/react-post.php`,
      data: bodyFormDataLastSeen,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
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

  const getUserData = async () => {
    await axios({
      method: "GET",
      url: `/api/user.php?id=${dataParams.id}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setUserData({
            user: response.data.data.user[0],
            attachments: response.data.data.attachments,
            experience: response.data.data.experience,
            educations: response.data.data.educations,
          });
          setLoading("loaded");
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
            setLoading("loaded");
          } else {
            message.error("Something Went Wrong!", "error");
            setLoading("loaded");
          }
        }
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
      });
  };

  const getUserDataPublic = async () => {
    await axios({
      method: "GET",
      url: `/api/publicuser.php?id=${dataParams.id}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setUserData({
            user: response.data.data.user[0],
            attachments: response.data.data.attachments,
            experience: response.data.data.experience,
            educations: response.data.data.educations,
          });
          setLoading("loaded");
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
            setLoading("loaded");
          } else {
            message.error("Something Went Wrong!", "error");
            setLoading("loaded");
          }
        }
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
      });
  };

  const deleteData = async () => {
    var bodyFormDataDelete = new FormData();
    bodyFormDataDelete.append("deleteAttachment", true);
    bodyFormDataDelete.append("id", deletionData.id);
    setTableLoading(true);
    await axios({
      method: "POST",
      url: `/api/react-post.php`,
      data: bodyFormDataDelete,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("The attachment has been sucessfully deleted");
          toggleDeleteModal(false);
          setDeletionData("");
          getUserData();
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
    setTableLoading(false);
  };

  const deleteEducationData = async () => {
    var bodyFormDataDelete = new FormData();
    bodyFormDataDelete.append("deleteEducation", true);
    bodyFormDataDelete.append("id", deleteEduData.id);
    setDeleteEduLoading(true);
    await axios({
      method: "POST",
      url: `/api/react-post.php`,
      data: bodyFormDataDelete,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("The education has been sucessfully deleted");
          setDeleteEduLoading(false);
          setDeleteEduModal(false);
          setDeleteEduData("");
          setLoading(true);
          getUserData();
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

  const deleteWorkExpData = async () => {
    var bodyFormDataDelete = new FormData();
    bodyFormDataDelete.append("deleteExperience", true);
    bodyFormDataDelete.append("id", deleteWeData.id);
    setDeleteWeLoading(true);
    await axios({
      method: "POST",
      url: `/api/react-post.php`,
      data: bodyFormDataDelete,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("The Work experience has been sucessfully deleted");
          setDeleteWeLoading(false);
          setDeleteWeData("");
          setDeleteWeModal(false);
          setLoading(true);
          getUserData();
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

  const deleteFullCV = async () => {
    var bodyFormDataDelete = new FormData();
    bodyFormDataDelete.append("deletecv", true);
    bodyFormDataDelete.append("id", userData.user.id);
    setDeleteCVLoading(true);
    await axios({
      method: "POST",
      url: `/api/react-post.php`,
      data: bodyFormDataDelete,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("The CV has been sucessfully deleted");
          setDeleteCVLoading(false);
          setDeleteCVModal(false);
          navigateTo("/searchCV");
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

  const getAllUserManageList = async () => {
    await axios({
      method: "GET",
      url: `/api/userlist.php`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      params: {
        row: 0,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setUserList(response.data.data);
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

  const handleUploadModal = async (values) => {
    var bodyFormDataUpload = new FormData();
    fileList.forEach((file) => {
      bodyFormDataUpload.append("files[]", file);
    });
    const attach = values["attachments"];
    for (let key in attach) {
      let secondattach = attach[key];
      for (let key1 in secondattach) {
        bodyFormDataUpload.append(`${key1}`, `${secondattach[key1]}`);
      }
    }
    setTableLoading(true);
    bodyFormDataUpload.append("attachments", true);
    bodyFormDataUpload.append("candidate", userData.user.id);
    await axios({
      method: "POST",
      url: `/api/react-post.php`,
      data: bodyFormDataUpload,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("The attachment has been uploaded sucessfully");
          getUserData();
          form.resetFields();
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
            setLoading("loaded");
          } else {
            message.error("Something Went Wrong!", "error");
            setLoading("loaded");
          }
        }
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
      });

    toggleUploadModal(false);
    setTableLoading(false);
  };

  useEffect(() => {
    dataParams.type === "app" ? getUserData() : getUserDataPublic();
    dataParams.type === "app" && getAllUserManageList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dataParams.type === "app" && lastSeen(); // eslint-disable-next-line
  }, [isLoading]);

  const columns = [
    {
      title: "Sr no",
      render: (text, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "File",
      render: (record) => (
        <a href={`/files/docs/${record.name}`} target="_blank" rel="noreferrer">
          {record.name}
        </a>
      ),
    },
    {
      title: "Uploaded By",
      render: (record) => (
        <div>
          {userList.filter((user) => user.id === record.uploaded_by)[0]?.name}
        </div>
      ),
    },
    {
      title: "Date",
      render: (record) => <div>{moment(record.date).format("D MMM YYYY")}</div>,
    },
    {
      title: "Category",
      render: (record) => <div>{checkCategory(record.category)}</div>,
    },
    {
      title: "Action",
      render: (record) => (
        <Button
          size="large"
          type="primary"
          danger
          icon={<MdOutlineDeleteOutline />}
          onClick={() => {
            setDeletionData(record);
            toggleDeleteModal(true);
          }}
        />
      ),
    },
  ];

  const menu = (
    <Menu
      items={[
        {
          label: "Download Oman Jobs CV",
          key: "1",
          icon: <FaUserCheck />,
          onClick: () => {
            const name = `${userData.user.name} ${userData.user.job}`
              .replace(/\s+/g, "-")
              .replace(/\./g, "");
            window.open(`/cv/${dataParams.id}/${name}`, "_blank");
          },
        },
        {
          label: "Download Original CV",
          key: "2",
          icon: <FaFileDownload />,
          onClick: () => {
            window.open(`/files/cv/${userData.user.cv}`);
          },
        },
        {
          label: "Share in",
          key: "3",
          children: [
            {
              key: "3-1",
              label: "Clipboard",
              icon: <FaClipboard />,
              onClick: () => {
                const name = `${userData.user.name} ${userData.user.job}`
                  .replace(/\s+/g, "-")
                  .replace(/\./g, "");
                message.success("Link copied to your clipboard");
                return navigator.clipboard.writeText(
                  `https://share.omanjobs.om/cv/${dataParams.id}/${name}`
                );
              },
            },
            {
              key: "3-2",
              label: "Whatsapp",
              icon: <FaWhatsapp />,
              onClick: () => {
                const name = `${userData.user.name} ${userData.user.job}`
                  .replace(/\s+/g, "-")
                  .replace(/\./g, "");
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(
                    `https://share.omanjobs.om/cv/${dataParams.id}/${name}`
                  )}`
                );
              },
            },
            {
              key: "3-3",
              label: "Mail",
              icon: <SiGmail />,
              onClick: () => {
                const name = `${userData.user.name} ${userData.user.job}`
                  .replace(/\s+/g, "-")
                  .replace(/\./g, "");
                window.open(
                  `mailto:?subject=&body=${encodeURIComponent(
                    `https://share.omanjobs.om/cv/${dataParams.id}/${name}`
                  )}`
                );
              },
            },
          ],
          icon: <FcShare />,
        },
        {
          label: "Edit",
          key: "4",
          icon: <FaUserEdit />,
          onClick: () => navigateTo(`/cv/update/${userData.user.id}`),
        },
        user.type === "1" && {
          label: "Delete CV",
          key: "5",
          icon: <FaUserEdit />,
          onClick: () => {
            setDeleteCVModal(true);
          },
        },
      ]}
    />
  );

  const personalDetail = {
    ...(dataParams.type === "app" && { email: userData.user.email }),
    gender: userData.user.gender,
    ...(dataParams.type === "app" && { mobile: userData.user.mobile }),
    ...(dataParams.type === "app" && {
      alternate_email: userData.user.alt_email,
    }),
    ...(dataParams.type === "app" && {
      alternate_mobile_no: userData.user.alt_phone,
    }),
    DOB:
      (userData.user.DOB && moment(userData.user.DOB).format("D MMMM YYYY")) ||
      "",
    nationality: userData.user.nationality,
    country: userData.user.country,
    address: userData.user.presentaddress,
    language: userData.user.language,
    passport_no: userData.user.passport,
    civil_id_no: userData.user.civil_id,
    height: `${userData.user.height} cm`,
    weight: `${userData.user.weight} kg`,
  };

  const string = (str) =>
    isLoading === "loaded" &&
    str
      .split(/\r\n|\n/)
      .map((line, i) =>
        line === "" ? <br key={i} /> : <div key={i}>{line}</div>
      );

  const skills =
    (isLoading === "loaded" &&
      userData.user.skills !== "" &&
      userData.user.skills.split(/, |,|\r\n/)) ||
    "";

  const handleCancel = () => {
    toggleDeleteModal(false);
    toggleUploadModal(false);
    setDeletionData("");
    form.resetFields();
  };

  const uploadModal = () => (
    <Modal
      title="Upload Attachments"
      visible={isUploadModal}
      onCancel={handleCancel}
      okText={"Submit"}
      onOk={form.submit}
      confirmLoading={tableLoading}
    >
      <Form
        size="large"
        layout="vertical"
        onFinish={handleUploadModal}
        form={form}
        scrollToFirstError={true}
      >
        <Form.List name="attachments">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, auto)",
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "category[]"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing category",
                      },
                    ]}
                  >
                    <Select
                      placeholder={"Select Category"}
                      options={categorySelection}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name="file[]"
                    valuePropName={"file"}
                    rules={[
                      {
                        required: true,
                        message: "Missing Uploaded File",
                      },
                    ]}
                  >
                    <Upload
                      {...UploadProps}
                      maxCount={1}
                      showUploadList={{ showRemoveIcon: false }}
                    >
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Attachment
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );

  const checkImageIcon = (gender) =>
    gender.toLowerCase() === "male" ? maleUserImage : femaleUserImage;

  const TriggerCvDownload = () => {
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

  const makeEducationSection = () => (
    <div className="flex-gap-column">
      {userData.educations.map((education) => (
        <div key={education.id}>
          <div className="flex-between" style={{ padding: 0 }}>
            <div className="medium-text bolder text-orange">
              {education.name}
            </div>
            {dataParams.type === "app" && (
              <div className="flex-small-gap">
                <AiFillEdit
                  className="hover-blue"
                  style={{ fontSize: "22px" }}
                  onClick={() => {
                    setUpdateEduData(education);
                    setUpdateEduModal(true);
                  }}
                />
                <AiFillDelete
                  className="hover-red"
                  style={{ fontSize: "22px" }}
                  onClick={() => {
                    setDeleteEduData(education);
                    setDeleteEduModal(true);
                  }}
                />
              </div>
            )}
          </div>
          <div className="medium-text bolder">{education.college}</div>
          <div className="text-light-grey bold">{`${
            education.from_month && codeMonth(education.from_month)
          } ${education.from_year && `${education.from_year}`}${
            (education.from_month || education.from_year) && ` - `
          }${education.to_month && codeMonth(education.to_month)} ${
            education.to_year && education.to_year
          }`}</div>
          <div className="bold text-grey medium-text">{education.location}</div>
        </div>
      ))}
    </div>
  );

  const makeExperienceSection = () => (
    <div className="flex-gap-column">
      {userData.experience.map((work) => (
        <div key={work.id}>
          <div className="flex-between" style={{ padding: 0 }}>
            <div className="medium-2-text bolder text-orange">{work.name}</div>
            {dataParams.type === "app" && (
              <div className="flex-small-gap">
                <AiFillEdit
                  style={{ fontSize: "22px" }}
                  onClick={() => {
                    setUpdateWeData(work);
                    setUpdateWeModal(true);
                  }}
                  className="hover-blue"
                />
                <AiFillDelete
                  style={{ fontSize: "22px" }}
                  className="hover-red"
                  onClick={() => {
                    setDeleteWeData(work);
                    setDeleteWeModal(true);
                  }}
                />
              </div>
            )}
          </div>
          <div className="medium-text bolder">{work.designation}</div>
          <div className="text-light-grey bold">{`${
            work.from_month && codeMonth(work.from_month)
          } ${work.from_year && work.from_year}${
            (work.from_month || work.from_year) && ` - `
          }${work.to_month && codeMonth(work.to_month)} ${
            work.to_month === "Present" ? "" : work.to_year
          }`}</div>
          <div
            className="bold text-grey medium-text small-margin-top"
            style={{ textAlign: "justify" }}
          >
            {work.description && string(work.description)}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={
        dataParams.type === "app"
          ? "cvprofile"
          : "padding-top-public-cv cvprofile"
      }
    >
      {dataParams.type === "app" && (
        <>
          <Header />
          <Navigation
            previous_page={"Dashboard"}
            previous_path={"/Dashboard"}
            current_page={"Search CV"}
            third_page={"CV profile"}
            second_path={"/searchcv"}
          />
        </>
      )}

      {/* Attachments Section Modals*/}

      {uploadModal()}
      <Modal
        title="Delete Confirmation"
        visible={deleteModal}
        onOk={deleteData}
        onCancel={handleCancel}
        okText={"Delete"}
        okType={"danger"}
        confirmLoading={tableLoading}
      >
        <p>{`Are you sure you want to delete "${deletionData.name}" from attachments?`}</p>
      </Modal>

      {/* Work Experience */}

      {isUpdateWeModal && (
        <UpdateWork
          data={updateWeData}
          setData={setUpdateWeData}
          visible={isUpdateWeModal}
          toggleVisible={setUpdateWeModal}
          getUserData={
            dataParams.type === "app" ? getUserData : getUserDataPublic
          }
          setPageLoading={setLoading}
          userId={userData.user.id}
        />
      )}
      <Modal
        title="Delete Work Experience Confirmation"
        visible={isDeleteWeModal}
        onOk={deleteWorkExpData}
        onCancel={() => {
          setDeleteWeData("");
          setDeleteWeModal(false);
        }}
        okText={"Delete"}
        okType={"danger"}
        confirmLoading={isDeleteWeLoading}
      >
        <p>{`Are you sure you want to delete "${deleteWeData.name}" from Experience?`}</p>
      </Modal>

      {/* Education */}

      {isUpdateEduModal && (
        <UpdateEducation
          data={updateEduData}
          setData={setUpdateEduData}
          visible={isUpdateEduModal}
          toggleVisible={setUpdateEduModal}
          getUserData={
            dataParams.type === "app" ? getUserData : getUserDataPublic
          }
          setPageLoading={setLoading}
          userId={userData.user.id}
        />
      )}
      <Modal
        title="Delete Education Confirmation"
        visible={isDeleteEduModal}
        onOk={deleteEducationData}
        onCancel={() => {
          setDeleteEduData("");
          setDeleteEduModal(false);
        }}
        okText={"Delete"}
        okType={"danger"}
        confirmLoading={isDeleteEduLoading}
      >
        <p>{`Are you sure you want to delete "${deleteEduData.name}" from Education?`}</p>
      </Modal>

      {/* Delete CV */}

      <Modal
        title="Delete CV Confirmation"
        visible={deleteCVModal}
        onOk={deleteFullCV}
        onCancel={() => {
          setDeleteCVModal(false);
        }}
        okText={"Delete"}
        okType={"danger"}
        confirmLoading={deleteCVLoading}
      >
        <p>{`Are you sure you want to delete "${userData.user.name}"'s CV?`}</p>
      </Modal>

      {/* Main Page */}

      {(isLoading === "loaded" && (
        <m.div>
          {makeTitle()}
          <m.div
            className={
              dataParams.type === "app"
                ? "cvprofile-body"
                : "cvprofile-body cvprofile-body-public"
            }
            ref={CvDownload}
            variants={container}
            animate="show"
            initial="hidden"
          >
            <m.div className="cvprofile-header-first-part" variants={item}>
              <img
                className={"cvprofile-picture"}
                src={
                  userData.user.image
                    ? `/files/images/${userData.user.image}`
                    : checkImageIcon(userData.user.gender)
                }
                alt="user"
                width={"170px"}
                height={"170px"}
              />
              <div className="text-orange bolder large-text">
                {userData.user.name}
              </div>
              <div className="text-grey medium-text bold">
                {userData.user.job}
              </div>
              <div className="flex-small-gap">
                {userData.user.url && (
                  <a
                    className={
                      dataParams.type === "app"
                        ? "each-skill"
                        : "each-skill-public"
                    }
                    href={userData.user.url}
                    rel="noreferrer"
                    target={"_blank"}
                  >
                    Portfolio Photo
                  </a>
                )}
                {userData.user.wpv && (
                  <a
                    className={
                      dataParams.type === "app"
                        ? "each-skill"
                        : "each-skill-public"
                    }
                    href={userData.user.wpv}
                    rel="noreferrer"
                    target={"_blank"}
                  >
                    Portfolio Video
                  </a>
                )}
                {userData.user.interview && (
                  <a
                    className={
                      dataParams.type === "app"
                        ? "each-skill"
                        : "each-skill-public"
                    }
                    href={userData.user.interview}
                    rel="noreferrer"
                    target={"_blank"}
                  >
                    Interview Video
                  </a>
                )}
              </div>
            </m.div>
            <m.div
              className="cvprofile-header-second-part-section long-box"
              variants={item}
            >
              <div className="flex-gap-column">
                <div className="bolder large-text text-orange">
                  Personal Details
                </div>
                <div className="cvprofile-header-second-part">
                  {Object.keys(personalDetail).map((keyName, i) => (
                    <div key={keyName} className={"each-box-cv-profile"}>
                      <div className="bolder medium-text">
                        {removeUnderScore(keyName)}
                      </div>
                      <div className="text-grey medium-text">
                        {personalDetail[keyName] || "Not Provided"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="video-play-button">
                <img
                  src={ojimage}
                  className="public-header-image"
                  alt="Oman jobs"
                  onClick={() => window.open("https://www.omanjobs.om/")}
                />
              </div>
            </m.div>
            <m.div className="experiences-list" variants={item}>
              {dataParams.type === "app" && (
                <Dropdown overlay={menu}>
                  <Button className="button-primary">
                    <Space>
                      More Options
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              )}
              <m.div className="cvprofile-skills" variants={item}>
                <div className="bolder large-text text-black">Soft Skills</div>
                <div className="cvprofile-skills-chain">
                  {(skills !== "" &&
                    skills.map(
                      (skill, i) =>
                        skill !== "" && (
                          <div className="cvprofile-each-skill bold" key={i}>
                            {skill}
                          </div>
                        )
                    )) || (
                    <div className="text-grey medium-text">
                      No Skills Provided
                    </div>
                  )}
                </div>
              </m.div>
              <m.div className="cvprofile-skills" variants={item}>
                {userData.user.education ? (
                  <>
                    <div className="bolder large-text text-orange">
                      Education
                    </div>
                    <div className="cvprofile-skills-chain medium-text text-grey">
                      {string(userData.user.education)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-between" style={{ padding: 0 }}>
                      <div
                        className="bolder large-text text-black"
                        style={{ padding: "0.3rem 0" }}
                      >
                        Education
                      </div>
                      {dataParams.type === "app" && (
                        <AiOutlinePlus
                          className="plus-button-cv-profile"
                          onClick={() => {
                            setUpdateEduData({});
                            setUpdateEduModal(true);
                          }}
                        />
                      )}
                    </div>
                    {makeEducationSection()}
                  </>
                )}
              </m.div>
            </m.div>
            <m.div className="cvprofile-skills long-box" variants={item}>
              <div className="experiences-list">
                {userData.user.company ? (
                  <>
                    <div className="bolder large-text text-orange">
                      Work Experience
                    </div>
                    <div className="each-experience medium-text text-grey">
                      {string(userData.user.company)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-between" style={{ padding: "10px 0" }}>
                      <div className="bolder large-text text-black">
                        Work Experience
                      </div>
                      {dataParams.type === "app" && (
                        <AiOutlinePlus
                          className="plus-button-cv-profile"
                          onClick={() => {
                            setUpdateWeData({});
                            setUpdateWeModal(true);
                          }}
                        />
                      )}
                    </div>
                    {makeExperienceSection()}
                  </>
                )}
              </div>
            </m.div>
            {dataParams.type === "app" && (
              <m.div
                className="grid-gather attachments-section"
                variants={item}
              >
                <div className="flex-between">
                  <div className="bolder large-text text-orange">
                    Attachments
                  </div>
                  <Button
                    className="button-primary"
                    onClick={() => toggleUploadModal(true)}
                  >
                    Upload
                  </Button>
                </div>
                <div>
                  <Table
                    dataSource={userData.attachments}
                    columns={columns}
                    loading={tableLoading}
                    pagination={false}
                    rowKey={"id"}
                  />
                </div>
              </m.div>
            )}
            {dataParams.type === "app" && (
              <m.div className="grid-gather" variants={item}>
                {checkWhichFile(userData.user.cv) === "pdf" && (
                  <object
                    data={`https://api.omanjobs.om/files/cv/${userData.user.cv}#view=fitH`}
                    type="application/pdf"
                    width="100%"
                    height="800px"
                  >
                    <iframe
                      title={"PDF file for Candidate Resume"}
                      src={`https://api.omanjobs.om/files/cv/${userData.user.cv}#view=fitH`}
                    ></iframe>
                  </object>
                )}
                {(checkWhichFile(userData.user.cv) === "docx" ||
                  checkWhichFile(userData.user.cv) === "doc") && (
                  <iframe
                    title={"DOC file for Candidate Resume"}
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=https://api.omanjobs.om/files/cv/${userData.user.cv}`}
                    width="100%"
                    height="800px"
                    frameborder="0"
                  ></iframe>
                )}
              </m.div>
            )}
          </m.div>
          <m.div className="attachments-public-section-wrapper" variants={item}>
            <div className="attachments-public-section">
              {dataParams.type !== "app" &&
                Object.keys(groupBy(userData.attachments, "category")).map(
                  (section, index) => (
                    <div className="cvprofile-skills" key={index}>
                      <div className="bolder large-text text-orange">
                        {`Attachments - [${checkCategory(section)}]`}
                      </div>
                      <div className="cvprofile-attachments medium-text text-grey">
                        {groupBy(userData.attachments, "category")[section].map(
                          (attachment, index) => (
                            <a
                              href={`/files/docs/${attachment.name}`}
                              key={attachment.id}
                              className={"flex-small-gap link"}
                              target={"_blank"}
                              rel="noreferrer"
                            >
                              <GrAttachment />
                              <div>{`${checkCategory(section)} - ${
                                index + 1
                              }`}</div>
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
            </div>
          </m.div>
          {dataParams.type !== "app" && (
            <div className="download-pdf-cv-profile">
              <Button
                type="primary"
                onClick={TriggerCvDownload}
                loading={isPdfDownloadLoading}
              >
                Download PDF
              </Button>
            </div>
          )}
        </m.div>
      )) || <Loader minHeight={dataParams.type === "app" ? "70vh" : "85vh"} />}
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default CVprofile;
