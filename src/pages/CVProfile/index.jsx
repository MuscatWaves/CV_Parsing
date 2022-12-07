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
  checkImageIcon,
  TriggerCvDownload,
  skills,
  string,
  showPdf,
  showImage,
  formatInput,
} from "../../utilities";
import { HiDotsHorizontal } from "react-icons/hi";
import { GrAttachment } from "react-icons/gr";
import {
  Button,
  Dropdown,
  Menu,
  message,
  Table,
  Modal,
  Form,
  Tooltip,
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
import Cookies from "universal-cookie";
import moment from "moment";
import Loader from "../../components/Loader";
import { container, item } from "./constants.ts";
import jwt from "jsonwebtoken";
import "./cvprofile.css";
import { useNavigate } from "react-router-dom";
import ojimage from "../../images/oj-small.png";
import { AnimatePresence, m } from "framer-motion";
import {
  lastSeen,
  getUserData,
  getAllUserManageList,
  deleteData,
  deleteFullCV,
} from "./endpoints";
import MultipleFileUpload from "../../components/MultipleFileUpload";

const CVprofile = () => {
  const dataParams = useParams();
  const [form] = Form.useForm();
  const cookies = new Cookies();
  const token = cookies?.get("token");
  const [userData, setUserData] = useState({
    user: {},
    attachments: [],
    educations: [],
    experience: [],
  });

  const [isLoading, setLoading] = useState("none");
  const [tableLoading, setTableLoading] = useState(false);
  const [deleteModal, toggleDeleteModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [deletionData, setDeletionData] = useState("");
  const [isUploadModal, toggleUploadModal] = useState(false);
  const CvDownload = useRef();
  const [isPdfDownloadLoading, setPdfDownloadLoading] = useState(false);
  const [cvViewLoad, setCvViewLoad] = useState(false);

  //Delete CV

  const [deleteCVModal, setDeleteCVModal] = useState(false);
  const [deleteCVLoading, setDeleteCVLoading] = useState(false);

  //  Upload CV or pic

  const user =
    (dataParams.type === "app" &&
      token &&
      jwt?.verify(token, process.env.REACT_APP_JWT_KEY)) ||
    "";
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };

  const makeTitle = () => {
    document.title = `${userData.user.name} - ${userData.user.job}`;
  };

  useEffect(() => {
    dataParams.type === "app" &&
      user &&
      getAllUserManageList(setUserList, token);
    user && getUserData(dataParams, setUserData, setLoading);
    dataParams.type !== "app" &&
      getUserData(dataParams, setUserData, setLoading);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dataParams.type === "app" &&
      isLoading === "loaded" &&
      lastSeen(user, userData, token); // eslint-disable-next-line
  }, [isLoading]);

  const columns = [
    {
      title: "Sr no",
      render: (_text, _record, index) => <div>{index + 1}</div>,
    },
    {
      title: "File",
      render: (record) => (
        <div
          className="link pointer"
          onClick={() => {
            const type = checkWhichFile(record.name);
            if (["pdf"].includes(type)) {
              showPdf(
                `https://cvparse.fra1.cdn.digitaloceanspaces.com/files/docs/${record.name}`
              );
            }
            if (["jpeg", "jpg", "png", "PNG"].includes(type)) {
              showImage(
                `https://cvparse.fra1.cdn.digitaloceanspaces.com/files/docs/${record.name}`
              );
            }
          }}
        >
          {record.name}
        </div>
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

  const menu = dataParams.type === "app" && (
    <Menu
      items={[
        {
          label: "Download Oman Jobs CV",
          key: "1",
          icon: <FaUserCheck />,
          onClick: () => {
            const name = `${userData.user.name} ${userData.user.job.replace(
              "/",
              "-"
            )}`
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
                const name = `${userData.user.name} ${userData.user.job.replace(
                  "/",
                  "-"
                )}`
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
        user.data[0].type === 1 && {
          label: "Delete CV",
          key: "7",
          danger: true,
          icon: <FaUserEdit />,
          onClick: () => {
            setDeleteCVModal(true);
          },
        },
      ]}
    />
  );

  const personalDetail = {
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
    passport_no: userData.user.passport,
    civil_id_no: userData.user.civil_id,
    height: `${userData.user.height} cm`,
    weight: `${userData.user.weight} kg`,
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setDeletionData("");
    form.resetFields();
  };

  const makeEducationSection = () => (
    <div className="flex-gap-column">
      {userData.educations.map((education) => (
        <div key={education.id}>
          <div className="flex-between" style={{ padding: 0 }}>
            <div className="medium-text bolder text-orange">
              {formatInput(education.name)}
            </div>
          </div>
          <div className="medium-text bolder">
            {formatInput(education.college)}
          </div>
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
            <div className="medium-2-text bolder text-orange">
              {formatInput(work.name)}
            </div>
          </div>
          <div className="medium-text bolder">
            {formatInput(work.designation)}
          </div>
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
            {work.description && string(work.description, isLoading)}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <m.div
      className={
        dataParams.type === "app"
          ? "cvprofile"
          : "padding-top-public-cv cvprofile"
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
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
      <MultipleFileUpload
        isUploadModal={isUploadModal}
        toggleUploadModal={toggleUploadModal}
        userId={dataParams.id}
        dataParams={dataParams}
        setUserData={setUserData}
        setLoading={setLoading}
        getUserData={getUserData}
      />

      <Modal
        title="Delete Confirmation"
        visible={deleteModal}
        onOk={() =>
          deleteData({
            deletionData,
            setTableLoading,
            toggleDeleteModal,
            setDeletionData,
            dataParams,
            setUserData,
            setLoading,
          })
        }
        onCancel={handleCancel}
        okText={"Delete"}
        okType={"danger"}
        confirmLoading={tableLoading}
      >
        <p>{`Are you sure you want to delete "${deletionData.name}" from attachments?`}</p>
      </Modal>

      {/* Delete CV */}

      <Modal
        title="Delete CV Confirmation"
        visible={deleteCVModal}
        onOk={() =>
          deleteFullCV(
            userData,
            setDeleteCVLoading,
            setDeleteCVModal,
            navigateTo
          )
        }
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

      <AnimatePresence>
        {(isLoading === "loaded" && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
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
                <Tooltip
                  title={
                    dataParams.type === "app"
                      ? "Click to copy the Oman Jobs profile"
                      : ""
                  }
                >
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
                    onClick={() => {
                      const name = `${
                        userData.user.name
                      } ${userData.user.job.replace("/", "-")}`
                        .replace(/\s+/g, "-")
                        .replace(/\./g, "");
                      dataParams.type === "app" &&
                        message.success("Link copied to your clipboard");
                      return (
                        dataParams.type === "app" &&
                        navigator.clipboard.writeText(
                          `https://share.omanjobs.om/cv/${dataParams.id}/${name}`
                        )
                      );
                    }}
                  />
                </Tooltip>
                <p className="text-red bold">
                  {!userData.user.gender && "Please update the gender!"}
                </p>
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
                    {dataParams.type === "app" && (
                      <div style={{ gridColumn: "1/3" }}>
                        <div className="bolder medium-text">Email</div>
                        <div className="text-grey medium-text">
                          {string(userData.user.email, isLoading) ||
                            "Not Provided"}
                        </div>
                      </div>
                    )}
                    {Object.keys(personalDetail).map((keyName, i) => (
                      <div key={keyName} className={"each-box-cv-profile"}>
                        <div className="bolder medium-text">
                          {removeUnderScore(keyName)}
                        </div>
                        <div className="text-grey medium-text">
                          {(personalDetail[keyName] &&
                            formatInput(personalDetail[keyName])) ||
                            "Not Provided"}
                        </div>
                      </div>
                    ))}
                    <div>
                      <div className="bolder medium-text">Nationality</div>
                      <div className="text-grey medium-text">
                        {string(userData.user.nationality, isLoading) ||
                          "Not Provided"}
                      </div>
                    </div>
                    <div
                      style={
                        dataParams.type === "app"
                          ? { gridColumn: "1/4", gridRow: "6" }
                          : { gridColumn: "2/4" }
                      }
                    >
                      <div className="bolder medium-text">Language</div>
                      <div className="text-grey medium-text">
                        {string(userData.user.language, isLoading) ||
                          "Not Provided"}
                      </div>
                    </div>
                    <div>
                      <div className="bolder medium-text">Country</div>
                      <div className="text-grey medium-text">
                        {string(userData.user.country, isLoading) ||
                          "Not Provided"}
                      </div>
                    </div>
                    <div style={{ gridColumn: "2/4" }}>
                      <div className="bolder medium-text">Address</div>
                      <div className="text-grey medium-text">
                        {formatInput(userData.user.presentaddress, isLoading) ||
                          "Not Provided"}
                      </div>
                    </div>
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
                  <Dropdown.Button
                    className="custom-profile-button"
                    onClick={() => navigateTo(`/cv/update/${userData.user.id}`)}
                    overlay={menu}
                    icon={<HiDotsHorizontal style={{ fontSize: "24px" }} />}
                    type={"primary"}
                  >
                    Edit Profile
                  </Dropdown.Button>
                )}
                <m.div className="cvprofile-skills" variants={item}>
                  <div className="bolder large-text text-black">
                    Soft Skills
                  </div>
                  <div className="cvprofile-skills-chain">
                    {(skills(userData, isLoading) !== "" &&
                      skills(userData, isLoading).map(
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
                        {string(userData.user.education, isLoading)}
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
                        {string(userData.user.company, isLoading)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="flex-between"
                        style={{ padding: "10px 0" }}
                      >
                        <div className="bolder large-text text-black">
                          Work Experience
                        </div>
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
                      type="primary"
                      shape="round"
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80px",
                      }}
                    >
                      <Button
                        type="primary"
                        onClick={() =>
                          showPdf(
                            `https://cvparse.fra1.cdn.digitaloceanspaces.com/files/cv/${userData.user.cv}#view=fitH`,
                            setCvViewLoad
                          )
                        }
                        loading={cvViewLoad}
                      >
                        View Original PDF
                      </Button>
                    </div>
                  )}
                  {(checkWhichFile(userData.user.cv) === "docx" ||
                    checkWhichFile(userData.user.cv) === "doc") && (
                    <iframe
                      title={"DOC file for Candidate Resume"}
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=https://cvparse.fra1.cdn.digitaloceanspaces.com/files/cv/${userData.user.cv}`}
                      width="100%"
                      height="800px"
                      frameborder="0"
                    ></iframe>
                  )}
                </m.div>
              )}
            </m.div>
            <m.div
              className="attachments-public-section-wrapper"
              variants={item}
            >
              <div className="attachments-public-section">
                {dataParams.type !== "app" &&
                  Object.keys(groupBy(userData.attachments, "category")).map(
                    (section, index) => (
                      <div className="cvprofile-skills" key={index}>
                        <div className="bolder large-text text-orange">
                          {`Attachments - [${checkCategory(section)}]`}
                        </div>
                        <div className="cvprofile-attachments medium-text text-grey">
                          {groupBy(userData.attachments, "category")[
                            section
                          ].map((attachment, index) => (
                            <div
                              key={attachment.id}
                              className={"flex-small-gap link pointer"}
                              onClick={() => {
                                const type = checkWhichFile(attachment.name);
                                if (["pdf"].includes(type)) {
                                  showPdf(
                                    `https://cvparse.fra1.cdn.digitaloceanspaces.com/files/docs/${attachment.name}`
                                  );
                                }
                                if (
                                  ["jpeg", "jpg", "png", "PNG"].includes(type)
                                ) {
                                  showImage(
                                    `https://cvparse.fra1.cdn.digitaloceanspaces.com/files/docs/${attachment.name}`
                                  );
                                }
                              }}
                            >
                              <GrAttachment />
                              <div>{`${checkCategory(section)} - ${
                                index + 1
                              }`}</div>
                            </div>
                          ))}
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
                  onClick={() =>
                    TriggerCvDownload({
                      setPdfDownloadLoading,
                      CvDownload,
                      userData,
                    })
                  }
                  loading={isPdfDownloadLoading}
                >
                  Download PDF
                </Button>
              </div>
            )}
          </m.div>
        )) || (
          <Loader minHeight={dataParams.type === "app" ? "70vh" : "85vh"} />
        )}
      </AnimatePresence>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </m.div>
  );
};

export default CVprofile;
