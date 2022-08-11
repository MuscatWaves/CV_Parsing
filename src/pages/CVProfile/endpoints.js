import axios from "axios";
import Cookies from "universal-cookie";
import {
    message,
  } from "antd";

const cookies = new Cookies();
const token = cookies.get("token");

// Last Seen Users

export const lastSeen = async (user, userData, token) => {
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
      url: `/api/cv/${dataParams.id}`
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

// Attachments Section

export const deleteData = async ({deletionData, setTableLoading, toggleDeleteModal, setDeletionData, dataParams, setUserData, setLoading}) => {
    var bodyFormDataDelete = new FormData();
    bodyFormDataDelete.append("id", deletionData.id);
    bodyFormDataDelete.append("name", deletionData.name);
    setTableLoading(true);
    await axios({
      method: "DELETE",
      url: `/api/attachment`,
      data: bodyFormDataDelete,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: token,
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
    bodyFormDataDelete.append("id", deleteEduData.id);
    setDeleteEduLoading(true);
    await axios({
      method: "DELETE",
      url: `/api/education`,
      data: bodyFormDataDelete,
      headers: {
        Authorization: token,
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
            setDeleteEduLoading(false);
          } else {
            message.error("Something Went Wrong!", "error");
            setDeleteEduLoading(false);
          }
        }
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
        setDeleteEduLoading(false);
      });
  };

// Delete Work Experience

export const deleteWorkExpData = async (deleteWeData, setDeleteWeLoading, setDeleteWeData, setDeleteWeModal, setLoading, dataParams, setUserData) => {
    var bodyFormDataDelete = new FormData();
    bodyFormDataDelete.append("id", deleteWeData.id);
    bodyFormDataDelete.append("userId", deleteWeData.id);
    setDeleteWeLoading(true);
    await axios({
      method: "DELETE",
      url: `/api/experience`,
      data: bodyFormDataDelete,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: token,
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
            setDeleteWeLoading(false);
          } else {
            message.error("Something Went Wrong!", "error");
            setDeleteWeLoading(false);
          }
        }
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
        setDeleteWeLoading(false);
      });
  };

//  Delete Full CV

export const deleteFullCV = async (userData, setDeleteCVLoading, setDeleteCVModal, navigateTo) => {
    var bodyFormDataDelete = new FormData();
    bodyFormDataDelete.append("id", userData.user.id);
    setDeleteCVLoading(true);
    await axios({
      method: "DELETE",
      url: `/api/experience`,
      data: bodyFormDataDelete,
      headers: {
        Authorization: token,
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

export const getAllUserManageList = async (setUserList, token) => {
    await axios({
      method: "GET",
      url: `/api/user`,
      headers: {
        Authorization: token,
      }
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