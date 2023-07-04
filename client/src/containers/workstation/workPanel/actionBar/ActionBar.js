import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectSignedIn } from "../../../../redux/modules/credentials/credentials-selectors";
import {
  deleteFilesStart,
  downloadFilesStart,
  setClassImagesInLabel,
  setImagesInLabel,
  setIsDeleteMode,
  setIsExportMode,
  setIsFileUploading,
  setIsLabelMode,
} from "../../../../redux/modules/fileSystem/fileSystem-actions";
import {
  selectDownloadFiles,
  selectGlobalState,
  selectLoadFilesV1,
} from "../../../../redux/modules/fileSystem/fileSystem-selectors";
import {
  deleteLabellingSettingStart,
  duplicateLabelStart,
  exportLabelDataStart,
  isUnlabelledSelected,
  saveLabellingSettingStart,
  setSelectedLabelSetting,
} from "../../../../redux/modules/label/label-actions";
import { selectGetLabellingSetting } from "../../../../redux/modules/label/label-selectors";
import { parseSelectedImagesToLabelling } from "../../../../utils/data-processing";
import {
  Button,
  Divider,
  Dropdown,
  Input,
  message,
  Popover,
  Radio,
  Select,
  Tag,
  Menu,
} from "antd";
import {
  CheckSquareOutlined,
  DeleteOutlined,
  // EditOutlined,
  ExceptionOutlined,
  ExportOutlined,
  HighlightOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";

import { Option } from "antd/lib/mentions";
import Modal from "antd/lib/modal/Modal";

function ActionBar() {
  //#region //* ------ Configuration ------ *//
  const dispatch = useDispatch();
  const history = useHistory();

  const signedInDetail = useSelector(selectSignedIn);
  const selectedImages = useSelector(selectGlobalState).selectedImages;
  const isFileDownloading = useSelector(selectDownloadFiles);

  const loadedFilesV1Status = useSelector(selectLoadFilesV1);
  const loadedLabellingSettings = useSelector(selectGetLabellingSetting)
    ?.labellingSetting;
  const [isLabelModeOn, setIsLabelModeOn] = useState(false);
  const [isDeleteModeOn, setIsDeleteModeOn] = useState(false);
  const [isExportModeOn, setIsExportModeOn] = useState(false);
  const [isUnlabelledClick, setIsUnlabelledClick] = useState(false);
  const [selectedRecordSet, setSelectedRecordSet] = useState("all");
  const [isAddNewLabelSetVisible, setIsAddNewLabelSetVisible] = useState(false);
  const [newLabelSetInfo, setNewLabelSetInfo] = useState({
    recordName: "",
    alType: "",
    labelCategories: { input: "", setCategories: [] },
  });
  const [isNewSetCopied, setIsNewSetCopied] = useState(false);

  const [labelRecords, setLabelRecords] = useState([]);
  //#endregion

  //#region //* ------ Functions ------ *//
  const onOpenNewLabelModalClick = (mode) => {
    if (mode === "new") {
      setIsAddNewLabelSetVisible(true);
    } else if (mode === "edit") {
      setNewLabelSetInfo({
        recordName: selectedRecordSet?.record_name,
        alType: selectedRecordSet?.al_type,
        labelCategories: { input: "", setCategories: selectedRecordSet?.types },
      });
      setIsAddNewLabelSetVisible(true);
    }
  };

  const handleNewLabelSetConfirm = () => {
    if (
      newLabelSetInfo.recordName &&
      newLabelSetInfo.alType &&
      newLabelSetInfo.labelCategories.setCategories.length
    ) {
      let recordName = newLabelSetInfo.recordName;
      let alType = newLabelSetInfo.alType;
      let setCategories = newLabelSetInfo.labelCategories.setCategories;
      let isRecordNameDuplicated = false;
      if (
        loadedLabellingSettings?.length &&
        loadedLabellingSettings !== "No Record"
      ) {
        loadedLabellingSettings?.forEach((setting) => {
          if (setting?.record_name === recordName) {
            isRecordNameDuplicated = true;
          }
        });
      }
      if (isRecordNameDuplicated) {
        Swal.fire("Duplicated Name", "Record name already exists", "warning");
        return;
      } else {
        let dropDownLabelRecords = [...labelRecords];
        dropDownLabelRecords.push({
          al_type: alType,
          record_name: recordName,
          types: setCategories,
        });
        setLabelRecords(dropDownLabelRecords);
        dispatch(
          saveLabellingSettingStart({
            token: signedInDetail?.user?.token,
            record_data: {
              record_name: recordName,
              al_type: alType,
              types: setCategories,
              tags: "",
            },
          })
        );
      }
    } else {
      message.error("Please fill in all required fields!");
    }
    if (isNewSetCopied) {
      Swal.fire({
        title: "Copy label",
        text:
          "Do you want to duplicate label from original label set to the new label set?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(
            duplicateLabelStart({
              new_record_name: newLabelSetInfo?.recordName,
              record_name: selectedRecordSet?.record_name,
            })
          );
        }
      });
      setIsNewSetCopied(false);
    }
    setIsAddNewLabelSetVisible(false);
    setNewLabelSetInfo({
      recordName: "",
      alType: "",
      labelCategories: { input: "", setCategories: [] },
    });
  };

  const handleUnlabelledClick = () => {
    if (!isUnlabelledClick) {
      setIsUnlabelledClick(true);
    } else {
      setIsUnlabelledClick(false);
    }
  };

  const handleSelectedLabelSetDelete = () => {
    Swal.fire({
      title: `Delete - ${selectedRecordSet?.record_name}`,
      text:
        "By deleting, all labels will be lost. Are you sure you want to continue?",
      icon: "warning",
      showConfirmButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "red",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteLabellingSettingStart({
            token: signedInDetail?.user?.token,
            record_name: selectedRecordSet?.record_name,
          })
        );
        setSelectedRecordSet("");
      }
    });
  };

  const handleRecordSetSelect = (selectedName, mode = null) => {
    let selectedSet = {};
    if (selectedName === "all") {
      setSelectedRecordSet({
        alType: "all",
        recordName: "all",
        types: [],
      });
    } else {
      selectedSet = loadedLabellingSettings?.filter(
        (recordSet) => recordSet["record_name"] === selectedName
      )[0];
      setSelectedRecordSet(selectedSet);
    }
    if (mode !== "copying") {
      setIsUnlabelledClick(true);
    }
  };

  const onNewLabelSetTypeAdd = () => {
    if (newLabelSetInfo.labelCategories.input) {
      setNewLabelSetInfo({
        ...newLabelSetInfo,
        labelCategories: {
          ...newLabelSetInfo.labelCategories,
          setCategories: newLabelSetInfo.labelCategories.setCategories.push(
            newLabelSetInfo.labelCategories.input
          ),
        },
      });
      setNewLabelSetInfo({
        ...newLabelSetInfo,
        labelCategories: { ...newLabelSetInfo.labelCategories, input: "" },
      });
    }
  };

  const handleNewLabelSetTypeRemove = (e, category) => {
    let replicatedCategoryArray = [
      ...newLabelSetInfo.labelCategories.setCategories,
    ];
    if (replicatedCategoryArray.includes(category)) {
      replicatedCategoryArray = replicatedCategoryArray.filter(
        (currentCategory) => currentCategory !== category
      );
      setNewLabelSetInfo({
        ...newLabelSetInfo,
        labelCategories: {
          ...newLabelSetInfo.labelCategories,
          setCategories: replicatedCategoryArray,
        },
      });
    }
  };

  const handleOnSelectionConfirm = () => {
    if (selectedImages?.length) {
      Swal.fire({
        title: `Proceed for Labelling`,
        text: "Are you sure you want to label the selected images?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then((result) => {
        if (result.isConfirmed) {
          const parsedSelectedImages = parseSelectedImagesToLabelling(
            selectedImages
          );
          // dispatch(setImagesInLabel(parsedSelectedImages));
          // ---------------------------------------------------- //
          let classification_label = selectedImages?.map(function(each_file) {
            let each_file_object = {
              file_name: each_file.name,
              file_id: each_file.file_id,
              folder_id: each_file.folder_id,
              src: each_file.url,
              pixelSize: "",

              regions: [{ cls: false }],
              label_settings: {},
              al_type: "classification",
            };
            return each_file_object;
          });
          classification_label = classification_label.map(function(each_file) {
            let imgHeight = {};
            let imgWidth = {};
            let imgSize = new Image();
            imgSize.src = each_file.src;
            imgSize.onload = () => (imgHeight[each_file.src] = imgSize.height);
            imgSize.onload = () => (imgWidth[each_file.src] = imgSize.width);
            return {
              ...each_file,
              pixelSize: { w: imgSize.width, h: imgSize.height },
            };
          });
          dispatch(setImagesInLabel(parsedSelectedImages));
          dispatch(setClassImagesInLabel(classification_label));
          dispatch(
            setSelectedLabelSetting({
              alType: selectedRecordSet?.al_type,
              recordName: selectedRecordSet?.record_name,
              types: selectedRecordSet?.types,
            })
          );
          history.push("/label");
        }
      });
    } else {
      Swal.fire(
        "No Image Selected",
        "Please select image(s) to continue",
        "error"
      );
    }
  };

  const handleFileDelete = () => {
    if (selectedImages?.length) {
      Swal.fire({
        title: `Confirm to Delete`,
        text: "Are you sure you want to delete the selected images?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then((result) => {
        if (result.isConfirmed) {
          let fileIdArray = selectedImages?.map((image) => image.file_id);
          let folderId = selectedImages[0]?.folder_id;
          let userToken = signedInDetail?.user?.token;
          dispatch(
            deleteFilesStart({
              userToken: userToken,
              currentPageId: folderId,
              fileIdArray: fileIdArray,
            })
          );
          setIsDeleteModeOn(false);
        }
      });
    } else {
      Swal.fire(
        "No Image Selected",
        "Please select image(s) to continue",
        "error"
      );
    }
  };

  const handleFileExport = () => {
    if (selectedImages?.length) {
      Swal.fire({
        title: "Select Export Method",
        text: "Please select a method to continue exporting.",
        icon: "info",
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        confirmButtonText: "Export to Trainer",
        denyButtonText: "Download",
        denyButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          let fileIdArray = selectedImages?.map((image) => image.file_id);
          let folderId = selectedImages[0]?.folder_id;
          let userToken = signedInDetail?.user?.token;
          let record_set_name = selectedRecordSet?.record_name;
          dispatch(
            exportLabelDataStart({
              fileIdArray: fileIdArray,
              folderId: folderId,
              userToken: userToken,
              record_set_name: record_set_name,
              is_export: true,
            })
          );
        } else if (result.isDenied) {
          Swal.fire({
            title: "Select Download Method",
            text: "Please select whether to include label file (if applicable)",
            icon: "question",
            showDenyButton: true,
            confirmButtonText: "Include Label",
            denyButtonText: "Only Image(s)",
            denyButtonColor: "#3085d6",
            showCancelButton: false,
          }).then((result) => {
            if (result.isConfirmed) {
              let fileIdArray = selectedImages?.map((image) => image.file_id);
              let folderId = selectedImages[0]?.folder_id;
              let userToken = signedInDetail?.user?.token;
              let record_set_name = selectedRecordSet?.record_name;
              dispatch(
                downloadFilesStart({
                  fileIdArray: fileIdArray,
                  folderId: folderId,
                  userToken: userToken,
                  record_set_name: record_set_name,
                })
              );
            } else {
              let fileIdArray = selectedImages?.map((image) => image.file_id);
              let folderId = selectedImages[0]?.folder_id;
              let userToken = signedInDetail?.user?.token;
              dispatch(
                downloadFilesStart({
                  fileIdArray: fileIdArray,
                  folderId: folderId,
                  userToken: userToken,
                  is_export: false,
                })
              );
            }
          });
        }
      });
    } else {
      Swal.fire(
        "No Image Selected",
        "Please select image(s) to continue",
        "error"
      );
    }
  };

  //#endregion

  //#region //* ------ Lifecycle ------ *//
  useEffect(() => {
    if (loadedFilesV1Status?.loadedFiles?.files?.length) {
      let label_records = loadedFilesV1Status?.loadedFiles?.files
        ?.map((file) => {
          let file_label_records = Object.keys(file?.label_sets);
          if (file_label_records?.length) {
            let file_label_values = Object.values(file?.label_sets);
            let label_record_detail = file_label_records?.map(
              (record_name, idx) => {
                let reformed_label_records = {
                  record_name: record_name,
                  al_type: file_label_values[idx]?.al_type,
                  types: file_label_values[idx]?.types,
                };
                return reformed_label_records;
              }
            );
            return label_record_detail;
          } else return [];
        })
        ?.flat();
      let reduced_label_records = label_records.reduce((acc, item) => {
        let does_item_exist = false;
        acc.forEach((each_record) => {
          if (each_record?.record_name === item?.record_name) {
            does_item_exist = true;
          }
        });
        if (!does_item_exist) {
          acc.push(item);
        }
        return acc;
      }, []);
      setLabelRecords(reduced_label_records);
    }
    //eslint-disable-next-line
  }, [loadedFilesV1Status?.isLoading]);

  useEffect(() => {
    dispatch(setIsLabelMode(isLabelModeOn));
    //eslint-disable-next-line
  }, [isLabelModeOn]);

  useEffect(() => {
    dispatch(setIsDeleteMode(isDeleteModeOn));
    //eslint-disable-next-line
  }, [isDeleteModeOn]);

  useEffect(() => {
    dispatch(setIsExportMode(isExportModeOn));
    //eslint-disable-next-line
  }, [isExportModeOn]);

  useEffect(() => {
    dispatch(isUnlabelledSelected(isUnlabelledClick));
    //eslint-disable-next-line
  }, [isUnlabelledClick]);

  useEffect(() => {
    dispatch(isUnlabelledSelected(isUnlabelledClick));
    //eslint-disable-next-line
  }, [isUnlabelledClick]);

  useEffect(() => {
    if (!isAddNewLabelSetVisible) {
      if (selectedRecordSet?.recordName === "all") {
        dispatch(
          setSelectedLabelSetting({
            alType: "all",
            recordName: "all",
            types: "all",
          })
        );
      } else {
        dispatch(
          setSelectedLabelSetting({
            alType: selectedRecordSet?.al_type,
            recordName: selectedRecordSet?.record_name,
            types: selectedRecordSet?.types,
          })
        );
      }
    }
    //eslint-disable-next-line
  }, [selectedRecordSet]);

  useEffect(() => {
    if (isAddNewLabelSetVisible) {
      Swal.fire({
        title: "Enter new name",
        input: "text",
        icon: "info",
        showCancelButton: false,
        confirmButtonText: "Create",
      }).then((result) => {
        if (result.isConfirmed) {
          setNewLabelSetInfo({
            recordName: result.value,
            alType: selectedRecordSet?.al_type,
            labelCategories: {
              input: "",
              setCategories: selectedRecordSet?.types,
            },
          });
        }
      });
      setIsNewSetCopied(true);
    }
    //eslint-disable-next-line
  }, [selectedRecordSet]);

  useEffect(() => {
    if (isFileDownloading?.isLoading) {
      dispatch(setIsFileUploading(true));
    } else {
      dispatch(setIsFileUploading(false));
    }
    //eslint-disable-next-line
  }, [isFileDownloading?.isLoading]);
  //#endregion

  return (
    <div className="flex justify-around items-center bg-gradient-to-tr from-white bg-gray-200 shadow-sm border opacity-80">
      <div className="flex justify-center items-center w-3/5 py-2">
        <div
          className="w-full h-28 font-semibold mr-6 flex flex-col justify-center items-center"
          style={{ flex: "0.6" }}
        >
          <div className="flex flex-col justify-center items-center w-full">
            <Select
              className="w-full"
              style={{ width: "200px" }}
              defaultValue="all"
              value={selectedRecordSet?.record_name}
              onChange={(selectedName) => handleRecordSetSelect(selectedName)}
            >
              <Option key="all">------ Display All ------</Option>
              {labelRecords?.length ? (
                labelRecords?.map((record) => (
                  <Option key={record?.record_name}>
                    {record?.record_name}
                  </Option>
                ))
              ) : (
                <Option />
              )}
            </Select>
            <div className="flex justify-center items-center -ml-2 pt-1">
              <Popover content="Add new record set" placement="bottom">
                <Button
                  icon={
                    <PlusCircleOutlined
                      style={{ objectFit: "contain", fontSize: "15px" }}
                    />
                  }
                  style={{ width: "35px", marginRight: "3px" }}
                  onClick={() => onOpenNewLabelModalClick("new")}
                />
              </Popover>
              {/* <Popover content="Edit record set" placement="bottom">
                <Button
                  disabled={
                    selectedRecordSet &&
                    selectedRecordSet !== "all" &&
                    selectedRecordSet?.recordName !== "all"
                      ? false
                      : true
                  }
                  icon={
                    <EditOutlined
                      style={{ objectFit: "contain", fontSize: "15px" }}
                    />
                  }
                  style={{ width: "35px", marginRight: "3px" }}
                  onClick={() => onOpenNewLabelModalClick("edit")}
                />
              </Popover> */}
              <Popover content="Delete record set" placement="bottom">
                <Button
                  danger
                  disabled={
                    selectedRecordSet &&
                    selectedRecordSet !== "all" &&
                    selectedRecordSet?.recordName !== "all"
                      ? false
                      : true
                  }
                  icon={
                    <DeleteOutlined
                      style={{ objectFit: "contain", fontSize: "15px" }}
                    />
                  }
                  style={{ width: "35px", marginRight: "3px" }}
                  onClick={handleSelectedLabelSetDelete}
                />
              </Popover>
              <Popover
                content="Include images from other sets"
                placement="bottom"
              >
                <Button
                  danger={isUnlabelledClick ? true : false}
                  icon={
                    <ExceptionOutlined
                      style={{ objectFit: "contain", fontSize: "15px" }}
                    />
                  }
                  style={{ width: "35px", marginRight: "3px" }}
                  onClick={handleUnlabelledClick}
                />
              </Popover>
            </div>
          </div>
          <div className="mt-1">
            <Tag
              color={
                selectedRecordSet?.al_type === "classification"
                  ? "geekblue"
                  : selectedRecordSet?.al_type === "detection"
                  ? "gold"
                  : selectedRecordSet?.al_type === "segmentation"
                  ? "cyan"
                  : "default"
              }
            >
              {selectedRecordSet?.al_type
                ? selectedRecordSet?.al_type
                : selectedRecordSet === "all"
                ? "All Images"
                : "Not Selected"}
            </Tag>
          </div>
        </div>
        <Modal
          title="Record Set"
          onOk={handleNewLabelSetConfirm}
          visible={isAddNewLabelSetVisible}
          onCancel={() => {
            setNewLabelSetInfo({
              recordName: "",
              alType: "",
              labelCategories: { input: "", setCategories: [] },
            });
            setIsAddNewLabelSetVisible(false);
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <Radio.Group
              value={newLabelSetInfo.alType}
              onChange={(e) => {
                setNewLabelSetInfo({
                  ...newLabelSetInfo,
                  alType: e.target.value,
                });
              }}
            >
              <Radio.Button value="classification">Classification</Radio.Button>
              <Radio.Button value="detection">Detection</Radio.Button>
              <Radio.Button value="segmentation">Segmentation</Radio.Button>
            </Radio.Group>
            <Input
              value={newLabelSetInfo.recordName}
              className="mt-5"
              style={{ width: "350px" }}
              addonBefore="Record Name"
              onChange={(e) =>
                setNewLabelSetInfo({
                  ...newLabelSetInfo,
                  recordName: e.target.value,
                })
              }
            />
            <div className="mt-5">
              <Input
                value={newLabelSetInfo.labelCategories.input}
                addonBefore="Types"
                onPressEnter={onNewLabelSetTypeAdd}
                suffix={
                  <Button
                    type="ghost"
                    size="small"
                    onClick={onNewLabelSetTypeAdd}
                  >
                    +
                  </Button>
                }
                style={{ width: "350px" }}
                onChange={(e) => {
                  setNewLabelSetInfo({
                    ...newLabelSetInfo,
                    labelCategories: {
                      ...newLabelSetInfo.labelCategories,
                      input: e.target.value,
                    },
                  });
                }}
              />
              <div className="mt-1 ml-2 flex items-center ">
                <p className="font-semibold text-xs mr-2">Added Types:</p>
                {newLabelSetInfo?.labelCategories?.setCategories?.map(
                  (category, idx) => (
                    <div className="flex items-center mr-4 -mt-2" key={idx}>
                      <p className="pt-2 mr-1 text-xs">{category}</p>
                      <MinusCircleOutlined
                        style={{ fontSize: "10px", paddingBottom: "2px" }}
                        onClick={(e) =>
                          handleNewLabelSetTypeRemove(e, category)
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="mt-2 flex justify-center items-center">
              <span className="-mr-7 border p-1 px-2 cursor-default">
                Copy from other record set
              </span>
              <Dropdown.Button
                overlay={
                  <Menu
                    value={selectedRecordSet?.record_name}
                    onClick={(e) => handleRecordSetSelect(e.key, "copying")}
                  >
                    {loadedLabellingSettings?.length &&
                    loadedLabellingSettings !== "No Record" ? (
                      loadedLabellingSettings?.map((recordSetting) => (
                        <Menu.Item key={recordSetting?.record_name}>
                          {recordSetting?.record_name}
                        </Menu.Item>
                      ))
                    ) : (
                      <Menu.Item>-</Menu.Item>
                    )}
                  </Menu>
                }
              ></Dropdown.Button>
            </div>
          </div>
        </Modal>

        {isLabelModeOn ? (
          <div
            className="flex flex-col justify-center items-center w-full mr-2"
            style={{ flex: "0.4" }}
          >
            <Button
              style={{ width: "100%", height: "70px" }}
              className="mx-2 mr-4"
              icon={
                <CheckSquareOutlined
                  style={
                    selectedRecordSet?.record_name && selectedRecordSet?.al_type
                      ? { color: "rgb(37, 99, 235)" }
                      : { color: "lightgray" }
                  }
                />
              }
              size="large"
              onClick={handleOnSelectionConfirm}
              disabled={
                selectedRecordSet?.record_name && selectedRecordSet?.al_type
                  ? false
                  : true
              }
            >
              <br />
              <span
                className={
                  selectedRecordSet?.record_name && selectedRecordSet?.al_type
                    ? "text-sm font-semibold text-blue-600"
                    : "text-sm font-semibold text-gray-400"
                }
              >
                Confirm & Label
              </span>
            </Button>
            <Button
              style={{ width: "100%" }}
              className="mx-2 mr-4"
              icon={<RollbackOutlined />}
              danger
              onClick={() => setIsLabelModeOn(false)}
            />
          </div>
        ) : (
          <Button
            style={{ width: "100%", height: "90px", flex: "0.3" }}
            className="mx-2 mr-6"
            icon={<HighlightOutlined />}
            size="large"
            onClick={() => setIsLabelModeOn(true)}
            disabled={
              isDeleteModeOn
                ? true
                : isExportModeOn
                ? true
                : selectedRecordSet?.record_name === "all"
                ? true
                : !selectedRecordSet?.record_name
                ? true
                : false
            }
          />
        )}
      </div>

      <Divider
        type="vertical"
        style={{ minHeight: "112px", marginLeft: "-12px" }}
      />

      <div className="w-2/5 flex justify-evenly items-center px-4 h-28">
        <div className="flex flex-col justify-center items-center w-full h-full">
          {isDeleteModeOn ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <Button
                className="w-full mr-1 -ml-5"
                style={{ height: "50%" }}
                size="large"
                onClick={handleFileDelete}
              >
                <span className="text-sm font-semibold text-blue-600">
                  Confirm & Delete
                </span>
              </Button>
              <Button
                style={{ width: "100%" }}
                className="w-full mr-1 -ml-5 "
                icon={<RollbackOutlined />}
                danger
                onClick={() => setIsDeleteModeOn(false)}
              />
            </div>
          ) : (
            <Button
              className="w-full mr-1 -ml-5"
              style={{ height: "80%" }}
              danger={!isDeleteModeOn ? true : false}
              size="large"
              disabled={isLabelModeOn ? true : isExportModeOn ? true : false}
              onClick={() =>
                !isDeleteModeOn
                  ? setIsDeleteModeOn(true)
                  : setIsDeleteModeOn(false)
              }
            >
              <DeleteOutlined />
            </Button>
          )}
        </div>

        {isExportModeOn ? (
          <div className="w-full h-full flex flex-col justify-center items-center ml-5">
            <Button
              className="w-full mr-1 -ml-5"
              style={{ height: "50%" }}
              size="large"
              onClick={handleFileExport}
            >
              <span className="text-sm font-semibold text-blue-600">
                Confirm & Export
              </span>
            </Button>
            <Button
              style={{ width: "100%" }}
              className="w-full mr-1 -ml-5 "
              icon={<RollbackOutlined />}
              danger
              onClick={() => setIsExportModeOn(false)}
            />
          </div>
        ) : (
          <Button
            className="w-full ml-1"
            style={{ height: "80%" }}
            type="primary"
            size="large"
            disabled={
              isLabelModeOn
                ? true
                : isDeleteModeOn
                ? true
                : !selectedRecordSet?.record_name ||
                  selectedRecordSet?.record_name === "all"
                ? true
                : false
            }
            onClick={() =>
              !isExportModeOn
                ? setIsExportModeOn(true)
                : setIsExportModeOn(false)
            }
          >
            <ExportOutlined />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ActionBar;
