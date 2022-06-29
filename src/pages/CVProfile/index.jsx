import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { removeUnderScore } from "../../utilities";
import {
  DownOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
import { categorySelection } from "./constants.ts";
import jwt from "jsonwebtoken";
import "./cvprofile.css";
import maleUserImage from "../../images/male-user.png";
import femaleUserImage from "../../images/female-user.jpg";
import FormData from "form-data";

const CVprofile = () => {
  const dataParams = useParams();
  const [form] = Form.useForm();
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [userData, setUserData] = useState({ user: {}, attachments: [] });
  const [isLoading, setLoading] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [deleteModal, toggleDeleteModal] = useState(false);
  const [deletionData, setDeletionData] = useState("");
  const [isUploadModal, toggleUploadModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const user = jwt.verify(token, process.env.REACT_APP_JWT_KEY);

  const UploadProps = {
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    // fileList,
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
    getUserData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    lastSeen(); // eslint-disable-next-line
  }, [isLoading]);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "File",
      render: (record) => (
        <a
          href={`https://cv.omanjobs.om/files/docs/${record.name}`}
          target="_blank"
          rel="noreferrer"
        >
          {record.name}
        </a>
      ),
    },
    {
      title: "Uploaded By",
      dataIndex: "uploaded_by",
    },
    {
      title: "Date",
      render: (record) => <div>{moment(record.date).format("D MMM YYYY")}</div>,
    },
    {
      title: "Category",
      dataIndex: "category",
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
            window.open(`/profile/public/${dataParams.id}`, "_blank");
          },
        },
        {
          label: "Download Original CV",
          key: "2",
          icon: <FaFileDownload />,
          onClick: () => {
            window.open(`https://cv.omanjobs.om/files/cv/${userData.user.cv}`);
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
                message.success("Link copied to your clipboard");
                return navigator.clipboard.writeText(
                  `${window.location.origin}/profile/public/${userData.user.id}`
                );
              },
            },
            {
              key: "3-2",
              label: "Whatsapp",
              icon: <FaWhatsapp />,
              onClick: () =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(
                    `${window.location.origin}/profile/public/${userData.user.id}`
                  )}`
                ),
            },
            {
              key: "3-3",
              label: "Mail",
              icon: <SiGmail />,
              onClick: () =>
                window.open(
                  `mailto:?subject=&body=${encodeURIComponent(
                    `${window.location.origin}/profile/public/${userData.user.id}`
                  )}`
                ),
            },
          ],
          icon: <FcShare />,
        },
        {
          label: "Edit",
          key: "4",
          icon: <FaUserEdit />,
        },
      ]}
    />
  );

  const personalDetail = {
    ...(dataParams.type === "app" && { email: userData.user.email }),
    gender: userData.user.gender,
    ...(dataParams.type === "app" && { mobile: userData.user.mobile }),
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
      .split("\r\n")
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
        className="buildCvForm"
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
                      accept=".pdf,.docx,.xslx"
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

  const checkWhichFile = (cv) => {
    var n = cv?.split(".");
    return n[n.length - 1];
  };

  const checkCategory = (cat) =>
    categorySelection.filter((category) => category.value === cat)[0].label;

  const arrangeDocuments = () => {
    var edList = [];
    let currentCategory;
    let num = 1;
    const check = [...userData.attachments];
    const sorted = check.sort((a, b) => a.category - b.category);
    sorted.map((attachment, index) => {
      currentCategory === attachment.category ? (num = num + 1) : (num = 1);
      currentCategory =
        currentCategory === attachment.category
          ? currentCategory
          : attachment.category;
      return (edList = [
        ...edList,
        {
          id: index,
          name: `${checkCategory(attachment.category)} - ${num}`,
          attachment_link: `https://cv.omanjobs.om/files/docs/${attachment.name}`,
          category: attachment.category,
        },
      ]);
    });
    return edList;
  };

  const checkImageIcon = (gender) =>
    gender.toLowerCase() === "male" ? maleUserImage : femaleUserImage;

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
      {(isLoading === "loaded" && (
        <div className="cvprofile-body">
          <div className="cvprofile-header-first-part slide-in-left-animation">
            <img
              className={"cvprofile-picture"}
              src={
                userData.user.image
                  ? `${window.location.origin}/files/images/${userData.user.image}`
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
              {userData.user.wpv && (
                <a
                  className="each-skill"
                  href={userData.user.wpv}
                  rel="noreferrer"
                  target={"_blank"}
                >
                  Work Portfolio Video
                </a>
              )}
              {userData.user.interview && (
                <a
                  className="each-skill"
                  href={userData.user.interview}
                  rel="noreferrer"
                  target={"_blank"}
                >
                  Interview
                </a>
              )}
            </div>
          </div>
          <div className="cvprofile-header-second-part-section long-box slide-in-right-animation">
            <div className="bolder large-text text-orange">
              Personal Details
            </div>
            <div className="cvprofile-header-second-part">
              {Object.keys(personalDetail).map((keyName, i) => (
                <div key={keyName}>
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
          <div className="experiences-list">
            {dataParams.type === "app" && (
              <Dropdown overlay={menu}>
                <Button className="button-primary zoom-in-animation">
                  <Space>
                    More Options
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            )}
            <div className="cvprofile-skills slide-in-left-animation">
              <div className="bolder large-text text-black">Soft Skills</div>
              <div className="cvprofile-skills-chain">
                {(skills !== "" &&
                  skills.map(
                    (skill, i) =>
                      skill !== "" && (
                        <div className="cvprofile-each-skill bolder" key={i}>
                          {skill}
                        </div>
                      )
                  )) || (
                  <div className="text-grey medium-text">
                    No Skills Provided
                  </div>
                )}
              </div>
            </div>
            <div className="cvprofile-skills slide-in-left-animation">
              <div className="bolder large-text text-orange">Education</div>
              <div className="cvprofile-skills-chain medium-text text-grey">
                {string(userData.user.education)}
              </div>
            </div>
            {dataParams.type !== "app" && (
              <div className="cvprofile-skills slide-in-left-animation">
                <div className="bolder large-text text-orange">Attachments</div>
                <div className="cvprofile-attachments medium-text text-grey">
                  {arrangeDocuments().map((attachment) => (
                    <a
                      href={attachment.attachment_link}
                      key={attachment.id}
                      className={"flex-small-gap link"}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      <GrAttachment />
                      <div>{attachment.name}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="cvprofile-skills long-box slide-in-right-animation">
            <div className="bolder large-text text-orange">Work Experience</div>
            <div className="experiences-list">
              <div className="each-experience medium-text text-grey">
                {string(userData.user.company)}
              </div>
            </div>
          </div>
          {dataParams.type === "app" && (
            <div className="grid-gather attachments-section">
              <div className="flex-between">
                <div className="bolder large-text text-orange">Attachments</div>
                <Button
                  className="button-primary zoom-in-animation"
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
            </div>
          )}
          {dataParams.type === "app" && (
            <div className="grid-gather">
              {checkWhichFile(userData.user.cv) === "pdf" && (
                <object
                  data={`https://cv.omanjobs.om/files/cv/${userData.user.cv}#view=fitH`}
                  type="application/pdf"
                  width="100%"
                  height="800px"
                >
                  <iframe
                    title={"PDF file for Candidate Resume"}
                    src={`https://cv.omanjobs.om/files/cv/${userData.user.cv}#view=fitH`}
                  ></iframe>
                </object>
              )}
              {checkWhichFile(userData.user.cv) === "docx" ||
                (checkWhichFile(userData.user.cv) === "doc" && (
                  <iframe
                    title={"DOC file for Candidate Resume"}
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=https://cv.omanjobs.om/files/cv/${userData.user.cv}`}
                    width="100%"
                    height="800px"
                    frameborder="0"
                  ></iframe>
                ))}
            </div>
          )}
        </div>
      )) || <Loader minHeight={"70vh"} />}
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default CVprofile;
