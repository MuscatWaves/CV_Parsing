import React, { useState } from "react";
import { Modal, Button, Select, Upload, message } from "antd";
import { categorySelection } from "../../pages/CVProfile/constants";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { BsCheckCircleFill } from "react-icons/bs";
import { checkCategory, updateStatus } from "../../utilities";
import axios from "axios";
import Cookies from "universal-cookie";
import "./multip.css";

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
  const [list, setList] = useState([]);
  const [currentActive, setCurrentActive] = useState(true);
  const handleCancel = () => {
    toggleUploadModal(false);
    setCurrentActive(true);
    setList([]);
    getUserData(dataParams, setUserData, setLoading);
  };
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [uploadAll, setUploadAll] = useState(false);

  const deleteAttachment = (data) => {
    const deleteData = list.filter((each) => data.id !== each.id);
    const newData = deleteData.map((each, index) => {
      return {
        id: index + 1,
        category: each.category,
        file: each.file,
        upload: each.upload,
        uploaded: each.uploaded,
      };
    });
    setList(newData);
  };

  const addAttachment = async (data, newList, bulk) => {
    if (!data) {
      setUploadAll(false);
      message.error("Upload All Error, Please refresh your browser");
      return;
    }
    updateStatus(data.id, "upload", newList, setList);
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
          if (bulk) {
            const newArray = list.map((each) => {
              if (each.id <= data.id) {
                return { ...each, uploaded: true };
              }
              return each;
            });
            const newArray2 = newArray.map((each) => {
              if (each.id === data.id) {
                return { ...each, upload: true };
              }
              return each;
            });
            data.id !== list.length &&
              addAttachment(list[data.id], newArray2, true);
            setList(newArray2);
            if (data.id === list.length) {
              message.success("All Attachment has been sucessfully uploaded");
              setUploadAll(false);
              setCurrentActive(false);
            }
          } else {
            message.success("Attachment has been sucessfully uploaded");
            updateStatus(data.id, "uploaded", list, setList);
            setCurrentActive(false);
          }
        } else {
          if (response.status === 201) {
            message.error(response.data.error);
            updateStatus(data.id, "error", newList, setList);
            setCurrentActive(false);
            setUploadAll(false);
          } else {
            message.error("Something Went Wrong!");
            updateStatus(data.id, "error", newList, setList);
            setCurrentActive(false);
            setUploadAll(false);
          }
        }
      })
      .catch(function (response) {
        message.error(response.response.data.error);
        updateStatus(data.id, "error", newList, setList);
        setCurrentActive(false);
        setUploadAll(false);
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
          <div className="file_multiple__input-container">
            <Select
              placeholder={"Select Category"}
              options={categorySelection}
              onChange={(value) => setCategory(value)}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
            <Upload
              name="cv profile"
              listType="picture"
              accept=".pdf,.docx,.xslx,.doc,.jpg,.jpeg,.png"
              maxCount={1}
              beforeUpload={(file) => {
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
                return false;
              }}
              showUploadList={false}
              disabled={category === null}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </div>
          <div className="flex-column-gap">
            {list.map((eachListItem) => (
              <div key={eachListItem.id} className="flex-between">
                <div style={{ overflow: "hidden" }}>
                  <div className="bold">
                    {checkCategory(eachListItem.category) + `:`}
                  </div>
                  <div>{eachListItem.file.name}</div>
                  <div>
                    {eachListItem.file.size / 1000 > 2000 && (
                      <div className="very-small-text bolder text-red">{`File size greater than 2MB. Recommended to decrease the size!`}</div>
                    )}
                  </div>
                </div>
                {eachListItem.uploaded ? (
                  <BsCheckCircleFill
                    style={{ fontSize: "25px", color: "#1fc264" }}
                  />
                ) : (
                  !uploadAll && (
                    <div className="flex-small-gap">
                      <Button
                        type="danger"
                        style={{ borderRadius: "30px" }}
                        icon={<DeleteOutlined />}
                        onClick={() => deleteAttachment(eachListItem)}
                        disabled={eachListItem.upload}
                      />
                      <Button
                        type="primary"
                        style={{ borderRadius: "30px" }}
                        icon={<UploadOutlined />}
                        onClick={() => {
                          addAttachment(eachListItem, list);
                        }}
                        loading={eachListItem.upload}
                      />
                    </div>
                  )
                )}
              </div>
            ))}
            {(currentActive || list.length < 1) && (
              <div className="flex-center small-margin-top ">
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setUploadAll(true);
                    addAttachment(list[0], list, true);
                  }}
                  loading={uploadAll}
                >
                  Upload All (Beta)
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MultipleFileUpload;
