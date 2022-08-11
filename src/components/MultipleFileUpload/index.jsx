import React, { useEffect, useState } from "react";
import { Modal, Button, Select, Upload, message } from "antd";
import { categorySelection } from "../../pages/CVProfile/constants";
import "./multip.css";
import { UploadOutlined } from "@ant-design/icons";
import { BsCheckCircleFill } from "react-icons/bs";
import { checkCategory, updateStatus } from "../../utilities";
import axios from "axios";
import Cookies from "universal-cookie";

const MultipleFileUpload = ({
  isUploadModal,
  toggleUploadModal,
  userId,
  dataParams,
  setUserData,
  setLoading,
  getUserData,
}) => {
  const [category, setCategory] = useState(null);
  const [file, setFile] = useState(null);
  const [list, setList] = useState([]);
  const [currentActive, setCurrentActive] = useState(null);
  const handleCancel = () => {
    toggleUploadModal(false);
    setCurrentActive(null);
    setList([]);
    getUserData(dataParams, setUserData, setLoading);
  };
  const cookies = new Cookies();
  const token = cookies.get("token");

  useEffect(() => {
    currentActive && addAttachment(currentActive);
    // eslint-disable-next-line
  }, [currentActive]);

  const addAttachment = async (data) => {
    updateStatus(data.id, "upload", list, setList);
    var bodyFormDataAdd = new FormData();
    bodyFormDataAdd.append("file", data.file);
    bodyFormDataAdd.append("cv", userId);
    bodyFormDataAdd.append("category", data.category);
    await axios({
      method: "POST",
      url: `/api/attachment`,
      data: bodyFormDataAdd,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("Attachment has been sucessfully uploaded");
          updateStatus(data.id, "uploaded", list, setList);
          setCurrentActive(null);
        } else {
          if (response.status === 201) {
            message.error(response.data.error);
            updateStatus(data.id, "error", list, setList);
            setCurrentActive(null);
          } else {
            message.error("Something Went Wrong!");
            updateStatus(data.id, "error", list, setList);
            setCurrentActive(null);
          }
        }
      })
      .catch(function (response) {
        message.error(response.response.data.error);
        updateStatus(data.id, "error", list, setList);
        setCurrentActive(null);
      });
  };

  return (
    <Modal
      title="Upload Attachments"
      visible={isUploadModal}
      onCancel={handleCancel}
      footer={false}
    >
      {isUploadModal && (
        <div className="file_multiple">
          <div className="flex-small-gap" style={{ width: "100%" }}>
            <Select
              placeholder={"Select Category"}
              options={categorySelection}
              onChange={(value) => setCategory(value)}
            />
            <Upload
              name="cv profile"
              listType="picture"
              accept=".pdf,.docx,.xslx"
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
              onClick={() => {
                const len = list.length;
                setList([
                  ...list,
                  {
                    id: len + 1,
                    category: category,
                    file: file,
                    upload: false,
                    uploaded: false,
                  },
                ]);
                setFile(null);
              }}
              disabled={category === null || file === null}
            >
              Add Attachment
            </Button>
          </div>
          <div className="flex-column-gap">
            {list.map((eachListItem) => (
              <div key={eachListItem.id} className="flex-between">
                <div style={{ overflow: "hidden" }}>
                  <div className="bold">
                    {checkCategory(eachListItem.category) + `:`}
                  </div>
                  <div>{eachListItem.file.name}</div>
                </div>
                {eachListItem.uploaded ? (
                  <BsCheckCircleFill
                    style={{ fontSize: "25px", color: "#1fc264" }}
                  />
                ) : (
                  <Button
                    type="primary"
                    style={{ borderRadius: "30px" }}
                    icon={<UploadOutlined />}
                    onClick={() => {
                      !currentActive && setCurrentActive(eachListItem);
                      currentActive &&
                        message.error(
                          "Please wait until the active uploading of the other file"
                        );
                    }}
                    loading={eachListItem.upload}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MultipleFileUpload;
