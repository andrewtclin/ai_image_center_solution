import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Badge,
  Button,
  Divider,
  Image,
  Menu,
  PageHeader,
  Popover,
  Tag,
} from "antd";
import {
  ClearOutlined,
  FileImageOutlined,
  LeftOutlined,
  RightOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";
import {
  selectFileLabellingStatus,
  selectGlobalState,
} from "../../../redux/modules/fileSystem/fileSystem-selectors";
import { selectSelectedLabelSetting } from "../../../redux/modules/label/label-selectors";
import { saveLabelDataStart } from "../../../redux/modules/label/label-actions";

function ClassLabel({ settingDetail, userToken, dbLabelledDataArray }) {
  //#region //* ------ Configuration & States ------ *//
  const dispatch = useDispatch();
  const maxImageIndex = settingDetail.source.length - 1;
  const selectedClassImagesInLabel = useSelector(selectGlobalState)
    .classImagesInLabel;
  const isFileLabelledArray = useSelector(selectFileLabellingStatus)
    ?.labelArray;
  const selectedLabelSetting = useSelector(selectSelectedLabelSetting);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaveClicked, setIsSaveClicked] = useState(false);

  // const [labelledImage, setLabelledImage] = useState(
  //   selectedClassImagesInLabel.reduce((acc, item, idx) => {
  //     let tempObject = { ...acc };
  //     tempObject[idx] = isFileLabelledArray[idx].classification_cls;
  //     return tempObject;
  //   }, {})
  // );
  const [labelledImage, setLabelledImage] = useState(
    selectedClassImagesInLabel.reduce((acc, item, idx) => {
      let tempObject = { ...acc };
      tempObject[idx] = dbLabelledDataArray[idx]?.label_regions[0]?.cls;
      return tempObject;
    }, {})
  );
  const [labelDataFinal, setLabelDataFinal] = useState(
    selectedClassImagesInLabel
  );
  //#endregion

  //#region //* ------ Functions ------ *//
  const handlePrevImageClick = () => {
    let currentIndex = currentImageIndex;
    if (currentIndex <= maxImageIndex && currentIndex > 0) {
      currentIndex -= 1;
      setCurrentImageIndex(currentIndex);
    }
  };

  const handleNextImageClick = () => {
    let currentIndex = currentImageIndex;
    if (currentIndex < maxImageIndex) {
      currentIndex += 1;
      setCurrentImageIndex(currentIndex);
    }
  };

  const handleCategoryClick = (value) => {
    let classLabelledData = { ...labelledImage };
    classLabelledData[currentImageIndex] = value;
    setLabelledImage(classLabelledData);
    setIsSaveClicked(false);
    let currentIndex = currentImageIndex;
    if (currentIndex < maxImageIndex) {
      currentIndex += 1;
      setCurrentImageIndex(currentIndex);
    }
  };

  const handleClearClick = () => {
    let classLabelledData = { ...labelledImage };
    classLabelledData[currentImageIndex] = "";
    setLabelledImage(classLabelledData);
    setIsSaveClicked(false);
  };

  const handleSaveClick = () => {
    let tempLabelDataFinal = labelDataFinal;
    tempLabelDataFinal.map(function(data, idx) {
      if (!data?.regions?.length) {
        //eslint-disable-next-line
        return;
      }
      data.record_set_name = selectedLabelSetting?.recordName;
      data.record_set_id = selectedLabelSetting?._id;
      delete data["src"];

      if (!data.regions[0].cls) {
        data.regions = [];
        return data;
      } else return data;
    });
    dispatch(
      saveLabelDataStart({ label_data: tempLabelDataFinal, token: userToken })
    );
    setIsSaveClicked(true);
  };
  //#endregion

  //#region //* ------ Lifecycle ------ *//
  useEffect(() => {
    let tempLabelDataFinal = labelDataFinal;
    tempLabelDataFinal.map(function(data, idx) {
      data.regions[0].cls = isFileLabelledArray[idx].classification_cls;
      return data;
    });
    setLabelDataFinal(tempLabelDataFinal);

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    let tempLabelDataFinal = labelDataFinal;
    tempLabelDataFinal.map(function(data, idx) {
      // if (labelledImage[idx]) {
      if (data.regions?.length) {
        data.regions[0].cls = labelledImage[idx];
      } else {
        data.regions?.push({ cls: labelledImage[idx] });
      }
      return data;
      // } else return data;
    });
    setLabelDataFinal(tempLabelDataFinal);
    //eslint-disable-next-line
  }, [labelledImage]);
  //#endregion

  return (
    <div
      style={{
        border: "1px solid rgb(224, 224, 224)",
        boxShadow: "3px 1px 3px #888888",
        height: "100%",
      }}
      className="flex flex-col items-center justify-center"
    >
      <PageHeader
        className="w-full"
        style={{
          padding: "5px 20px 0px 20px",
          height: "50px",
          background: "white",
          boxShadow: "3px 1px 3px #888888",
        }}
        title="Classification"
        subTitle={settingDetail.name[currentImageIndex]}
        extra={[
          <Popover content="Previous">
            <Button
              icon={<LeftOutlined />}
              type="dashed"
              onClick={handlePrevImageClick}
              disabled={currentImageIndex === 0 ? true : false}
            />
          </Popover>,
          <Popover content="Next">
            <Button
              icon={<RightOutlined />}
              type="dashed"
              onClick={handleNextImageClick}
              disabled={currentImageIndex === maxImageIndex ? true : false}
            />
          </Popover>,
          <Badge dot={isSaveClicked ? false : true}>
            <Button icon={<SaveOutlined />} onClick={handleSaveClick}>
              Save
            </Button>
          </Badge>,
        ]}
      />
      <div className="flex-grow w-full flex justify-center items-center">
        <div
          className="flex flex-col items-center justify-center"
          style={{ flex: "0.8" }}
        >
          <p
            className="text-base font-semibold"
            style={{ color: "rgb(29, 29, 29)" }}
          >
            Click Image to Zoom and Preview
          </p>
          <Image
            style={{ objectFit: "contain", border: "1px solid lightgray" }}
            src={settingDetail.source[currentImageIndex]}
            width={500}
          />
        </div>
        <div
          style={{
            flex: "0.2",
            height: "100%",
          }}
        >
          <Menu
            style={{
              width: "100%",
              height: "100%",
              borderLeft: "1px solid lightgray",
            }}
            defaultSelectedKeys={[currentImageIndex.toString()]}
            selectedKeys={[currentImageIndex.toString()]}
            defaultOpenKeys={["selectedImages"]}
            mode="inline"
            onClick={(e) => setCurrentImageIndex(+e.key)}
          >
            <SubMenu
              key="selectedImages"
              icon={<FileImageOutlined />}
              title="Your Images"
            >
              <Menu.ItemGroup
                key="g1"
                title="Images"
                style={{ overflow: "scroll", maxHeight: "450px" }}
              >
                {settingDetail.name.map((imageName, idx) => (
                  <Menu.Item key={idx}>
                    {labelledImage[idx] ? (
                      <Tag color="processing">{labelledImage[idx]}</Tag>
                    ) : (
                      ""
                    )}
                    {imageName}
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            </SubMenu>
          </Menu>
        </div>
      </div>
      <Divider style={{ margin: "0", padding: "0" }} />
      <div className="my-2 mx-0">
        {settingDetail.categories.map((category, idx) => (
          <Button
            key={idx}
            className="my-0 mx-1"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <Button
        className="mb-1"
        danger
        shape="circle"
        icon={<ClearOutlined />}
        onClick={handleClearClick}
      />
    </div>
  );
}

export default ClassLabel;
