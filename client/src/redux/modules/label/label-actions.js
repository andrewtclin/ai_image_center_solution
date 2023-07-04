import LabelActionTypes from "./label-types";

//#region //* ------ Label State Reset ------ *//
export const labelStateReset = () => ({
  type: LabelActionTypes.LABEL_STATE_RESET,
});
//#endregion

//#region //* ------ Set Selected Label Settings ------ *//
export const setSelectedLabelSetting = (selectedLabelSetting) => ({
  type: LabelActionTypes.SET_SELECTED_LABEL_SETTING,
  payload: selectedLabelSetting,
});

export const isUnlabelledSelected = (isSelected) => ({
  type: LabelActionTypes.IS_UNLABELLED_SELECTED,
  payload: isSelected,
});
//#endregion

//#region //* ------ Save Label Data ------ *//
export const saveLabelDataStart = (data) => ({
  type: LabelActionTypes.SAVE_LABEL_DATA_START,
  payload: data,
});

export const saveLabelDataSuccess = (response) => ({
  type: LabelActionTypes.SAVE_LABEL_DATA_SUCCESS,
  payload: response,
});

export const saveLabelDataFailure = (error) => ({
  type: LabelActionTypes.SAVE_LABEL_DATA_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Retrieve Label Data ------ *//
export const retrieveLabelDataStart = (request) => ({
  type: LabelActionTypes.RETRIEVE_LABEL_DATA_START,
  payload: request,
});

export const retrieveLabelDataSuccess = (response) => ({
  type: LabelActionTypes.RETRIEVE_LABEL_DATA_SUCCESS,
  payload: response,
});

export const retrieveLabelDataFailure = (error) => ({
  type: LabelActionTypes.RETRIEVE_LABEL_DATA_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Export Label Data ------ *//
export const exportLabelDataStart = (request) => ({
  type: LabelActionTypes.EXPORT_LABEL_DATA_START,
  payload: request,
});

export const exportLabelDataSuccess = (response) => ({
  type: LabelActionTypes.EXPORT_LABEL_DATA_SUCCESS,
  payload: response,
});

export const exportLabelDataFailure = (error) => ({
  type: LabelActionTypes.EXPORT_LABEL_DATA_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Save Labelling Setting ------ *//
export const saveLabellingSettingStart = (request) => ({
  type: LabelActionTypes.SAVE_LABELLING_SETTING_START,
  payload: request,
});

export const saveLabellingSettingSuccess = () => ({
  type: LabelActionTypes.SAVE_LABELLING_SETTING_SUCCESS,
});

export const saveLabellingSettingFailure = (error) => ({
  type: LabelActionTypes.SAVE_LABELLING_SETTING_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Get Labelling Setting ------ *//
export const getLabellingSettingStart = (token) => ({
  type: LabelActionTypes.GET_LABELLING_SETTING_START,
  payload: token,
});

export const getLabellingSettingSuccess = (labelRecordArray) => ({
  type: LabelActionTypes.GET_LABELLING_SETTING_SUCCESS,
  payload: labelRecordArray,
});

export const getLabellingSettingFailure = (error) => ({
  type: LabelActionTypes.GET_LABELLING_SETTING_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Delete Labelling Setting ------ *//
export const deleteLabellingSettingStart = (request) => ({
  type: LabelActionTypes.DELETE_LABELLING_SETTING_START,
  payload: request,
});

export const deleteLabellingSettingSuccess = () => ({
  type: LabelActionTypes.DELETE_LABELLING_SETTING_SUCCESS,
});

export const deleteLabellingSettingFailure = (error) => ({
  type: LabelActionTypes.DELETE_LABELLING_SETTING_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Duplicate Label ------ *//
export const duplicateLabelStart = (request) => ({
  type: LabelActionTypes.DUPLICATE_LABEL_START,
  payload: request,
});

export const duplicateLabelSuccess = (response) => ({
  type: LabelActionTypes.DUPLICATE_LABEL_SUCCESS,
  payload: response,
});

export const duplicateLabelFailure = (error) => ({
  type: LabelActionTypes.DUPLICATE_LABEL_FAILURE,
  payload: error,
});
//#endregion
