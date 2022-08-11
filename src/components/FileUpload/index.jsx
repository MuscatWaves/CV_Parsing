import React, { useState } from "react";
import { Modal, Button, Upload, message } from "antd";
import "../MultipleFileUpload/multip.css";
import { UploadOutlined } from "@ant-design/icons";
import { checkWhichFile, checkImageIcon } from "../../utilities";
import axios from "axios";
import Cookies from "universal-cookie";

const FileUpload = ({
  isUploadModal,
  toggleUploadModal,
  userId,
  dataParams,
  setUserData,
  setLoading,
  getUserData,
  cvPicType,
  userData,
  showPdf,
}) => {
  const [file, setFile] = useState(null);
  const [loading, toggleLoading] = useState(false);
  const handleCancel = () => {
    toggleUploadModal(false);
    setFile(null);
    getUserData(dataParams, setUserData, setLoading);
  };
  const cookies = new Cookies();
  const token = cookies.get("token");

  const addAttachment = async () => {
    toggleLoading(true);
    var bodyFormDataAdd = new FormData();
    bodyFormDataAdd.append("id", userId);
    bodyFormDataAdd.append("type", cvPicType);
    bodyFormDataAdd.append("file", file);
    await axios({
      method: "POST",
      url: `/api/cv/cvupload`,
      data: bodyFormDataAdd,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("Attachment has been sucessfully updated");
          toggleLoading(false);
          handleCancel();
        } else {
          if (response.status === 201) {
            message.error(response.data.error);
            toggleLoading(false);
          } else {
            message.error("Something Went Wrong!");
            toggleLoading(false);
          }
        }
      })
      .catch(function (response) {
        message.error(response.response.data.error);
        toggleLoading(false);
      });
  };

  return (
    <Modal
      title={`Update ${cvPicType && cvPicType.toUpperCase()}`}
      visible={isUploadModal}
      onCancel={handleCancel}
      footer={false}
    >
      {isUploadModal && (
        <div className="file_multiple">
          <div className="flex-small-gap" style={{ width: "100%" }}>
            <Upload
              name="cv profile"
              listType="picture"
              accept={
                cvPicType === "dp" ? ".jpeg,.png,.jpg" : ".pdf,.docx,.xslx"
              }
              maxCount={1}
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={file?.name ? false : <UploadOutlined />}>
                {file?.name ? (
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "160px",
                    }}
                  >
                    {file.name}
                  </div>
                ) : (
                  `Click to upload`
                )}
              </Button>
            </Upload>
            <Button
              className="add_attachment_section"
              type="primary"
              onClick={addAttachment}
              disabled={file === null}
              loading={loading}
            >
              Update
            </Button>
          </div>
          <div className="flex-column-gap">
            <div className="bold text-black medium">{`Current ${cvPicType.toUpperCase()}`}</div>
            <div>
              {cvPicType === "dp" ? (
                <div>
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
                </div>
              ) : (
                <div>
                  {checkWhichFile(userData.user.cv) === "pdf" && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        type="primary"
                        onClick={() =>
                          showPdf(
                            `https://cvparse.fra1.cdn.digitaloceanspaces.com/files/cv/${userData.user.cv}#view=fitH`
                          )
                        }
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default FileUpload;
