export const getTreeData = (folderHierarchy) => {
  if (folderHierarchy?.folders?.length) {
    let organizedHierarchy = folderHierarchy?.folders?.map((level1Folder) => {
      let level2Detail = level1Folder?.child?.map((level2Folder) => {
        level2Folder["title"] = level2Folder.name;
        level2Folder["key"] = level2Folder._id;
        return level2Folder;
      });
      let level3Detail = level2Detail
        ?.map((level2Folder) => {
          let level3Folder = level2Folder?.child?.map((level3Folder) => {
            level3Folder["title"] = level3Folder.name;
            level3Folder["key"] = level3Folder._id;
            return level3Folder;
          });
          return level3Folder;
        })
        .flat();
      let level4Detail = level3Detail
        ?.map((level3Folder) => {
          let level4Folder = level3Folder?.child?.map((level4Folder) => {
            level4Folder["title"] = level4Folder.name;
            level4Folder["key"] = level4Folder._id;
            return level4Folder;
          });
          return level4Folder;
        })
        .flat();
      let level5Detail = level4Detail
        ?.map((level4Folder) => {
          let level5Folder = level4Folder?.child?.map((level5Folder) => {
            level5Folder["title"] = level5Folder.name;
            level5Folder["key"] = level5Folder._id;
            return level5Folder;
          });
          return level5Folder;
        })
        .flat();
      level4Detail = level4Detail?.map((eachLevel4Detail) => {
        let tempEachLevel4Detail = {
          ...eachLevel4Detail,
          children: level5Detail.filter(
            (eachLevel5Detail) => eachLevel5Detail.pid === eachLevel4Detail._id
          ),
        };
        return tempEachLevel4Detail;
      });
      level3Detail = level3Detail?.map((eachLevel3Detail) => {
        let tempEachLevel3Detail = {
          ...eachLevel3Detail,
          children: level4Detail.filter(
            (eachLevel4Detail) => eachLevel4Detail.pid === eachLevel3Detail._id
          ),
        };
        return tempEachLevel3Detail;
      });
      level2Detail = level2Detail?.map((eachLevel2Detail) => {
        let tempEachLevel2Detail = {
          ...eachLevel2Detail,
          children: level3Detail.filter(
            (eachLevel3Detail) => eachLevel3Detail.pid === eachLevel2Detail._id
          ),
        };
        return tempEachLevel2Detail;
      });

      let folderHierarchy = {
        title: level1Folder.name,
        key: level1Folder._id,
        children: level2Detail.filter(
          (eachLevel2Detail) => eachLevel2Detail.pid === level1Folder._id
        ),
      };
      return folderHierarchy;
    });
    return organizedHierarchy;
  } else return [];
};

export const handleFileSelection = (selectedFileInfo, selectedFiles) => {
  selectedFileInfo = {
    ...selectedFileInfo,
    file_id: selectedFileInfo.fileId,
    folder_id: selectedFileInfo.folderId,
  };
  delete selectedFileInfo["fileId"];
  delete selectedFileInfo["folderId"];
  let replicatedSelectedFiles = [...selectedFiles];

  if (
    replicatedSelectedFiles.find(
      (file) => file["file_id"] === selectedFileInfo.file_id
    )
  ) {
    replicatedSelectedFiles = replicatedSelectedFiles.filter(
      (eachFileInfo) => eachFileInfo.file_id !== selectedFileInfo.file_id
    );
    replicatedSelectedFiles = replicatedSelectedFiles.map(function(
      eachFileInfo
    ) {
      return { ...eachFileInfo };
    });
    return replicatedSelectedFiles;
  } else {
    replicatedSelectedFiles.push(selectedFileInfo);
    replicatedSelectedFiles = replicatedSelectedFiles.map(function(
      eachFileInfo
    ) {
      return { ...eachFileInfo };
    });
    return replicatedSelectedFiles;
  }
};

export const parseSelectedImagesToLabelling = (selectedImages) => {
  let replicatedSelectedImages = [...selectedImages];
  let imagesInLabellingFormat = {
    fileId: [],
    fileName: [],
    imageUrl: [],
    folderId: selectedImages[0]?.folder_id,
  };
  replicatedSelectedImages?.forEach((eachSelectedImage) => {
    imagesInLabellingFormat.fileId.push(eachSelectedImage?.file_id);
    imagesInLabellingFormat.fileName.push(eachSelectedImage?.name);
    imagesInLabellingFormat.imageUrl.push(eachSelectedImage?.url);
  });
  return imagesInLabellingFormat;
};

export const checkboxSelection = (checkboxStatusState, alType, isChecked) => {
  if (alType === "class_labelled") {
    let replicateCheckboxStatus = { ...checkboxStatusState };
    replicateCheckboxStatus = {
      ...replicateCheckboxStatus,
      classification: {
        ...replicateCheckboxStatus.classification,
        labelled_checked: isChecked,
      },
    };
    return replicateCheckboxStatus;
  } else if (alType === "class_unlabelled") {
    let replicateCheckboxStatus = { ...checkboxStatusState };
    replicateCheckboxStatus = {
      ...replicateCheckboxStatus,
      classification: {
        ...replicateCheckboxStatus.classification,
        unlabelled_checked: isChecked,
      },
    };
    return replicateCheckboxStatus;
  } else if (alType === "detection_labelled") {
    let replicateCheckboxStatus = { ...checkboxStatusState };
    replicateCheckboxStatus = {
      ...replicateCheckboxStatus,
      detection: {
        ...replicateCheckboxStatus.detection,
        labelled_checked: isChecked,
      },
    };
    return replicateCheckboxStatus;
  } else if (alType === "detection_unlabelled") {
    let replicateCheckboxStatus = { ...checkboxStatusState };
    replicateCheckboxStatus = {
      ...replicateCheckboxStatus,
      detection: {
        ...replicateCheckboxStatus.detection,
        unlabelled_checked: isChecked,
      },
    };
    return replicateCheckboxStatus;
  } else if (alType === "segmentation_labelled") {
    let replicateCheckboxStatus = { ...checkboxStatusState };
    replicateCheckboxStatus = {
      ...replicateCheckboxStatus,
      segmentation: {
        ...replicateCheckboxStatus.segmentation,
        labelled_checked: isChecked,
      },
    };
    return replicateCheckboxStatus;
  } else if (alType === "segmentation_unlabelled") {
    let replicateCheckboxStatus = { ...checkboxStatusState };
    replicateCheckboxStatus = {
      ...replicateCheckboxStatus,
      segmentation: {
        ...replicateCheckboxStatus.segmentation,
        unlabelled_checked: isChecked,
      },
    };
    return replicateCheckboxStatus;
  }
};

export const imageBrowserFiltering = (
  originalImages,
  selectedSetName,
  isUnlabelledSelected
) => {
  let tempLoadedFiles = [...originalImages];
  if (selectedSetName && selectedSetName !== "all") {
    tempLoadedFiles = tempLoadedFiles?.filter((file) => {
      let isLabelExist = false;
      for (let i = 0; i < Object.keys(file?.label_sets)?.length; i++) {
        if (Object.keys(file?.label_sets)[i] === selectedSetName) {
          isLabelExist = true;
        }
      }
      if (isLabelExist) {
        return true;
      } else return false;
    });
  }
  if (isUnlabelledSelected) {
    tempLoadedFiles = tempLoadedFiles?.filter((file) => {
      let isLabelExist = false;
      for (let i = 0; i < Object.keys(file?.label_sets)?.length; i++) {
        if (Object.keys(file?.label_sets)[i] === selectedSetName) {
          isLabelExist = true;
        }
      }
      if (isLabelExist) {
        return false;
      } else return true;
    });
  }

  return tempLoadedFiles;
};

export const imageBrowserSearchImage = (originalImages, inputValue) => {
  let tempLoadedFiles = [...originalImages];

  tempLoadedFiles = tempLoadedFiles?.filter((file) =>
    file?.name?.split(".")[0].includes(inputValue)
  );

  return tempLoadedFiles;
};
