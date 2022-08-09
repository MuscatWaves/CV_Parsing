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
import { m } from "framer-motion";

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

  useEffect(() => {
    document.title = "Rejected CV";
    getAllRejectedCV();
    // eslint-disable-next-line
  }, [page]);

  const onChange = (page) => {
    setPage(page);
  };

  const onSelectChange = (newSelectedRowKeys) => {
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
      url: `/api/react-post.php`,
      data: bodyFormData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("CV Queued for Rescan.", "success");
          setSelectedRowKeys([]);
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
      url: `/api/react-post.php`,
      data: bodyFormData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success("CV Queued for Delete.", "success");
          setSelectedRowKeys([]);
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
      url: `/api/cv/reject`,
      headers: {
        Authorization: token,
      },
      params: {
        row: page,
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          setData(response.data);
          setTotal(response.data.TotalDisplay[0].total);
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
          onClick={() => window.open(`/files/cv/${record.file}`, "_blank")}
        >
          <AiOutlineFileText className="large-text" />
        </Button>
      ),
      width: "100px",
    },
  ];

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
            total={total}
            showSizeChanger={false}
          />
        </div>
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </m.div>
  );
};

export default RejectedCV;
