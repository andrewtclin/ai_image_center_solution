import { takeLatest, put, all, call } from "redux-saga/effects";
import {
  axiosLabel,
  trainer_host,
  trainer_port,
} from "../../../api/axios/axios";

import LabelActionTypes from "./label-types";

import {
  saveLabelDataSuccess,
  saveLabelDataFailure,
  retrieveLabelDataSuccess,
  retrieveLabelDataFailure,
  exportLabelDataSuccess,
  exportLabelDataFailure,
  saveLabellingSettingSuccess,
  saveLabellingSettingFailure,
  getLabellingSettingSuccess,
  getLabellingSettingFailure,
  deleteLabellingSettingSuccess,
  deleteLabellingSettingFailure,
  duplicateLabelSuccess,
  duplicateLabelFailure,
} from "./label-actions";

import Swal from "sweetalert2";

//#region //* ------ AXIOS ------ *//
const saveLabelDataApi = async ({ label_data, token }) => {
  const response = await axiosLabel({
    method: "post",
    url: "/save_data",
    headers: {
      Authorization: token,
    },
    data: label_data,
  });
  return response.data.result;
};

const retrieveLabelDataApi = async ({
  file_id,
  folder_id,
  token,
  record_set_name,
}) => {
  const response = await axiosLabel({
    method: "post",
    url: "/retrieve_data",
    headers: {
      Authorization: token,
    },
    data: {
      file_id: file_id,
      folder_id: folder_id,
      record_set_name: record_set_name,
    },
  });
  return response.data.result;
};

const exportLabelDataApi = async ({
  userToken,
  fileIdArray,
  folderId,
  record_set_name,
}) => {
  const response = await axiosLabel({
    method: "post",
    url: "/export_trainer",
    headers: {
      Authorization: userToken,
    },
    data: { fileIds: fileIdArray, folderId: folderId, record_set_name },
  });
  return response.data.result;
};

const saveLabellingSettingApi = async ({ token, record_data }) => {
  const response = await axiosLabel({
    method: "post",
    url: "/save_label_record",
    headers: {
      Authorization: token,
    },
    data: record_data,
  });
  return response.data.result;
};

const getLabellingSettingApi = async ({ token }) => {
  const response = await axiosLabel({
    method: "get",
    url: "/get_label_record",
    headers: {
      Authorization: token,
    },
  });
  return response.data.result;
};

const deleteLabellingSettingApi = async ({ token, record_name }) => {
  const response = await axiosLabel({
    method: "delete",
    url: `/record_name/${record_name}`,
    headers: {
      Authorization: token,
    },
  });
  return response.data.result;
};

const duplicateLabelApi = async ({ record_name, new_record_name }) => {
  const response = await axiosLabel({
    method: "post",
    url: "/duplicate",
    data: {
      record_name: record_name,
      new_record_name: new_record_name,
    },
  });
  return response.data.result;
};
//#endregion

//#region //* ------ WATCHERS ------ *//
function* saveLabelDataStart() {
  yield takeLatest(LabelActionTypes.SAVE_LABEL_DATA_START, saveLabelData);
}

function* retrieveLabelDataStart() {
  yield takeLatest(
    LabelActionTypes.RETRIEVE_LABEL_DATA_START,
    retrieveLabelData
  );
}

function* exportLabelDataStart() {
  yield takeLatest(LabelActionTypes.EXPORT_LABEL_DATA_START, exportLabelData);
}

function* saveLabellingSettingStart() {
  yield takeLatest(
    LabelActionTypes.SAVE_LABELLING_SETTING_START,
    saveLabellingSetting
  );
}

function* getLabellingSettingStart() {
  yield takeLatest(
    LabelActionTypes.GET_LABELLING_SETTING_START,
    getLabellingSetting
  );
}

function* deleteLabellingSettingStart() {
  yield takeLatest(
    LabelActionTypes.DELETE_LABELLING_SETTING_START,
    deleteLabellingSetting
  );
}

function* duplicateLabelStart() {
  yield takeLatest(LabelActionTypes.DUPLICATE_LABEL_START, duplicateLabel);
}
//#endregion

//#region //* ------ WORKERS ------ *//
//Save Label Data
function* saveLabelData({ payload: { token, label_data } }) {
  try {
    const response = yield call(saveLabelDataApi, { token, label_data });
    yield put(saveLabelDataSuccess(response));
    Swal.fire({
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1000,
    });
  } catch (error) {
    yield put(saveLabelDataFailure(error));
    Swal.fire({
      icon: "error",
      title: "Error saving data",
      showConfirmButton: false,
      timer: 1000,
    });
  }
}

function* retrieveLabelData({
  payload: { file_id, folder_id, token, record_set_name },
}) {
  try {
    const response = yield call(retrieveLabelDataApi, {
      file_id,
      folder_id,
      token,
      record_set_name,
    });
    yield put(retrieveLabelDataSuccess(response));
  } catch (error) {
    yield put(retrieveLabelDataFailure(error));
  }
}

function* exportLabelData({
  payload: { userToken, fileIdArray, folderId, is_export, record_set_name },
}) {
  try {
    if (is_export) {
      yield Swal.fire({
        text: "Exporting...",
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 1000,
      });
    }
    const response = yield call(exportLabelDataApi, {
      userToken,
      fileIdArray,
      folderId,
      record_set_name,
    });
    yield put(exportLabelDataSuccess(response));

    if (response === "OK") {
      yield Swal.fire({
        title: `Success`,
        text: "Your data is exported successfully.",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Proceed",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.assign(
            `http://${trainer_host}:${trainer_port}/training/upload-files`
          );
        }
      });
    } else if (response === "NIL") {
      yield Swal.fire("Exported Failed", "Please label all images.", "error");
    }
  } catch (error) {
    yield put(exportLabelDataFailure(error));
    yield Swal.fire("Error", "Unexpected error has occurred.", "error");
  }
}

function* saveLabellingSetting({ payload: request }) {
  try {
    const { token, record_data } = request;
    yield call(saveLabellingSettingApi, { token, record_data });
    yield put(saveLabellingSettingSuccess());
  } catch (error) {
    yield put(saveLabellingSettingFailure(error));
  }
}

function* getLabellingSetting({ payload: token }) {
  try {
    const response = yield call(getLabellingSettingApi, {
      token,
    });
    yield put(getLabellingSettingSuccess(response));
  } catch (error) {
    yield put(getLabellingSettingFailure(error));
  }
}

function* deleteLabellingSetting({ payload: { token, record_name } }) {
  try {
    yield call(deleteLabellingSettingApi, { token, record_name });
    yield put(deleteLabellingSettingSuccess());
    yield Swal.fire(
      "Success",
      `${record_name} is deleted successfully.`,
      "success"
    );
  } catch (error) {
    yield put(deleteLabellingSettingFailure(error));
    yield Swal.fire("Error", `Error deleting ${record_name}.`, "error");
  }
}

function* duplicateLabel({ payload: { record_name, new_record_name } }) {
  try {
    const response = yield call(duplicateLabelApi, {
      record_name,
      new_record_name,
    });
    yield put(duplicateLabelSuccess(response));
  } catch (error) {
    yield put(duplicateLabelFailure(error));
    yield Swal.fire("Error", `Error duplicating label.`, "error");
  }
}
//#endregion

/* ------ Sagas Collaboration ------ */
export function* labelSaga() {
  yield all([
    call(saveLabelDataStart),
    call(retrieveLabelDataStart),
    call(exportLabelDataStart),
    call(saveLabellingSettingStart),
    call(getLabellingSettingStart),
    call(deleteLabellingSettingStart),
    call(duplicateLabelStart),
  ]);
}
