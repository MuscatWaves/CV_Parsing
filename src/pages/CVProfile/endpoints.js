import axios from "axios";
import Cookies from "universal-cookie";
import {
    message,
  } from "antd";

const cookies = new Cookies();
const token = cookies.get("token");

// Last Seen Users

export const lastSeen = async (user, userData) => {
    var bodyFormDataLastSeen = new FormData();
    bodyFormDataLastSeen.append("cv", userData.user.id);

    await axios({
      method: "POST",
      url: `/api/lastseen`,
      data: bodyFormDataLastSeen,
      headers: {
        Authorization: token,
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

//  Get User Data - App View 

  export const getUserData = async (dataParams, setUserData, setLoading) => {
    setLoading("loading")
    await axios({
      method: "GET",
      url: `/api/cv/${dataParams.id}`,
      headers: {
        Authorization: token,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setUserData({
            user: response.data.user[0],
            attachments: response.data.attachment,
            experience: response.data.experience,
            educations: response.data.education,
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

//   Get User Data Public

export const getUserDataPublic = async (dataParams, setUserData, setLoading) => {
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

// Attachments Section

export const handleUploadModal = async (values, fileList, setTableLoading, userData, dataParams, setUserData, setLoading, toggleUploadModal, form) => {
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
          getUserData(dataParams, setUserData, setLoading);
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

export const deleteData = async ({deletionData, setTableLoading, toggleDeleteModal, setDeletionData, dataParams, setUserData, setLoading}) => {
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
          getUserData(dataParams, setUserData, setLoading);
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

//  Delete Education

export const deleteEducationData = async (deleteEduData, setDeleteEduLoading, setDeleteEduModal, setLoading, dataParams, setUserData, setDeleteEduData) => {
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
          getUserData(dataParams, setUserData, setLoading);
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

// Delete Work Experience

export const deleteWorkExpData = async (deleteWeData, setDeleteWeLoading, setDeleteWeData, setDeleteWeModal, setLoading, dataParams, setUserData) => {
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
          getUserData(dataParams, setUserData, setLoading);
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

//  Delete Full CV

export const deleteFullCV = async (userData, setDeleteCVLoading, setDeleteCVModal, navigateTo) => {
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

//    Get All User List

export const getAllUserManageList = async (setUserList) => {
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