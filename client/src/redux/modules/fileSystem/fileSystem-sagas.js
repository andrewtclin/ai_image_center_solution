import { takeLatest, put, all, call } from "redux-saga/effects";
import {
  axiosFileManager,
  axiosLabel,
  host,
  port,
} from "../../../api/axios/axios";

import FileSystemActionTypes from "./fileSystem-types";

import {
  createFolderHierarchySuccess,
  createFolderHierarchyFailure,
  getFolderHierarchySuccess,
  getFolderHierarchyFailure,
  getHomepageIdSuccess,
  getHomepageIdFailure,
  getCurrentPageSuccess,
  getCurrentPageFailure,
  createFolderSuccess,
  createFolderFailure,
  getFilesSuccess,
  getFilesFailure,
  checkIsFileLabelledSuccess,
  checkIsFileLabelledFailure,
  uploadFilesSuccess,
  uploadFilesFailure,
  downloadFilesSuccess,
  downloadFilesFailure,
  downloadFoldersSuccess,
  downloadFoldersFailure,
  deleteFilesSuccess,
  deleteFilesFailure,
  deleteFoldersSuccess,
  deleteFoldersFailure,
  getFileMemoryFailure,
  getFileMemorySuccess,
  loadFilesV1Success,
  loadFilesV1Failure,
} from "./fileSystem-actions";

import Swal from "sweetalert2";

//#region ------ APIs ------
const getFileMemoryApi = async () => {
  const response = await axiosFileManager({
    method: "get",
    url: "/memory",
  });
  return response.data.result;
};

const getFolderHierarchyApi = async (userToken) => {
  const response = await axiosFileManager({
    method: "get",
    url: "/hierarchy_folder",
    headers: {
      Authorization: userToken,
    },
  });
  return response.data.result;
};

const createFolderHierarchyApi = async ({ userToken, hierarchyInfo }) => {
  const response = await axiosFileManager({
    method: "post",
    url: "/hierarchy_folder",
    headers: {
      Authorization: userToken,
    },
    data: hierarchyInfo,
  });
  return response.data.result;
};

const getHomepageIdApi = async (userToken) => {
  const response = await axiosFileManager({
    method: "get",
    url: "/home_folder_id",
    headers: {
      Authorization: userToken,
    },
  });

  return response.data.result;
};

const currentPageDetailApi = async ({ userToken, currentPageId }) => {
  const response = await axiosFileManager({
    method: "get",
    url: `/folder/${currentPageId}`,
    headers: {
      Authorization: userToken,
    },
  });

  return response.data.result;
};

const currentPageFoldersApi = async ({ userToken, currentPageId }) => {
  const response = await axiosFileManager({
    method: "get",
    url: `/folder/${currentPageId}/content_folders`,
    headers: {
      Authorization: userToken,
    },
  });
  return response.data.result;
};

const createFoldersApi = async ({
  folderName,
  customer,
  category,
  tags,
  creator,
  memo,
  token,
  parentId,
}) => {
  const response = await axiosFileManager({
    method: "post",
    url: "/folder",
    headers: {
      Authorization: token,
    },
    data: {
      name: folderName,
      endCustomer: customer,
      productType: category,
      tags: tags,
      uploader: creator,
      comments: memo,
      parentId: parentId,
    },
  });

  return response.data.result;
};

const loadFilesApi = async ({ userToken, folderId, page = 1, size = -1 }) => {
  const response = await axiosFileManager({
    method: "get",
    url: `/hierarchy_folder/${folderId}/content_files?page=${page}&size=${size}`,
    headers: {
      Authorization: userToken,
    },
  });
  return response.data.result;
};

const loadFilesV1Api = async ({ userToken, folderId, page = 1, size = -1 }) => {
  const response = await axiosFileManager({
    method: "get",
    url: `/hierarchy_folder/${folderId}/content_files/v1?page=${page}&size=${size}`,
    headers: {
      Authorization: userToken,
    },
  });
  return response.data.result;
};

const checkIsFileLabelledApi = async ({ userToken, fileArray }) => {
  const response = await axiosLabel({
    method: "post",
    url: "/check_if_labelled",
    headers: {
      Authorization: userToken,
    },
    data: fileArray,
  });
  return response.data.result;
};

const loadFilesDisplayUrlApi = async ({ userToken, folderId }) => {
  const response = await axiosFileManager({
    method: "get",
    url: `/hierarchy_folder/${folderId}/content_uri_path`,
    headers: {
      Authorization: userToken,
    },
  });
  return response.data.result;
};

const uploadFilesApi = async ({
  userToken,
  pid,
  fileArray,
  record_set_name,
  al_type,
  classification_label,
}) => {
  var bodyFormData = new FormData();
  fileArray.map((file) => bodyFormData.append("files", file));
  bodyFormData.append("record_set_name", record_set_name);
  bodyFormData.append("al_type", al_type);
  bodyFormData.append("classification_label", classification_label);

  const response = await axiosFileManager({
    method: "post",
    url: `/folder_hierarchy/${pid}/files`,
    headers: {
      Authorization: userToken,
    },
    data: bodyFormData,
  });
  return response;
};

const downloadFilesZip = async (data, folderId, is_export) => {
  try {
    const blob = new Blob([data], { type: "application/zip" });
    const link = document.createElement("a");
    if (is_export) {
      link.href = URL.createObjectURL(blob);
      const label = "imgfa-sampling";
      link.download = label;
      link.click();
      URL.revokeObjectURL(link.href);
    } else {
      link.href = URL.createObjectURL(blob);
      const label = "imgfa-sampling";
      link.download = label;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  } catch (error) {
    console.error(error);
  }
};

const downloadFilesApi = async ({
  userToken,
  folderId,
  fileIdArray,
  is_export,
  record_set_name,
}) => {
  const response = await axiosFileManager({
    method: "post",
    url: `/folder/${folderId}/download_files_zip`,
    responseType: "blob",
    headers: {
      Authorization: userToken,
    },
    data: {
      fileIds: fileIdArray,
      is_export: is_export,
      record_set_name: record_set_name,
    },
  });
  await downloadFilesZip(response.data, folderId, is_export);
};

const downloadFoldersApi = async ({ userToken, currentPageId, folderIds }) => {
  const response = await axiosFileManager({
    method: "post",
    url: `/folder/${currentPageId}/download_folders_zip`,
    responseType: "blob",
    headers: {
      Authorization: userToken,
    },
    data: {
      folderIds: folderIds,
    },
  });

  await downloadFilesZip(response.data, currentPageId);
};

const deleteFilesApi = async ({ userToken, currentPageId, fileIdArray }) => {
  const response = await axiosFileManager({
    method: "delete",
    url: `/hierarchy_folder/${currentPageId}/delete_files`,
    headers: {
      Authorization: userToken,
    },
    data: {
      fileIds: fileIdArray,
    },
  });

  return response;
};

const deleteFoldersApi = async ({ token, folder_id }) => {
  const response = await axiosFileManager({
    method: "delete",
    url: `hierarchy_folder/${folder_id}`,
    headers: {
      Authorization: token,
    },
  });

  return response;
};
//#endregion

/* ------ WATCHERS ------ */
//#region //* ------ Get File Memory ------ *//
function* getFileMemoryStart() {
  yield takeLatest(FileSystemActionTypes.GET_FILE_MEMORY_START, getFileMemory);
}
//#endregion

//#region //* ------ Get Folder Hierarchy ------ *//
function* getFolderHierarchyStart() {
  yield takeLatest(
    FileSystemActionTypes.GET_FOLDER_HIERARCHY_START,
    getFolderHierarchy
  );
}
//#endregion

//#region //* ------ Create Folder Hierarchy ------ *//
function* createFolderHierarchyStart() {
  yield takeLatest(
    FileSystemActionTypes.CREATE_FOLDER_HIERARCHY_START,
    createFolderHierarchy
  );
}
//#endregion

//#region //* ------ Homepage ID ------ *//
function* getHomepageIdStart() {
  yield takeLatest(FileSystemActionTypes.GET_HOMEPAGE_ID_START, getHomepageId);
}
//#endregion

//#region //* ------ Current Page Info ------ */
function* getCurrentPageStart() {
  yield takeLatest(
    FileSystemActionTypes.GET_CURRENT_PAGE_START,
    getCurrentPage
  );
}
//#endregion

//#region //* ------ Create Folder ------ */
function* createFolderStart() {
  yield takeLatest(FileSystemActionTypes.CREATE_FOLDER_START, createFolder);
}
//#endregion

//#region //* ------ Get Files ------ *//
function* getFilesStart() {
  yield takeLatest(FileSystemActionTypes.GET_FILES_START, getFiles);
}
//#endregion

//#region //* ------ Load Files V1 ------ *//
function* loadFilesV1Start() {
  yield takeLatest(FileSystemActionTypes.LOAD_FILES_V1_START, loadFilesV1);
}
//#endregion

//#region //* ------ Check is file labelled ------ *//
function* checkIsFileLabelledStart() {
  yield takeLatest(
    FileSystemActionTypes.CHECK_IS_FILE_LABELLED_START,
    checkIsFileLabelled
  );
}
//#endregion

//#region //* ------ Upload Files ------ *//
function* uploadFileStart() {
  yield takeLatest(FileSystemActionTypes.UPLOAD_FILES_START, uploadFiles);
}

//#endregion

//#region //* ------ Download Files & Folders ------ *//
function* downloadFilesStart() {
  yield takeLatest(FileSystemActionTypes.DOWNLOAD_FILES_START, downloadFiles);
}

function* downloadFoldersStart() {
  yield takeLatest(
    FileSystemActionTypes.DOWNLOAD_FOLDERS_START,
    downloadFolders
  );
}
//#endregion

//#region //* ------ Delete Files & Folders ------ *//
function* deleteFilesStart() {
  yield takeLatest(FileSystemActionTypes.DELETE_FILES_START, deleteFiles);
}

function* deleteFoldersStart() {
  yield takeLatest(FileSystemActionTypes.DELETE_FOLDERS_START, deleteFolders);
}
//#endregion

/* ------ WORKERS ------ */
//#region //* ------ Get File Memory ------ *//
export function* getFileMemory() {
  try {
    const response = yield call(getFileMemoryApi);
    yield put(getFileMemorySuccess(response));
  } catch (error) {
    yield put(getFileMemoryFailure(error));
  }
}
//#endregion

//#region //* ------ Get Folder Hierarchy ------ *//
export function* getFolderHierarchy({ payload: userToken }) {
  try {
    const response = yield call(getFolderHierarchyApi, userToken);
    yield put(getFolderHierarchySuccess(response));
  } catch (error) {
    yield put(getFolderHierarchyFailure(error));
  }
}
//#endregion

//#region //* ------ Create Folder Hierarchy ------ *//
export function* createFolderHierarchy({
  payload: { userToken, hierarchyInfo },
}) {
  try {
    const response = yield call(createFolderHierarchyApi, {
      userToken,
      hierarchyInfo,
    });
    yield put(createFolderHierarchySuccess(response));
  } catch (error) {
    yield put(createFolderHierarchyFailure(error));
  }
}
//#endregion

//#region ------ Get Homepage ID ------
function* getHomepageId({ payload: userToken }) {
  try {
    const response = yield call(getHomepageIdApi, userToken);
    yield put(getHomepageIdSuccess(response?.id));
  } catch (error) {
    yield put(getHomepageIdFailure(error));
  }
}
//#endregion

//#region //* ------ Get Current Page Folder Process ------ *//
function* getCurrentPage({ payload: { userToken, currentPageId } }) {
  try {
    const pageDetail = yield call(currentPageDetailApi, {
      userToken,
      currentPageId,
    });
    const pageFolders = yield call(currentPageFoldersApi, {
      userToken,
      currentPageId,
    });
    let pageDetailAndFolders = {
      pageDetail: pageDetail,
      pageFolders: pageFolders,
    };
    yield put(getCurrentPageSuccess(pageDetailAndFolders));
  } catch (error) {
    yield put(getCurrentPageFailure(error));
  }
}

//#endregion

//#region //* ------ Create Folder ------ */
function* createFolder({
  payload: {
    folderName,
    customer,
    category,
    tags,
    creator,
    memo,
    token,
    parentId,
  },
}) {
  try {
    const response = yield call(createFoldersApi, {
      folderName,
      customer,
      category,
      tags,
      creator,
      memo,
      token,
      parentId,
    });
    yield put(createFolderSuccess(response));
    Swal.fire("Created", "Your folder is created successfully.", "success");
  } catch (error) {
    yield put(createFolderFailure(error.response.data));
  }
}
//#endregion

//#region //* ------ Get Files ------ *//
function* getFiles({ payload: { userToken, folderId, page, size } }) {
  try {
    const fileDetailResponse = yield call(loadFilesApi, {
      userToken,
      folderId,
      page,
      size,
    });
    const displayUrlResponse = yield call(loadFilesDisplayUrlApi, {
      userToken,
      folderId,
    });
    let displayUrlArray = [...fileDetailResponse?.files];
    displayUrlArray = displayUrlArray.map((file) =>
      Object.assign(file, {
        url: `http://${host}:${port + displayUrlResponse.uriPath}/${file.name}`,
      })
    );
    yield put(
      getFilesSuccess({
        folderId: displayUrlResponse.id,
        files: displayUrlArray,
      })
    );
  } catch (error) {
    yield put(getFilesFailure(error));
  }
}
//#endregion

//#region //* ------ Get Files ------ *//

function* loadFilesV1({ payload: { userToken, folderId, page, size } }) {
  try {
    const fileDetailResponse = yield call(loadFilesV1Api, {
      userToken,
      folderId,
      page,
      size,
    });
    const displayUrlResponse = yield call(loadFilesDisplayUrlApi, {
      userToken,
      folderId,
    });
    let displayUrlArray = yield [...fileDetailResponse?.files];

    yield (displayUrlArray = displayUrlArray.map((file) =>
      Object.assign(file, {
        url: `http://${host}:${port + displayUrlResponse.uriPath}/${file.name}`,
      })
    ));

    yield put(
      loadFilesV1Success({
        folderId: displayUrlResponse.id,
        files: displayUrlArray,
      })
    );
  } catch (error) {
    yield put(loadFilesV1Failure(error));
  }
}
//#endregion

//#region //* ------ Check is file labelled ------ *//
function* checkIsFileLabelled({ payload: { userToken, fileArray } }) {
  try {
    const response = yield call(checkIsFileLabelledApi, {
      userToken,
      fileArray,
    });
    yield put(checkIsFileLabelledSuccess(response));
  } catch (error) {
    yield put(checkIsFileLabelledFailure(error));
  }
}
//#endregion

//#region //* ------ Upload Files ------ *//
function* uploadFiles({
  payload: {
    userToken,
    pid,
    fileArray,
    record_set_name = "",
    al_type = "",
    classification_label = "",
  },
}) {
  try {
    yield call(uploadFilesApi, {
      userToken,
      pid,
      fileArray,
      record_set_name,
      al_type,
      classification_label,
    });
    yield put(uploadFilesSuccess("Success"));
    Swal.fire("Uploaded", "Your files have been uploaded.", "success");
  } catch (error) {
    yield put(uploadFilesFailure(error));
    Swal.fire("Error", "An error has occured when uploading files.", "error");
  }
}
//#endregion

//#region //* ------ Download Files ------ *//
function* downloadFiles({
  payload: {
    userToken,
    folderId,
    fileIdArray,
    is_export = true,
    record_set_name,
  },
}) {
  try {
    yield call(downloadFilesApi, {
      userToken,
      folderId,
      fileIdArray,
      is_export,
      record_set_name,
    });
    yield put(downloadFilesSuccess("Success"));
  } catch (error) {
    yield put(downloadFilesFailure(error));
  }
}

export function* downloadFolders({
  payload: { userToken, currentPageId, folderIdArray },
}) {
  try {
    yield call(downloadFoldersApi, {
      userToken,
      currentPageId,
      folderIdArray,
    });
    yield put(downloadFoldersSuccess("Success"));
  } catch (error) {
    yield put(downloadFoldersFailure(error));
  }
}
//#endregion

//#region //* ------ Delete Files ------ *//
function* deleteFiles({ payload: { userToken, currentPageId, fileIdArray } }) {
  try {
    yield call(deleteFilesApi, {
      userToken,
      currentPageId,
      fileIdArray,
    });
    yield put(deleteFilesSuccess("Success"));
    Swal.fire("Deleted", "Your file(s) have been deleted.", "success");
  } catch (error) {
    yield put(deleteFilesFailure(error));
    Swal.fire("Error", "Trouble deleting files.", "error");
  }
}

export function* deleteFolders({ payload: { token, folder_id } }) {
  try {
    yield call(deleteFoldersApi, {
      token,
      folder_id,
    });
    yield put(deleteFoldersSuccess("Success"));
    Swal.fire("Deleted", "Your folder(s) have been deleted.", "success");
  } catch (error) {
    yield put(deleteFoldersFailure(error));
    Swal.fire("Error", "Trouble deleting folder(s).", "error");
  }
}
//#endregion

/* ------ Sagas Collaboration ------ */
export function* fileSystemSaga() {
  yield all([
    call(getFileMemoryStart),
    call(createFolderHierarchyStart),
    call(getFolderHierarchyStart),
    call(getHomepageIdStart),
    call(getCurrentPageStart),
    call(createFolderStart),
    call(getFilesStart),
    call(loadFilesV1Start),
    call(checkIsFileLabelledStart),
    call(uploadFileStart),
    call(downloadFilesStart),
    call(downloadFoldersStart),
    call(deleteFilesStart),
    call(deleteFoldersStart),
  ]);
}
