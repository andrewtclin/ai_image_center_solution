import FileSystemActionTypes from "./fileSystem-types";

/* ------ File Manager State Reset ------ */
export const fileSystemReset = () => ({
  type: FileSystemActionTypes.FILE_SYSTEM_RESET,
});

//#region //* ------ Global State ------ *//
export const setSelectedFolder = (folderId) => ({
  type: FileSystemActionTypes.SET_SELECTED_FOLDER,
  payload: folderId,
});

export const setIsLabelMode = (isOn) => ({
  type: FileSystemActionTypes.SET_IS_LABEL_MODE,
  payload: isOn,
});

export const setIsDeleteMode = (isOn) => ({
  type: FileSystemActionTypes.SET_IS_DELETE_MODE,
  payload: isOn,
});

export const setIsExportMode = (isOn) => ({
  type: FileSystemActionTypes.SET_IS_EXPORT_MODE,
  payload: isOn,
});

export const setSelectedImages = (imageArray) => ({
  type: FileSystemActionTypes.SET_SELECTED_IMAGES,
  payload: imageArray,
});

export const setImagesInLabel = (imageDetail) => ({
  type: FileSystemActionTypes.SET_IMAGES_IN_LABEL,
  payload: imageDetail,
});

export const setClassImagesInLabel = (imageDetail) => ({
  type: FileSystemActionTypes.SET_CLASS_IMAGES_IN_LABEL,
  payload: imageDetail,
});

export const setCheckboxStatus = (checkboxStatus) => ({
  type: FileSystemActionTypes.SET_CHECKBOX_STATUS,
  payload: checkboxStatus,
});

export const setIsFileUploading = (status) => ({
  type: FileSystemActionTypes.SET_IS_FILE_UPLOADING,
  payload: status,
});
//#endregion

//#region //* ------ Get total file memories ------ *//
export const getFileMemoryStart = () => ({
  type: FileSystemActionTypes.GET_FILE_MEMORY_START,
});

export const getFileMemorySuccess = (memory) => ({
  type: FileSystemActionTypes.GET_FILE_MEMORY_SUCCESS,
  payload: memory,
});

export const getFileMemoryFailure = (error) => ({
  type: FileSystemActionTypes.GET_FILE_MEMORY_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Get Folder Hierarchy ------ *//
export const getFolderHierarchyStart = (userToken) => ({
  type: FileSystemActionTypes.GET_FOLDER_HIERARCHY_START,
  payload: userToken,
});

export const getFolderHierarchySuccess = (hierarchicalFolders) => ({
  type: FileSystemActionTypes.GET_FOLDER_HIERARCHY_SUCCESS,
  payload: hierarchicalFolders,
});

export const getFolderHierarchyFailure = (error) => ({
  type: FileSystemActionTypes.GET_FOLDER_HIERARCHY_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Create Folder Hierarchy ------ *//
export const createFolderHierarchyStart = (userToken_hierarchyInfo) => ({
  type: FileSystemActionTypes.CREATE_FOLDER_HIERARCHY_START,
  payload: userToken_hierarchyInfo,
});

export const createFolderHierarchySuccess = (response) => ({
  type: FileSystemActionTypes.CREATE_FOLDER_HIERARCHY_SUCCESS,
  payload: response,
});

export const createFolderHierarchyFailure = (error) => ({
  type: FileSystemActionTypes.CREATE_FOLDER_HIERARCHY_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Homepage ID ------ *//
export const getHomepageIdStart = (userToken) => ({
  type: FileSystemActionTypes.GET_HOMEPAGE_ID_START,
  payload: userToken,
});

export const getHomepageIdSuccess = (homepageId) => ({
  type: FileSystemActionTypes.GET_HOMEPAGE_ID_SUCCESS,
  payload: homepageId,
});

export const getHomepageIdFailure = (error) => ({
  type: FileSystemActionTypes.GET_HOMEPAGE_ID_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Current page info ------ *//
export const getCurrentPageStart = (pageId_userToken) => ({
  type: FileSystemActionTypes.GET_CURRENT_PAGE_START,
  payload: pageId_userToken,
});

export const getCurrentPageSuccess = (pageInfo) => ({
  type: FileSystemActionTypes.GET_CURRENT_PAGE_SUCCESS,
  payload: pageInfo,
});

export const getCurrentPageFailure = (error) => ({
  type: FileSystemActionTypes.GET_CURRENT_PAGE_SUCCESS,
  payload: error,
});
//#endregion

//#region //* ------ Create Folder ------ *//
export const createFolderStart = (folderDetail) => ({
  type: FileSystemActionTypes.CREATE_FOLDER_START,
  payload: folderDetail,
});

export const createFolderSuccess = (response) => ({
  type: FileSystemActionTypes.CREATE_FOLDER_SUCCESS,
  payload: response,
});

export const createFolderFailure = (error) => ({
  type: FileSystemActionTypes.CREATE_FOLDER_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Get Files ------ *//
export const getFilesStart = (folderId_userToken) => ({
  type: FileSystemActionTypes.GET_FILES_START,
  payload: folderId_userToken,
});

export const getFilesSuccess = (fileArray) => ({
  type: FileSystemActionTypes.GET_FILES_SUCCESS,
  payload: fileArray,
});

export const getFilesFailure = (error) => ({
  type: FileSystemActionTypes.GET_FILES_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Load Files v1 ------ *//
export const loadFilesV1Start = (folderId_userToken) => ({
  type: FileSystemActionTypes.LOAD_FILES_V1_START,
  payload: folderId_userToken,
});

export const loadFilesV1Success = (fileArray) => ({
  type: FileSystemActionTypes.LOAD_FILES_V1_SUCCESS,
  payload: fileArray,
});

export const loadFilesV1Failure = (error) => ({
  type: FileSystemActionTypes.LOAD_FILES_V1_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Check is file labelled ------ *//
export const checkIsFileLabelledStart = (userToken_fileArray) => ({
  type: FileSystemActionTypes.CHECK_IS_FILE_LABELLED_START,
  payload: userToken_fileArray,
});

export const checkIsFileLabelledSuccess = (isLabelledArray) => ({
  type: FileSystemActionTypes.CHECK_IS_FILE_LABELLED_SUCCESS,
  payload: isLabelledArray,
});

export const checkIsFileLabelledFailure = (error) => ({
  type: FileSystemActionTypes.CHECK_IS_FILE_LABELLED_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Upload Files ------ *//
export const uploadFilesStart = (userToken_pid_fileArray) => ({
  type: FileSystemActionTypes.UPLOAD_FILES_START,
  payload: userToken_pid_fileArray,
});

export const uploadFilesSuccess = (response) => ({
  type: FileSystemActionTypes.UPLOAD_FILES_SUCCESS,
  payload: response,
});

export const uploadFilesFailure = (error) => ({
  type: FileSystemActionTypes.UPLOAD_FILES_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Download Files & Folders ------ *//
export const downloadFilesStart = (fileIdArray_folderId_userToken) => ({
  type: FileSystemActionTypes.DOWNLOAD_FILES_START,
  payload: fileIdArray_folderId_userToken,
});

export const downloadFilesSuccess = (response) => ({
  type: FileSystemActionTypes.DOWNLOAD_FILES_SUCCESS,
  payload: response,
});

export const downloadFilesFailure = (error) => ({
  type: FileSystemActionTypes.DOWNLOAD_FILES_FAILURE,
  payload: error,
});

export const downloadFoldersStart = (
  folderIdArray_currentPageId_userToken
) => ({
  type: FileSystemActionTypes.DOWNLOAD_FOLDERS_START,
  payload: folderIdArray_currentPageId_userToken,
});

export const downloadFoldersSuccess = (response) => ({
  type: FileSystemActionTypes.DOWNLOAD_FOLDERS_SUCCESS,
  payload: response,
});

export const downloadFoldersFailure = (error) => ({
  type: FileSystemActionTypes.DOWNLOAD_FOLDERS_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Delete Files & Folders ------ *//
export const deleteFilesStart = (fileIdArray_folderId_token) => ({
  type: FileSystemActionTypes.DELETE_FILES_START,
  payload: fileIdArray_folderId_token,
});

export const deleteFilesSuccess = (response) => ({
  type: FileSystemActionTypes.DELETE_FILES_SUCCESS,
  payload: response,
});

export const deleteFilesFailure = (error) => ({
  type: FileSystemActionTypes.DELETE_FILES_FAILURE,
  payload: error,
});

export const deleteFoldersStart = (request) => ({
  type: FileSystemActionTypes.DELETE_FOLDERS_START,
  payload: request,
});

export const deleteFoldersSuccess = (response) => ({
  type: FileSystemActionTypes.DELETE_FOLDERS_SUCCESS,
  payload: response,
});

export const deleteFoldersFailure = (error) => ({
  type: FileSystemActionTypes.DELETE_FOLDERS_FAILURE,
  payload: error,
});
//#endregion
