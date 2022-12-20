import React, { useState } from "react";
import { Modal, Button, message, Divider } from "antd";
import "../MultipleFileUpload/multip.css";
import { UploadOutlined } from "@ant-design/icons";
import { checkWhichFile, checkImageIcon } from "../../utilities";
import axios from "axios";
import Cookies from "universal-cookie";
import Dragger from "antd/lib/upload/Dragger";

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
  const user = JSON.parse(localStorage.getItem("user"));

  const addAttachment = async (file) => {
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
      open={isUploadModal}
      onCancel={handleCancel}
      footer={false}
    >
      {isUploadModal && (
        <div className="file_multiple">
          <div style={{ width: "100%" }} className="flex-small-gap1-column">
            <Dragger
              name="cv profile"
              listType="picture"
              accept={
                cvPicType === "dp" ? ".jpeg,.png,.jpg" : ".pdf,.docx,.xslx"
              }
              maxCount={1}
              beforeUpload={(file) => {
                addAttachment(file);
                return false;
              }}
              showUploadList={false}
            >
              <div className="flex-small-gap1-column medium-padding flex-align-center">
                <UploadOutlined style={{ fontSize: "45px" }} />
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Supports only single upload. Avoid dragging multiple files.
                </p>
              </div>
            </Dragger>
            {loading ? (
              <div className="text-green bold flex-center">
                Upload in progress
              </div>
            ) : (
              <div className="text-orange bold flex-center">
                {"No file selected " || file}
              </div>
            )}
          </div>
          {user.cvView === 0 && (
            <>
              <Divider />
              <div className="flex-column-gap">
                <div className="bold text-black medium-text">{`Current ${cvPicType.toUpperCase()}`}</div>
                <div>
                  {cvPicType === "dp" ? (
                    <div>
                      <img
                        className={"cvprofile-picture"}
                        src={
                          userData.image
                            ? `/files/images/${userData.image}`
                            : checkImageIcon(userData.gender)
                        }
                        alt="user"
                        width={"170px"}
                        height={"170px"}
                      />
                    </div>
                  ) : (
                    <div>
                      {checkWhichFile(userData.cv) === "pdf" && (
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
                                `https://cvparse.fra1.cdn.digitaloceanspaces.com/files/cv/${userData.cv}#view=fitH`
                              )
                            }
                          >
                            View Original PDF
                          </Button>
                        </div>
                      )}
                      {(checkWhichFile(userData.cv) === "docx" ||
                        checkWhichFile(userData.cv) === "doc") && (
                        <iframe
                          title={"DOC file for Candidate Resume"}
                          src={`https://view.officeapps.live.com/op/embed.aspx?src=https://cvparse.fra1.cdn.digitaloceanspaces.com/files/cv/${userData.cv}`}
                          width="100%"
                          height="800px"
                          frameborder="0"
                        ></iframe>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default FileUpload;
