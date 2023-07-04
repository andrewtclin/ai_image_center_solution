import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setSelectedImages } from "../../../../redux/modules/fileSystem/fileSystem-actions";
import {
  selectGlobalState,
  selectLoadFiles,
  selectLoadFilesV1,
} from "../../../../redux/modules/fileSystem/fileSystem-selectors";
import {
  handleFileSelection,
  imageBrowserFiltering,
  imageBrowserSearchImage,
} from "../../../../utils/data-processing";

// import Resizer from "react-image-file-resizer";

import { Button, Card, Col, Input, Pagination, Row, Spin, Tag } from "antd";
import Meta from "antd/lib/card/Meta";
import { FileSearchOutlined } from "@ant-design/icons";
import {
  selectIsUnlabelledSelected,
  selectSelectedLabelSetting,
} from "../../../../redux/modules/label/label-selectors";

function ImageBrowser() {
  //#region //* ------ Configuration ------ *//
  const dispatch = useDispatch();

  const loadedFilesV1Status = useSelector(selectLoadFilesV1);
  const loadedFiles = useSelector(selectLoadFiles);
  const selectedFolderId = useSelector(selectGlobalState)?.selectedFolderId;
  const isLabelModeOn = useSelector(selectGlobalState)?.isLabelModeOn;
  const isDeleteModeOn = useSelector(selectGlobalState)?.isDeleteModeOn;
  const isExportModeOn = useSelector(selectGlobalState)?.isExportModeOn;
  const selectedLabelSetting = useSelector(selectSelectedLabelSetting);
  const isUnlabelledSelected = useSelector(selectIsUnlabelledSelected);
  const isFileUploading = useSelector(selectGlobalState)?.isFileUploading;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [replicatedLoadedFiles, setReplicatedLoadedFiles] = useState([]);
  var blobUrl = [];

  const [pagination, setPagination] = useState({
    currentPageNumber: 1,
    totalItems: 0,
    itemsPerPage: 28,
  });

  //#endregion

  //#region //* ------ Functions ------ *//

  const handleFileSelectAll = () => {
    if (
      selectedFiles?.length !== loadedFilesV1Status?.loadedFiles?.files?.length
    ) {
      setSelectedFiles([]);
      let selectedTempAllFiles = loadedFilesV1Status?.loadedFiles?.files?.map(
        (file) => {
          let tempFile = {
            ...file,
            file_id: file.fileId,
            folder_id: file.folderId,
          };
          delete tempFile["fileId"];
          delete tempFile["folderId"];
          return tempFile;
        }
      );
      setSelectedFiles(selectedTempAllFiles);
    } else {
      setSelectedFiles([]);
    }
  };

  const handleFileOnSelect = (selectedFileInfo) => {
    if (isLabelModeOn || isDeleteModeOn || isExportModeOn) {
      const processedSelectedFiles = handleFileSelection(
        selectedFileInfo,
        selectedFiles
      );
      setSelectedFiles(processedSelectedFiles);
    }
  };

  const handleSearchImage = (e) => {
    let filteredImages = imageBrowserSearchImage(
      loadedFilesV1Status?.loadedFiles?.files,
      e.target.value
    );
    setReplicatedLoadedFiles(filteredImages);
  };

  //#endregion

  //#region //* ------ Lifecycle ------ *//
  useEffect(() => {
    setPagination({
      ...pagination,
      totalItems: loadedFiles?.loadedFiles?.files?.length,
    });
    //eslint-disable-next-line
  }, [loadedFilesV1Status?.loadedFiles?.files]);

  useEffect(() => {
    if (!isLabelModeOn || !isDeleteModeOn || !isExportModeOn) {
      setSelectedFiles([]);
    }
  }, [isLabelModeOn, isDeleteModeOn, isExportModeOn]);

  useEffect(() => {
    dispatch(setSelectedImages(selectedFiles));
    //eslint-disable-next-line
  }, [selectedFiles]);

  useEffect(() => {
    if (!isLabelModeOn && loadedFilesV1Status?.loadedFiles?.files?.length) {
      let filteredImages = imageBrowserFiltering(
        loadedFilesV1Status?.loadedFiles?.files,
        selectedLabelSetting?.recordName,
        isUnlabelledSelected
      );

      setReplicatedLoadedFiles(filteredImages);
    }

    //eslint-disable-next-line
  }, [selectedLabelSetting, isUnlabelledSelected]);

  useEffect(() => {
    if (!loadedFiles?.loadedFiles?.files?.length) {
      setReplicatedLoadedFiles([]);
      return;
    }
    if (
      isUnlabelledSelected &&
      selectedLabelSetting?.recordName &&
      selectedLabelSetting !== "No Record"
    ) {
      let lastItemNumber =
        pagination?.currentPageNumber * pagination?.itemsPerPage;
      let startItemNumber = lastItemNumber - (pagination?.itemsPerPage - 1);
      setReplicatedLoadedFiles(
        loadedFilesV1Status?.loadedFiles?.files?.slice(
          startItemNumber - 1,
          lastItemNumber
        )
      );
    } else if (
      selectedLabelSetting?.recordName === "all" ||
      !selectedLabelSetting?.recordName
    ) {
      let lastItemNumber =
        pagination?.currentPageNumber * pagination?.itemsPerPage;
      let startItemNumber = lastItemNumber - (pagination?.itemsPerPage - 1);
      setReplicatedLoadedFiles(
        loadedFilesV1Status?.loadedFiles?.files?.slice(
          startItemNumber - 1,
          lastItemNumber
        )
      );
    }
    //eslint-disable-next-line
  }, [
    pagination?.currentPageNumber,
    selectedLabelSetting,
    isUnlabelledSelected,
    loadedFilesV1Status?.isLoading,
  ]);

  // useEffect(() => {
  //   if (replicatedLoadedFiles?.length) {
  //     try {
  //       replicatedLoadedFiles?.forEach((file) => {
  //         fetch(file.url)
  //           .then((res) => res.blob())
  //           .then((blobFile) =>
  //             Resizer.imageFileResizer(
  //               blobFile,
  //               180,
  //               180,
  //               "JPEG",
  //               0,
  //               0,
  //               (uri) => {
  //                 blobUrl.push(uri);
  //                 document.getElementById(file.fileId).src = uri;
  //               }
  //             )
  //           );
  //       });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   //eslint-disable-next-line
  // }, [replicatedLoadedFiles]);
  //#endregion

  return (
    <div className="h-full">
      <Pagination
        className="flex justify-center items-center"
        style={{ marginBottom: "5px" }}
        current={pagination?.currentPageNumber}
        total={pagination?.totalItems}
        pageSize={pagination?.itemsPerPage}
        showSizeChanger={false}
        onChange={(currentPageNumber, itemsPerPage) => {
          setPagination({
            ...pagination,
            currentPageNumber: currentPageNumber,
          });
        }}
        // onShowSizeChange={(currentPageNumber, itemsPerPage) =>
        //   console.log(
        //     "onShowSizeChange, currentPageNumber:",
        //     currentPageNumber,
        //     " itemsPerPage:",
        //     itemsPerPage
        //   )
        // }
      />
      <div
        className={
          isLabelModeOn || isDeleteModeOn || isExportModeOn
            ? "overflow-y-auto h-5/6 border-2 border-blue-100 shadow-2xl p-4"
            : "overflow-y-auto h-5/6 border border-gray-100 p-4"
        }
      >
        <Spin tip="Loading..." spinning={isFileUploading} size="large">
          {isLabelModeOn || isDeleteModeOn || isExportModeOn ? (
            <div className="flex flex-col justify-center items-center -mt-2 mb-2">
              <div className="flex justify-center items-center">
                <Button
                  onClick={handleFileSelectAll}
                  danger={
                    selectedFiles?.length ===
                    loadedFilesV1Status?.loadedFiles?.files?.length
                      ? true
                      : false
                  }
                >
                  {selectedFiles?.length ===
                  loadedFilesV1Status?.loadedFiles?.files?.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
              <p className="-mb-2 text-gray-600">
                Selected Image(s): {selectedFiles?.length}
              </p>
            </div>
          ) : (
            ""
          )}
          {replicatedLoadedFiles?.length && selectedFolderId ? (
            <Row justify="start" align="middle" gutter={[16, 16]}>
              {replicatedLoadedFiles?.map((file, idx) => {
                return (
                  <Col
                    xxl={{ span: 6 }}
                    xl={{ span: 6 }}
                    lg={{ span: 8 }}
                    md={{ span: 8 }}
                    sm={{ span: 12 }}
                    xs={{ span: 24 }}
                    style={{ display: "flex", justifyContent: "center" }}
                    key={idx}
                  >
                    <Card
                      hoverable
                      style={
                        selectedFiles?.some(
                          (selectedFile) =>
                            selectedFile.file_id === file.fileId &&
                            selectedFile.folder_id === file.folderId
                        )
                          ? {
                              width: 180,
                              border: "1px solid rgba(248, 113, 113)",
                            }
                          : { width: 180, border: "1px solid lightgray" }
                      }
                      cover={
                        <img
                          id={file.fileId}
                          alt="data"
                          loading="lazy"
                          style={
                            selectedFiles?.some(
                              (selectedFile) =>
                                selectedFile.file_id === file.fileId &&
                                selectedFile.folder_id === file.folderId
                            )
                              ? {
                                  border: "1px solid rgba(248, 113, 113)",
                                  borderBottom: "1px solid lightgray",
                                }
                              : {
                                  border: "1px solid lightgray",
                                }
                          }
                        />
                        // <img
                        //   alt="data"
                        //   loading="lazy"
                        //   style={
                        //     selectedFiles?.some(
                        //       (selectedFile) =>
                        //         selectedFile.file_id === file.fileId &&
                        //         selectedFile.folder_id === file.folderId
                        //     )
                        //       ? {
                        //           border: "1px solid rgba(248, 113, 113)",
                        //           borderBottom: "1px solid lightgray",
                        //           // imageRendering: "pixelated",
                        //         }
                        //       : {
                        //           border: "1px solid lightgray",
                        //           // imageRendering: "pixelated",
                        //         }
                        //   }
                        //   width={180}
                        //   // src={file.url}
                        //   src={file.url}
                        //   // placeholder={
                        //   //   <Image
                        //   //     preview={false}
                        //   //     src={
                        //   //       file.url +
                        //   //       "?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_180,w_180"
                        //   //     }
                        //   //     width={180}
                        //   //   />
                        //   // }
                        // />
                      }
                    >
                      <div onClick={() => handleFileOnSelect(file)}>
                        {Object.keys(file?.label_sets)?.length
                          ? Object.keys(file?.label_sets)?.map(
                              (record_name, file_record_idx) => (
                                <div
                                  style={{
                                    marginBottom: "5px",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                  }}
                                  key={record_name}
                                >
                                  <Tag
                                    color={
                                      Object.values(file?.label_sets)[
                                        file_record_idx
                                      ]["al_type"] === "classification"
                                        ? "cyan"
                                        : Object.values(file?.label_sets)[
                                            file_record_idx
                                          ]["al_type"] === "detection"
                                        ? "geekblue"
                                        : Object.values(file?.label_sets)[
                                            file_record_idx
                                          ]["al_type"] === "segmentation"
                                        ? "purple"
                                        : ""
                                    }
                                  >
                                    {record_name}
                                  </Tag>
                                </div>
                              )
                            )
                          : ""}

                        <Meta
                          onClick={() => handleFileOnSelect(file)}
                          title={file.name}
                        />
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <p className="flex justify-center items-center w-full h-5/6 text-sm font-semibold text-gray-700">
              No file(s) to display...
            </p>
          )}
        </Spin>
      </div>

      <div className="h-1/6">
        <Input
          onChange={(e) => handleSearchImage(e)}
          placeholder="Search image(s)"
          addonAfter={<FileSearchOutlined />}
        />
      </div>
    </div>
  );
}

export default ImageBrowser;
