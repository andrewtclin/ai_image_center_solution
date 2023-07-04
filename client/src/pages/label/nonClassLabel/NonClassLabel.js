import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import "./NonClassLabel.css";

import ReactImageAnnotate from "react-image-annotate";

import ClassLabel from "../classLabel/ClassLabel";

import logo from "../../../assets/logo/smasoftlogo.png";
import { Button, Input, Radio } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";

import Swal from "sweetalert2";
import { selectSignedIn } from "../../../redux/modules/credentials/credentials-selectors";
import {
  selectDeleteLabellingSetting,
  selectGetLabellingSetting,
  selectRetrieveLabelData,
  selectSelectedLabelSetting,
} from "../../../redux/modules/label/label-selectors";
import { selectGlobalState } from "../../../redux/modules/fileSystem/fileSystem-selectors";
import {
  getLabellingSettingStart,
  retrieveLabelDataStart,
  saveLabelDataStart,
  saveLabellingSettingStart,
} from "../../../redux/modules/label/label-actions";

function NonClassLabel() {
  //#region //* ------ Configuration ------ *//
  const dispatch = useDispatch();
  const history = useHistory();
  const hideImageSource = true;
  //#endregion

  //#region //* ------ Selectors ------ *//
  const signedInDetail = useSelector(selectSignedIn);
  const dbLabelledDataArray = useSelector(selectRetrieveLabelData)?.labelData;
  const selectedImagesInLabel = useSelector(selectGlobalState).imagesInLabel;

  const loadedLabellingSettings = useSelector(selectGetLabellingSetting)
    ?.labellingSetting;
  const deletingLabellingSettingStatus = useSelector(
    selectDeleteLabellingSetting
  );
  const selectedLabelSetting = useSelector(selectSelectedLabelSetting);
  //#endregion

  //#region //* ------ State ------ *//
  const [isFinishedSetting, setIsFinishedSetting] = useState(false);
  const [
    selectedOldLabellingSettings,
    setSelectedOldLabellingSettings,
  ] = useState("");

  const [settingDetail, setSettingDetail] = useState({
    recordName: selectedLabelSetting?.recordName,
    name: selectedImagesInLabel?.fileName,
    source: selectedImagesInLabel?.imageUrl,
    categories: selectedLabelSetting?.types,
  });
  const [selectedAlType, setSelectedAlType] = useState(
    selectedLabelSetting?.alType
  );
  const [addedCategory, setAddedCategory] = useState("");
  //#endregion

  //#region //* ------ Functions ------ *//

  const handleCategoryAdd = () => {
    if (addedCategory) {
      setSettingDetail({
        ...settingDetail,
        categories: [...settingDetail.categories, addedCategory],
      });
    }
    setAddedCategory("");
  };

  const handleCategoryRemove = (e, category) => {
    let replicatedCategoryArray = [...settingDetail.categories];
    if (replicatedCategoryArray.includes(category)) {
      replicatedCategoryArray = replicatedCategoryArray.filter(
        (currentCategory) => currentCategory !== category
      );
      setSettingDetail({
        ...settingDetail,
        categories: replicatedCategoryArray,
      });
    }
  };

  const handleLabelOnSave = (defaultOutputLabelFormat) => {
    if (selectedAlType === "classification") {
      Swal.fire({
        input: "text",
        title: "Type of classification",
        showConfirmButton: true,
        confirmButtonText: "Save",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          let formattedLabelData = defaultOutputLabelFormat?.map(
            (data, idx) => {
              delete data["src"];
              return Object.assign(data, {
                file_id: selectedImagesInLabel.fileId[idx],
                file_name: selectedImagesInLabel.fileName[idx],
                folder_id: selectedImagesInLabel.folderId,
                al_type: "classification",
                label_settings: {},
                regions: [{ cls: result.value }],
                record_set_name: selectedLabelSetting?.recordName,
              });
            }
          );
          dispatch(
            saveLabelDataStart({
              label_data: formattedLabelData,
              token: signedInDetail?.user?.token,
            })
          );
        }
      });
    } else {
      let isClsNotLabelled = false;
      let formattedLabelData = defaultOutputLabelFormat?.map((data, idx) => {
        data?.regions?.forEach((label_region) => {
          if (!("cls" in label_region)) {
            isClsNotLabelled = true;
            return;
          }
        });
        delete data["src"];
        return Object.assign(data, {
          file_id: selectedImagesInLabel.fileId[idx],
          file_name: selectedImagesInLabel.fileName[idx],
          folder_id: selectedImagesInLabel.folderId,
          al_type: selectedLabelSetting.alType,
          label_settings: {
            types: settingDetail.categories,
          },
          record_set_name: selectedLabelSetting?.recordName,
        });
      });
      if (!isClsNotLabelled) {
        dispatch(
          saveLabelDataStart({
            label_data: formattedLabelData,
            token: signedInDetail?.user?.token,
          })
        );
      } else {
        Swal.fire("Warning", "Found unlabelled class(es)!", "warning");
        return;
      }
    }

    // setIsLabelModeOn(false);
  };

  const onProceedClick = () => {
    dispatch(
      saveLabellingSettingStart({
        token: signedInDetail?.user?.token,
        record_data: {
          record_name: selectedLabelSetting?.recordName,
          al_type: selectedLabelSetting?.alType,
          types: settingDetail.categories,
          _id: selectedLabelSetting?._id,
        },
      })
    );
    setIsFinishedSetting(true);
  };

  const handleAlTypeSelect = (e) => {
    setSelectedAlType(e.target.value);
  };

  //#endregion

  useEffect(() => {
    dispatch(
      retrieveLabelDataStart({
        token: signedInDetail?.user?.token,
        file_id: selectedImagesInLabel?.fileId?.map((id) => id),
        folder_id: selectedImagesInLabel?.folderId,
        record_set_name: selectedLabelSetting?.recordName,
      })
    );

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      selectedOldLabellingSettings &&
      selectedOldLabellingSettings !== "Load settings"
    ) {
      let selectedRecordIndex = loadedLabellingSettings?.filter(
        (each_record) =>
          each_record.record_name === selectedOldLabellingSettings
      );
      setSettingDetail({
        ...settingDetail,
        recordName: selectedRecordIndex[0].record_name,
        categories: selectedRecordIndex[0].types,
      });
      setSelectedAlType(selectedRecordIndex[0].al_type);
    }

    //eslint-disable-next-line
  }, [selectedOldLabellingSettings]);

  useEffect(() => {
    dispatch(getLabellingSettingStart(signedInDetail?.user?.token));
    setSelectedOldLabellingSettings("Load settings");
    //eslint-disable-next-line
  }, [deletingLabellingSettingStatus?.isLoading]);

  return (
    <div>
      {isFinishedSetting ? (
        <div style={{ height: "85vh" }}>
          {selectedAlType === "classification" ? (
            <ClassLabel
              settingDetail={settingDetail}
              selectedImages={selectedImagesInLabel}
              userToken={signedInDetail?.user?.token}
              dbLabelledDataArray={dbLabelledDataArray}
            />
          ) : (
            <ReactImageAnnotate
              labelImages
              enabledTools={
                selectedAlType === "classification"
                  ? ["select"]
                  : selectedAlType === "detection"
                  ? ["select", "create-box"]
                  : selectedAlType === "segmentation"
                  ? ["select", "create-polygon"]
                  : []
              }
              regionClsList={settingDetail.categories}
              images={settingDetail?.source?.map(function(source, idx) {
                return {
                  src: source,
                  name: settingDetail.name[idx],
                  regions:
                    dbLabelledDataArray[idx]?.al_type === "classification"
                      ? []
                      : dbLabelledDataArray[idx]?.label_regions,
                };
              })}
              onExit={(output) => {
                handleLabelOnSave(JSON.parse(JSON.stringify(output.images)));
              }}
            />
          )}
        </div>
      ) : (
        <div
          style={{
            width: "70%",
            position: "relative",
            left: "15%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Link to="/start">
            <img src={logo} alt="" className="object-contain mt-12 mb-5 w-48" />
          </Link>

          <div className="mb-6 mt-6">
            <Radio.Group
              value={selectedAlType}
              onChange={handleAlTypeSelect}
              // disabled
            >
              <Radio.Button value="classification">Classification</Radio.Button>
              <Radio.Button value="detection">Detection</Radio.Button>
              <Radio.Button value="segmentation">Segmentation</Radio.Button>
            </Radio.Group>
          </div>
          {selectedAlType === "classification" ? (
            <div className="label__settingsForm">
              <Input
                disabled
                value={settingDetail.recordName}
                addonBefore="Record Name"
                onChange={(e) =>
                  setSettingDetail({
                    ...settingDetail,
                    recordName: e.target.value,
                  })
                }
              />
              {hideImageSource ? (
                ""
              ) : (
                <Input
                  defaultValue={settingDetail.source}
                  disabled={
                    selectedImagesInLabel?.imageUrl && settingDetail.source
                      ? true
                      : false
                  }
                  addonBefore="Image(s) Source"
                  onChange={(e) =>
                    setSettingDetail({
                      ...settingDetail,
                      source: e.target.value,
                    })
                  }
                />
              )}

              <Input
                value={addedCategory}
                addonBefore="Types"
                onChange={(e) => setAddedCategory(e.target.value)}
                onPressEnter={handleCategoryAdd}
                suffix={
                  <Button type="ghost" size="small" onClick={handleCategoryAdd}>
                    +
                  </Button>
                }
              />
              <div className="-mt-5 ml-2 flex items-center ">
                <p className="font-semibold text-sm mr-2">Added Types:</p>
                {settingDetail?.categories?.map((category, idx) => (
                  <div className="flex items-center mr-4" key={idx}>
                    <p className="mr-1">{category}</p>
                    <MinusCircleOutlined
                      style={{ fontSize: "10px", paddingBottom: "12px" }}
                      onClick={(e) => handleCategoryRemove(e, category)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="label__settingsForm">
              <Input
                disabled
                value={settingDetail.recordName}
                addonBefore="Record Name"
                onChange={(e) =>
                  setSettingDetail({
                    ...settingDetail,
                    recordName: e.target.value,
                  })
                }
              />
              {hideImageSource ? (
                ""
              ) : (
                <Input
                  defaultValue={settingDetail.source}
                  disabled={
                    selectedImagesInLabel?.imageUrl && settingDetail.source
                      ? true
                      : false
                  }
                  addonBefore="Image(s) Source"
                  onChange={(e) =>
                    setSettingDetail({
                      ...settingDetail,
                      source: e.target.value,
                    })
                  }
                />
              )}

              <Input
                value={addedCategory}
                addonBefore="Types"
                onChange={(e) => setAddedCategory(e.target.value)}
                onPressEnter={handleCategoryAdd}
                suffix={
                  <Button type="ghost" size="small" onClick={handleCategoryAdd}>
                    +
                  </Button>
                }
              />
              <div className="-mt-5 ml-2 flex items-center ">
                <p className="font-semibold text-sm mr-2">Added Types:</p>
                {settingDetail?.categories?.map((category, idx) => (
                  <div className="flex items-center mr-4 -mt-2" key={idx}>
                    <p className="pt-2 mr-1">{category}</p>
                    <MinusCircleOutlined
                      style={{ fontSize: "10px", paddingBottom: "5px" }}
                      onClick={(e) => handleCategoryRemove(e, category)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            style={{ marginTop: "50px" }}
            type="primary"
            disabled={
              settingDetail.name &&
              settingDetail.source &&
              settingDetail?.categories?.length
                ? false
                : true
            }
            onClick={onProceedClick}
          >
            Proceed
          </Button>
        </div>
      )}
      {isFinishedSetting ? (
        <div className="w-full flex justify-center -mb-2 mt-4">
          <Button
            variant="contained"
            type="primary"
            className="label__exitButton"
            onClick={() => {
              Swal.fire({
                title: "Exit Label Mode",
                text:
                  "Any unsaved work will be lost. Please ensure all works are saved!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Exit",
              }).then((result) => {
                if (result.isConfirmed) {
                  history.goBack();
                }
              });
            }}
          >
            Exit
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default NonClassLabel;
