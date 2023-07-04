import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSignedIn } from "../../../redux/modules/credentials/credentials-selectors";
import {
  setIsFileUploading,
  uploadFilesStart,
} from "../../../redux/modules/fileSystem/fileSystem-actions";
import {
  selectFileMemory,
  selectGlobalState,
  selectUploadFiles,
} from "../../../redux/modules/fileSystem/fileSystem-selectors";

import { Button, Popover, Upload } from "antd";
import { FileImageOutlined, PlusCircleOutlined } from "@ant-design/icons";
import TreeBrowser from "./treeBrowser/TreeBrowser";

import Swal from "sweetalert2";

function NavigationPanel() {
  const dispatch = useDispatch();
  const signedInDetail = useSelector(selectSignedIn);
  const selectedFolderId = useSelector(selectGlobalState)?.selectedFolderId;
  const isLabelModeOn = useSelector(selectGlobalState)?.isLabelModeOn;
  const isDeleteModeOn = useSelector(selectGlobalState)?.isDeleteModeOn;
  const isExportModeOn = useSelector(selectGlobalState)?.isExportModeOn;
  const uploadFileStatus = useSelector(selectUploadFiles);
  const fileMemoryStatus = useSelector(selectFileMemory);

  const [fileList, setFileList] = useState([]);

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,

    action: (file) => {
      let tempFileList = [...fileList];

      let nameRegex = /^[()\-\w\s]+$/;
      let fileNameSplitArray = file["name"].split(".");
      let fileExt = fileNameSplitArray.pop();
      let fileNameNoExt = fileNameSplitArray[0];

      if (!nameRegex.test(fileNameNoExt)) {
        setFileList([]);
        Swal.fire({
          title: "Illegal File Name or File Type",
          html: "Only alphabet, numbers, underscores, whitespaces.",
          icon: "error",
          confirmButtonText: "Back",
        }).then((result) => {
          if (result.isConfirmed) {
            return;
          }
        });
        return;
      }

      if (
        fileExt.toLowerCase() === "jpg" ||
        fileExt.toLowerCase() === "jpeg" ||
        fileExt.toLowerCase() === "png" ||
        fileExt.toLowerCase() === "bmp"
      ) {
        tempFileList.push(file);
        setFileList(tempFileList);
      } else {
        setFileList([]);
        Swal.fire({
          title: "Illegal File Type",
          html: "Only jpg, jpes, png, bmp images allowed.",
          icon: "error",
          confirmButtonText: "Back",
        }).then((result) => {
          if (result.isConfirmed) {
            return;
          }
        });
      }
    },
  };

  const handleUploadFileStart = () => {
    Swal.fire({
      title: "Classification Batch Label",
      text:
        "Do you want to label all images as classification for this upload?",
      icon: "info",
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Enter Record Set Name",
          text: "Please enter the record set name",
          icon: "info",
          input: "text",
          confirmButtonText: "Proceed",
        }).then((result) => {
          let entered_record_set_name = "";
          if (result.isConfirmed) {
            if (!result.value) {
              Swal.fire("Invalid", "Record set name not entered.", "error");
              return;
            } else {
              entered_record_set_name = result.value;
              Swal.fire({
                text: "Enter Classification Label for this batch",
                input: "text",
                showDenyButton: true,
                denyButtonText: "Cancel Batch Label",
                confirmButtonText: "Confirm",
              }).then((result) => {
                if (result.isDenied) {
                  const uploadedFiles = {
                    userToken: signedInDetail?.user?.token,
                    pid: selectedFolderId,
                    fileArray: fileList,
                  };
                  dispatch(uploadFilesStart(uploadedFiles));
                  setFileList([]);
                } else if (result.isConfirmed) {
                  if (!result.value) {
                    Swal.fire(
                      "Label not entered",
                      "Please entered a label for your images.",
                      "error"
                    );
                  } else {
                    const uploadedFiles = {
                      userToken: signedInDetail?.user?.token,
                      pid: selectedFolderId,
                      fileArray: fileList,
                      record_set_name: entered_record_set_name,
                      al_type: "classification",
                      classification_label: result.value,
                    };
                    dispatch(uploadFilesStart(uploadedFiles));
                  }
                  setFileList([]);
                }
              });
            }
          }
        });
      } else if (result.isDenied) {
        const uploadedFiles = {
          userToken: signedInDetail?.user?.token,
          pid: selectedFolderId,
          fileArray: fileList,
        };
        dispatch(uploadFilesStart(uploadedFiles));
        setFileList([]);
      }
    });
  };

  useEffect(() => {
    if (uploadFileStatus?.isLoading) {
      dispatch(setIsFileUploading(true));
    } else {
      dispatch(setIsFileUploading(false));
    }
    //eslint-disable-next-line
  }, [uploadFileStatus?.isLoading]);

  return (
    <div className="h-full">
      <div
        className="mb-2 border-b bg-gray-200 opacity-80 shadow-sm"
        style={{ height: "5%" }}
      >
        {/* <Input placeholder="Search category" prefix={<SearchOutlined />} /> */}
        <p className="flex justify-start items-center h-full w-full font-semibold ml-5">
          Your Structed Sampling Folders
        </p>
      </div>

      <div className="h-full">
        <TreeBrowser />

        <div className="flex justify-center items-center flex-col">
          <Upload
            {...props}
            disabled={
              isLabelModeOn
                ? true
                : isDeleteModeOn
                ? true
                : isExportModeOn
                ? true
                : fileList.length
                ? true
                : selectedFolderId
                ? false
                : true
            }
          >
            <Popover content="Upload Image(s)" placement="bottom">
              <Button
                size="large"
                style={{ minWidth: "33vw" }}
                // disabled={selectedFolderId ? false : true}
                disabled={
                  isLabelModeOn
                    ? true
                    : isDeleteModeOn
                    ? true
                    : isExportModeOn
                    ? true
                    : fileList.length
                    ? true
                    : selectedFolderId
                    ? false
                    : true
                }
              >
                <PlusCircleOutlined />
                <FileImageOutlined />
              </Button>
            </Popover>
          </Upload>
          <div className="flex justify-center items-center mt-2">
            <Button
              disabled={fileList?.length ? false : true}
              type="primary"
              onClick={handleUploadFileStart}
            >
              Upload
            </Button>
            <Button
              disabled={fileList?.length ? false : true}
              danger
              type="primary"
              onClick={() => setFileList([])}
            >
              Clear
            </Button>
          </div>
          <p className="my-0 text-xs font-medium">
            Selected Files: {fileList.length}
          </p>
        </div>
        <div className="flex justify-start items-center mt-2 ml-3">
          <p className="text-gray-700  text-xs">
            {" "}
            Total Memory Used:
            <span className="ml-1 font-medium">
              {(fileMemoryStatus?.memory / 1000).toFixed(2)} KB
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NavigationPanel;
