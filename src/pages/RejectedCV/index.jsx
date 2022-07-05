import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";
import Cookies from "universal-cookie";
import Navigation from "../../components/Navigation";
import { Table, message, Button, Pagination } from "antd";
import { AiOutlineFileText } from "react-icons/ai";
import "./rejectedcv.css";
import moment from "moment";
import FormData from "form-data";

const RejectedCV = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isLoading, setLoading] = useState(false);
  const [isReScanLoading, setReScanLoading] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const rootUrl =
    process.env.NODE_ENV === "production" ? "https://cv.omanjobs.om" : "";
  useEffect(() => {
    getAllRejectedCV();
    // eslint-disable-next-line
  }, [page]);

  const onChange = (page) => {
    setPage(page);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const reScanCv = async () => {
    setReScanLoading(true);
    var bodyFormData = new FormData();
    bodyFormData.append("ReScan_Reject_CV", "ReScan_Reject_CV");
    selectedRowKeys.forEach((file) => {
      bodyFormData.append("searchIDs[]", file);
    });
    await axios({
      method: "POST",
      url: `${rootUrl}/api/react-post.php`,
      data: bodyFormData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("CV Queued for Rescan.", "success");
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
          } else {
            message.error("Something Went Wrong!", "error");
          }
        }
        setReScanLoading(false);
        getAllRejectedCV();
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
        setReScanLoading(false);
      });
  };

  const deleteCv = async () => {
    setDeleteLoading(true);
    var bodyFormData = new FormData();
    bodyFormData.append("Delete_Reject_CV", "Delete_Reject_CV");
    selectedRowKeys.forEach((file) => {
      bodyFormData.append("searchIDs[]", file);
    });
    await axios({
      method: "POST",
      url: `${rootUrl}/api/react-post.php`,
      data: bodyFormData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("CV Queued for Rescan.", "success");
        } else {
          if (response.status === 201) {
            message.error(response.data.error, "error");
          } else {
            message.error("Something Went Wrong!", "error");
          }
        }
        setDeleteLoading(false);
        getAllRejectedCV();
      })
      .catch(function (response) {
        message.error("Something Went Wrong!", "error");
        setDeleteLoading(false);
      });
  };

  const getAllRejectedCV = async () => {
    setLoading(true);
    await axios({
      method: "GET",
      url: `${rootUrl}/api/rejectcv.php`,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      params: {
        row: page * 10 - 10,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          setData(response.data);
          setTotal(response.data.TotalDisplayRecords);
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

  // category: "Accounting"
  // created: "2022-04-12 05:21:07"
  // file: "CV-16497552671327909964.pdf"
  // id: 4576
  // remarks: "You do not have any more parsing credits"
  // status: 1
  // user: 1

  const columns = [
    {
      title: "Name",
      dataIndex: "file",
    },
    {
      title: "Uploaded on",
      render: (record) => (
        <div>{moment(record.created).format("DD-MM-YYYY")}</div>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
    {
      title: "CV View",
      render: (record) => (
        <Button
          type="primary"
          shape="round"
          onClick={() =>
            window.open(
              `https://cv.omanjobs.om/files/cv/${record.file}`,
              "_blank"
            )
          }
        >
          <AiOutlineFileText className="large-text" />
        </Button>
      ),
      width: "100px",
    },
  ];

  return (
    <div>
      <Header />
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={"Rejected CV"}
      />
      {selectedRowKeys.length > 0 && (
        <div className="actions-banner-top slide-in-top-animation">
          <div className="flex-small-gap medium-text bolder text-grey zoom-in-animation">{`${selectedRowKeys.length} Selected`}</div>
          <div>|</div>
          <div className="flex-small-gap zoom-in-animation">
            {!isDeleteLoading && (
              <Button
                className="no-margin-top"
                type="primary"
                shape="round"
                onClick={reScanCv}
                loading={isReScanLoading}
              >
                Re-Scan
              </Button>
            )}
            {isReScanLoading && (
              <div className="bolder text-blue zoom-in-animation">
                Re-Scanning the files
              </div>
            )}
            {!isReScanLoading && (
              <Button
                className="no-margin-top"
                type="danger"
                shape="round"
                onClick={deleteCv}
                loading={isDeleteLoading}
              >
                Delete
              </Button>
            )}
            {isDeleteLoading && (
              <div className="bolder text-red zoom-in-animation">
                Deleting the files
              </div>
            )}
          </div>
        </div>
      )}
      <div className="table">
        <Table
          dataSource={data.data}
          columns={columns}
          loading={isLoading}
          pagination={false}
          rowKey={"id"}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
            columnWidth: "80px",
          }}
        />
        <div className="pagination">
          <div className="pagination-total">{`Showing ${
            page === 1 ? 1 : page * 10 - 10 + 1
          } to ${page * 10 > total ? total : page * 10} of ${total}`}</div>
          <Pagination
            current={page}
            onChange={onChange}
            total={data.TotalDisplayRecords}
            showSizeChanger={false}
          />
        </div>
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default RejectedCV;
