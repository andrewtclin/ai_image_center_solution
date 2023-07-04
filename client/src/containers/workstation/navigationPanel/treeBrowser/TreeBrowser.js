import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSignedIn } from "../../../../redux/modules/credentials/credentials-selectors";
import {
  selectFolderHierarchy,
  selectGlobalState,
} from "../../../../redux/modules/fileSystem/fileSystem-selectors";
import {
  createFolderHierarchyStart,
  deleteFoldersStart,
  setSelectedFolder,
} from "../../../../redux/modules/fileSystem/fileSystem-actions";

import {
  AppstoreAddOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Input,
  notification,
  Popover,
  Select,
  Tree,
} from "antd";
import Modal from "antd/lib/modal/Modal";
import { getTreeData } from "../../../../utils/data-processing";
import { Option } from "antd/lib/mentions";
import { getLabellingSettingStart } from "../../../../redux/modules/label/label-actions";
import {
  selectDeleteLabellingSetting,
  selectSaveLabellingSetting,
} from "../../../../redux/modules/label/label-selectors";
import Swal from "sweetalert2";

function TreeBrowser() {
  //#region ------ Configuration ------
  const dispatch = useDispatch();
  const selectedFolderId = useSelector(selectGlobalState)?.selectedFolderId;
  const folderHierarchy = useSelector(selectFolderHierarchy);
  const signedInDetail = useSelector(selectSignedIn);
  const isLabelModeOn = useSelector(selectGlobalState)?.isLabelModeOn;
  const isDeleteModeOn = useSelector(selectGlobalState)?.isDeleteModeOn;
  const isExportModeOn = useSelector(selectGlobalState)?.isExportModeOn;
  const saveLabellingSettingStatus = useSelector(selectSaveLabellingSetting);
  const deleteLabellingSettingStatus = useSelector(
    selectDeleteLabellingSetting
  );

  const [isHierarchyModalVisible, setIsHierarchyModalVisible] = useState(false);
  const [selectedNewHierarchyInfo, setSelectedNewHierarchyInfo] = useState({
    level1: {
      name: "",
      _id: "",
    },
    level2: {
      name: "",
      _id: "",
    },
    level3: {
      name: "",
      _id: "",
    },
    level4: {
      name: "",
      _id: "",
    },
    level5: {
      name: "",
      _id: "",
    },
  });
  const [newHierarchyInfoList, setNewHierarchyInfoList] = useState({
    level1: { folderList: [], inputName: "" },
    level2: { folderList: [], inputName: "" },
    level3: { folderList: [], inputName: "" },
    level4: { folderList: [], inputName: "" },
    level5: { folderList: [], inputName: "" },
  });

  //#endregion

  //#region  ------ Functions ------
  //#region ------ Tree ------
  const onSelect = (selectedKeys, info) => {
    if (info.node.level === 5) {
      dispatch(setSelectedFolder(selectedKeys[0]));
      // setSelectedFolderInfo(info.node);
    } else {
      dispatch(setSelectedFolder(""));
    }
  };

  const onCheck = (checkedKeys, info) => {};
  //#endregion

  //#region ------ Right Click ------
  const handleTreeNodeRightClick = (e) => {
    Swal.fire({
      title: "Delete folder and subfolder(s)",
      text:
        "By deleting this folder, all exising subfolders and related documents will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteFoldersStart({
            token: signedInDetail?.user?.token,
            folder_id: e.node._id,
          })
        );
      }
    });
  };
  //#endregion

  //#region ------ Hierarchy Modal ------

  const handleAddHierarchy = () => {
    if (!isHierarchyModalVisible) {
      setIsHierarchyModalVisible(true);
    } else {
      setIsHierarchyModalVisible(false);
    }
  };

  const handleConfirmHierarchyModal = () => {
    if (
      selectedNewHierarchyInfo.level1.name &&
      selectedNewHierarchyInfo.level2.name &&
      selectedNewHierarchyInfo.level3.name &&
      selectedNewHierarchyInfo.level4.name &&
      selectedNewHierarchyInfo.level5.name
    ) {
      dispatch(
        createFolderHierarchyStart({
          userToken: signedInDetail?.user?.token,
          hierarchyInfo: selectedNewHierarchyInfo,
        })
      );
      setSelectedNewHierarchyInfo({
        level1: {
          name: "",
          _id: "",
        },
        level2: {
          name: "",
          _id: "",
        },
        level3: {
          name: "",
          _id: "",
        },
        level4: {
          name: "",
          _id: "",
        },
        level5: {
          ...selectedNewHierarchyInfo.level5,
        },
      });
      setNewHierarchyInfoList({
        level1: { folderList: [], inputName: "" },
        level2: { folderList: [], inputName: "" },
        level3: { folderList: [], inputName: "" },
        level4: { folderList: [], inputName: "" },
        level5: { folderList: [], inputName: "" },
      });
      setIsHierarchyModalVisible(false);
    } else {
      notification.open({
        message: "Incomplete",
        description: "Please fill in all information required.",
        icon: <WarningOutlined style={{ color: "#FFB52E" }} />,
      });
    }
  };

  const handleCancelHierarchyModal = () => {
    setIsHierarchyModalVisible(false);
  };

  const onAddFolderItemClick = (folderLevel) => {
    if (folderLevel === "level1") {
      const inputName = newHierarchyInfoList?.level1?.inputName;
      let currentFolderList = newHierarchyInfoList?.level1?.folderList;
      currentFolderList?.push({
        name: inputName,
        _id: "",
        pid: "",
        isNew: true,
      });
      setNewHierarchyInfoList({
        ...newHierarchyInfoList,
        level1: {
          ...newHierarchyInfoList?.level1,
          folderList: currentFolderList,
          inputName: "",
        },
      });
    } else if (folderLevel === "level2") {
      const inputName = newHierarchyInfoList?.level2?.inputName;
      let currentFolderList = newHierarchyInfoList?.level2?.folderList;
      currentFolderList?.push({
        name: inputName,
        _id: "",
        pid: "",
        isNew: true,
      });
      setNewHierarchyInfoList({
        ...newHierarchyInfoList,
        level2: {
          ...newHierarchyInfoList?.level2,
          folderList: currentFolderList,
          inputName: "",
        },
      });
    } else if (folderLevel === "level3") {
      const inputName = newHierarchyInfoList?.level3?.inputName;
      let currentFolderList = newHierarchyInfoList?.level3?.folderList;
      currentFolderList?.push({
        name: inputName,
        _id: "",
        pid: "",
        isNew: true,
      });
      setNewHierarchyInfoList({
        ...newHierarchyInfoList,
        level3: {
          ...newHierarchyInfoList?.level3,
          folderList: currentFolderList,
          inputName: "",
        },
      });
    } else if (folderLevel === "level4") {
      const inputName = newHierarchyInfoList?.level4?.inputName;
      let currentFolderList = newHierarchyInfoList?.level4?.folderList;
      currentFolderList?.push({
        name: inputName,
        _id: "",
        pid: "",
        isNew: true,
      });
      setNewHierarchyInfoList({
        ...newHierarchyInfoList,
        level4: {
          ...newHierarchyInfoList?.level4,
          folderList: currentFolderList,
          inputName: "",
        },
      });
    } else if (folderLevel === "level5") {
      const inputName = newHierarchyInfoList?.level5?.inputName;
      let currentFolderList = newHierarchyInfoList?.level5?.folderList;
      currentFolderList?.push({
        name: inputName,
        _id: "",
        pid: "",
        isNew: true,
      });
      setNewHierarchyInfoList({
        ...newHierarchyInfoList,
        level5: {
          ...newHierarchyInfoList?.level5,
          folderList: currentFolderList,
          inputName: "",
        },
      });
    }
  };
  //#endregion
  //#endregion

  //#region ------ Lifecycle ------
  useEffect(() => {
    if (isHierarchyModalVisible) {
      setNewHierarchyInfoList({
        ...newHierarchyInfoList,
        level1: {
          ...newHierarchyInfoList.level1,
          folderList: folderHierarchy?.folders?.map((folderInfo) => {
            if (folderInfo.level === 1) {
              let tempFolderInfo = {
                name: folderInfo.name,
                _id: folderInfo?._id,
                pid: folderInfo?.pid,
                isNew: false,
              };
              return tempFolderInfo;
            } else return null;
          }),
        },
      });
    }

    //eslint-disable-next-line
  }, [isHierarchyModalVisible]);

  useEffect(() => {
    if (
      isHierarchyModalVisible &&
      selectedNewHierarchyInfo?.level1?.name &&
      selectedNewHierarchyInfo?.level1?._id
    ) {
      let selectedLevel1Folder = [];
      selectedLevel1Folder = folderHierarchy?.folders?.filter(
        (folderInfo) =>
          folderInfo?._id === selectedNewHierarchyInfo?.level1?._id
      );
      setNewHierarchyInfoList({
        ...newHierarchyInfoList,
        level2: {
          ...newHierarchyInfoList.level2,
          folderList: selectedNewHierarchyInfo?.level1?._id
            ? selectedLevel1Folder[0]?.child?.map((folderInfo) => {
                if (folderInfo.level === 2) {
                  let tempFolderInfo = {
                    name: folderInfo.name,
                    _id: folderInfo?._id ? folderInfo?._id : "",
                    pid: folderInfo?.pid ? folderInfo?.pid : "",
                    isNew: false,
                  };
                  return tempFolderInfo;
                } else return null;
              })
            : [],
        },
      });
    }
    //eslint-disable-next-line
  }, [isHierarchyModalVisible, selectedNewHierarchyInfo]);

  useEffect(() => {
    if (
      isHierarchyModalVisible &&
      selectedNewHierarchyInfo?.level2?.name &&
      selectedNewHierarchyInfo?.level2?._id
    ) {
      let selectedLevel1Folder = [];
      selectedLevel1Folder = folderHierarchy?.folders?.filter(
        (folderInfo) =>
          folderInfo?._id === selectedNewHierarchyInfo?.level1?._id
      );
      let selectedLevel2Folder = selectedLevel1Folder[0]?.child?.filter(
        (folderInfo) =>
          folderInfo?._id === selectedNewHierarchyInfo?.level2?._id
      );

      setNewHierarchyInfoList({
        ...newHierarchyInfoList,
        level3: {
          ...newHierarchyInfoList.level3,
          folderList: selectedNewHierarchyInfo?.level2?._id
            ? selectedLevel2Folder[0]?.child?.map((folderInfo) => {
                if (folderInfo.level === 3) {
                  let tempFolderInfo = {
                    name: folderInfo.name,
                    _id: folderInfo?._id ? folderInfo?._id : "",
                    pid: folderInfo?.pid ? folderInfo?.pid : "",
                    isNew: false,
                  };
                  return tempFolderInfo;
                } else return null;
              })
            : [],
        },
      });
    }
    //eslint-disable-next-line
  }, [isHierarchyModalVisible, selectedNewHierarchyInfo]);

  useEffect(() => {
    if (
      isHierarchyModalVisible &&
      selectedNewHierarchyInfo?.level3?.name &&
      selectedNewHierarchyInfo?.level3?._id
    ) {
      let selectedLevel1Folder = [];
      selectedLevel1Folder = folderHierarchy?.folders?.filter(
        (folderInfo) =>
          folderInfo?._id === selectedNewHierarchyInfo?.level1?._id
      );
      let selectedLevel2Folder = [];
      selectedLevel2Folder = selectedLevel1Folder[0]?.child?.filter(
        (folderInfo) =>
          folderInfo?._id === selectedNewHierarchyInfo?.level2?._id
      );
      let selectedLevel3Folder = selectedLevel2Folder[0]?.child?.filter(
        (folderInfo) =>
          folderInfo?._id === selectedNewHierarchyInfo?.level3?._id
      );

      setNewHierarchyInfoList({
        ...newHierarchyInfoList,
        level4: {
          ...newHierarchyInfoList.level4,
          folderList: selectedNewHierarchyInfo?.level3?._id
            ? selectedLevel3Folder[0]?.child?.map((folderInfo) => {
                if (folderInfo.level === 4) {
                  let tempFolderInfo = {
                    name: folderInfo.name,
                    _id: folderInfo?._id ? folderInfo?._id : "",
                    pid: folderInfo?.pid ? folderInfo?.pid : "",
                    isNew: false,
                  };
                  return tempFolderInfo;
                } else return null;
              })
            : [],
        },
      });
    }
    //eslint-disable-next-line
  }, [isHierarchyModalVisible, selectedNewHierarchyInfo]);

  useEffect(() => {
    dispatch(getLabellingSettingStart(signedInDetail?.user?.token));
    //eslint-disable-next-line
  }, [
    selectedFolderId,
    saveLabellingSettingStatus.isLoading,
    deleteLabellingSettingStatus.isLoading,
  ]);

  useEffect(() => {
    if (newHierarchyInfoList?.level1?.folderList?.length) {
      let filteredNewList = newHierarchyInfoList?.level1?.folderList?.filter(
        (newFolderData) => newFolderData?.isNew
      );
      if (filteredNewList?.length) {
        if (filteredNewList?.length === 1) {
          setSelectedNewHierarchyInfo({
            ...selectedNewHierarchyInfo,
            level1: {
              ...selectedNewHierarchyInfo.level1,
              name: filteredNewList[0]?.name,
              _id: "",
            },
          });
        } else {
          setSelectedNewHierarchyInfo({
            ...selectedNewHierarchyInfo,
            level1: {
              ...selectedNewHierarchyInfo.level1,
              name: filteredNewList[filteredNewList?.length - 1]?.name,
              _id: "",
            },
          });
        }
      }
    }
    //eslint-disable-next-line
  }, [newHierarchyInfoList?.level1?.folderList?.length]);

  useEffect(() => {
    if (newHierarchyInfoList?.level2?.folderList?.length) {
      let filteredNewList = newHierarchyInfoList?.level2?.folderList?.filter(
        (newFolderData) => newFolderData?.isNew
      );
      if (filteredNewList?.length) {
        if (filteredNewList?.length === 1) {
          setSelectedNewHierarchyInfo({
            ...selectedNewHierarchyInfo,
            level2: {
              ...selectedNewHierarchyInfo.level2,
              name: filteredNewList[0]?.name,
              _id: "",
            },
          });
        } else {
          setSelectedNewHierarchyInfo({
            ...selectedNewHierarchyInfo,
            level2: {
              ...selectedNewHierarchyInfo.level2,
              name: filteredNewList[filteredNewList?.length - 1]?.name,
              _id: "",
            },
          });
        }
      }
    }
    //eslint-disable-next-line
  }, [newHierarchyInfoList?.level2?.folderList?.length]);

  useEffect(() => {
    if (newHierarchyInfoList?.level3?.folderList?.length) {
      let filteredNewList = newHierarchyInfoList?.level3?.folderList?.filter(
        (newFolderData) => newFolderData?.isNew
      );
      if (filteredNewList?.length) {
        if (filteredNewList?.length === 1) {
          setSelectedNewHierarchyInfo({
            ...selectedNewHierarchyInfo,
            level3: {
              ...selectedNewHierarchyInfo.level3,
              name: filteredNewList[0]?.name,
              _id: "",
            },
          });
        } else {
          setSelectedNewHierarchyInfo({
            ...selectedNewHierarchyInfo,
            level3: {
              ...selectedNewHierarchyInfo.level3,
              name: filteredNewList[filteredNewList?.length - 1]?.name,
              _id: "",
            },
          });
        }
      }
    }
    //eslint-disable-next-line
  }, [newHierarchyInfoList?.level3?.folderList?.length]);

  useEffect(() => {
    if (newHierarchyInfoList?.level4?.folderList?.length) {
      let filteredNewList = newHierarchyInfoList?.level4?.folderList?.filter(
        (newFolderData) => newFolderData?.isNew
      );
      if (filteredNewList?.length) {
        if (filteredNewList?.length === 1) {
          setSelectedNewHierarchyInfo({
            ...selectedNewHierarchyInfo,
            level4: {
              ...selectedNewHierarchyInfo.level4,
              name: filteredNewList[0]?.name,
              _id: "",
            },
          });
        } else {
          setSelectedNewHierarchyInfo({
            ...selectedNewHierarchyInfo,
            level4: {
              ...selectedNewHierarchyInfo.level4,
              name: filteredNewList[filteredNewList?.length - 1]?.name,
              _id: "",
            },
          });
        }
      }
    }
    //eslint-disable-next-line
  }, [newHierarchyInfoList?.level4?.folderList?.length]);
  //#endregion

  return (
    <div>
      <div
        className="ml-3 overflow-y-auto overflow-x-auto"
        style={{ maxHeight: "58vh" }}
      >
        <Tree
          showLine
          defaultExpandedKeys={[selectedFolderId]}
          defaultSelectedKeys={[selectedFolderId]}
          // defaultCheckedKeys={["0-0-0", "0-0-1"]}
          onRightClick={(e) => handleTreeNodeRightClick(e)}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={getTreeData(folderHierarchy)}
          disabled={
            isLabelModeOn
              ? true
              : isDeleteModeOn
              ? true
              : isExportModeOn
              ? true
              : false
          }
        />
      </div>

      <Divider>
        <Popover content="Add Hierarchical Folder">
          <Button
            shape="circle"
            icon={<AppstoreAddOutlined />}
            onClick={handleAddHierarchy}
            disabled={
              isLabelModeOn
                ? true
                : isDeleteModeOn
                ? true
                : isExportModeOn
                ? true
                : false
            }
          />
        </Popover>

        <Modal
          title="Add Index"
          visible={isHierarchyModalVisible}
          onOk={handleConfirmHierarchyModal}
          onCancel={handleCancelHierarchyModal}
        >
          <div className="w-full -ml-6">
            <div className="flex justify-center items-center">
              <p className="m-2 w-28 font-semibold flex justify-end items-center">
                Product
              </p>
              <Select
                style={{ width: "200px" }}
                placeholder="Enter Product"
                value={selectedNewHierarchyInfo.level1.name}
                onChange={(value, info) => {
                  setSelectedNewHierarchyInfo({
                    ...selectedNewHierarchyInfo,
                    level1: {
                      ...selectedNewHierarchyInfo.level1,
                      name: value,
                      _id: info?.key ? info?.key : "",
                    },
                  });
                }}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <div className="flex px-2 pt-2">
                      <Input
                        className="flex-auto"
                        value={newHierarchyInfoList?.level1?.inputName}
                        style={{ marginRight: "5px", height: "30px" }}
                        onChange={(e) =>
                          setNewHierarchyInfoList({
                            ...newHierarchyInfoList,
                            level1: {
                              ...newHierarchyInfoList.level1,
                              inputName: e.target.value,
                            },
                          })
                        }
                      />
                      <p
                        className="cursor-pointer block flex-none pt-1 text-blue-400"
                        onClick={() => onAddFolderItemClick("level1")}
                      >
                        <PlusOutlined /> Add item
                      </p>
                    </div>
                  </div>
                )}
              >
                {newHierarchyInfoList?.level1?.folderList?.map((folderInfo) => {
                  return (
                    <Option key={folderInfo?._id} value={folderInfo?.name}>
                      {folderInfo?.name}
                    </Option>
                  );
                })}
              </Select>
            </div>

            <div className="flex justify-center items-center">
              <p className="m-2 w-28 font-semibold flex justify-end items-center">
                Factory
              </p>
              <Select
                style={{ width: "200px" }}
                disabled={selectedNewHierarchyInfo?.level1?.name ? false : true}
                value={selectedNewHierarchyInfo.level2.name}
                placeholder="Enter Factory"
                onChange={(value, info) => {
                  setSelectedNewHierarchyInfo({
                    ...selectedNewHierarchyInfo,
                    level2: {
                      ...selectedNewHierarchyInfo.level2,
                      name: value,
                      _id: info?.key ? info?.key : "",
                    },
                  });
                }}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <div className="flex px-2 pt-2">
                      <Input
                        className="flex-auto"
                        value={newHierarchyInfoList?.level2?.inputName}
                        style={{ marginRight: "5px", height: "30px" }}
                        onChange={(e) =>
                          setNewHierarchyInfoList({
                            ...newHierarchyInfoList,
                            level2: {
                              ...newHierarchyInfoList.level2,
                              inputName: e.target.value,
                            },
                          })
                        }
                      />
                      <p
                        className="cursor-pointer block flex-none pt-1 text-blue-400"
                        onClick={() => onAddFolderItemClick("level2")}
                      >
                        <PlusOutlined /> Add item
                      </p>
                    </div>
                  </div>
                )}
              >
                {newHierarchyInfoList?.level2?.folderList?.map((folderInfo) => {
                  return (
                    <Option key={folderInfo?._id} value={folderInfo?.name}>
                      {folderInfo?.name}
                    </Option>
                  );
                })}
              </Select>
            </div>

            <div className="flex justify-center items-center">
              <p className="m-2 w-28 font-semibold flex justify-end items-center">
                Production Line
              </p>
              <Select
                style={{ width: "200px" }}
                disabled={selectedNewHierarchyInfo?.level2?.name ? false : true}
                value={selectedNewHierarchyInfo.level3.name}
                placeholder="Enter Factory"
                onChange={(value, info) => {
                  setSelectedNewHierarchyInfo({
                    ...selectedNewHierarchyInfo,
                    level3: {
                      ...selectedNewHierarchyInfo.level3,
                      name: value,
                      _id: info?.key ? info?.key : "",
                    },
                  });
                }}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <div className="flex px-2 pt-2">
                      <Input
                        className="flex-auto"
                        value={newHierarchyInfoList?.level3?.inputName}
                        style={{ marginRight: "5px", height: "30px" }}
                        onChange={(e) =>
                          setNewHierarchyInfoList({
                            ...newHierarchyInfoList,
                            level3: {
                              ...newHierarchyInfoList.level3,
                              inputName: e.target.value,
                            },
                          })
                        }
                      />
                      <p
                        className="cursor-pointer block flex-none pt-1 text-blue-400"
                        onClick={() => onAddFolderItemClick("level3")}
                      >
                        <PlusOutlined /> Add item
                      </p>
                    </div>
                  </div>
                )}
              >
                {newHierarchyInfoList?.level3?.folderList?.map((folderInfo) => {
                  return (
                    <Option key={folderInfo?._id} value={folderInfo?.name}>
                      {folderInfo?.name}
                    </Option>
                  );
                })}
              </Select>
            </div>

            <div className="flex justify-center items-center">
              <p className="m-2 w-28 font-semibold flex justify-end items-center">
                M. Station
              </p>
              <Select
                style={{ width: "200px" }}
                disabled={selectedNewHierarchyInfo?.level3?.name ? false : true}
                value={selectedNewHierarchyInfo.level4.name}
                placeholder="Enter Factory"
                onChange={(value, info) => {
                  setSelectedNewHierarchyInfo({
                    ...selectedNewHierarchyInfo,
                    level4: {
                      ...selectedNewHierarchyInfo.level4,
                      name: value,
                      _id: info?.key ? info?.key : "",
                    },
                  });
                }}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <div className="flex px-2 pt-2">
                      <Input
                        className="flex-auto"
                        value={newHierarchyInfoList?.level4?.inputName}
                        style={{ marginRight: "5px", height: "30px" }}
                        onChange={(e) =>
                          setNewHierarchyInfoList({
                            ...newHierarchyInfoList,
                            level4: {
                              ...newHierarchyInfoList.level4,
                              inputName: e.target.value,
                            },
                          })
                        }
                      />
                      <p
                        className="cursor-pointer block flex-none pt-1 text-blue-400"
                        onClick={() => onAddFolderItemClick("level4")}
                      >
                        <PlusOutlined /> Add item
                      </p>
                    </div>
                  </div>
                )}
              >
                {newHierarchyInfoList?.level4?.folderList?.map((folderInfo) => {
                  return (
                    <Option key={folderInfo?._id} value={folderInfo?.name}>
                      {folderInfo?.name}
                    </Option>
                  );
                })}
              </Select>
            </div>

            <div className="flex justify-center items-center">
              <p className="m-2 w-28 font-semibold flex justify-end items-center">
                Date
              </p>

              <DatePicker
                style={{ width: "200px" }}
                disabled={selectedNewHierarchyInfo?.level4?.name ? false : true}
                placeholder="Enter a Date"
                // value={newHierarchyInfo.level5.name}
                allowClear
                onChange={(date, dateString) => {
                  setSelectedNewHierarchyInfo({
                    ...selectedNewHierarchyInfo,
                    level5: {
                      ...selectedNewHierarchyInfo.level5,
                      name: dateString,
                    },
                  });
                }}
              />
            </div>
          </div>
        </Modal>
      </Divider>
    </div>
  );
}

export default TreeBrowser;
