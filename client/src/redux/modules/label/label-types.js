const LabelActionTypes = {
  //Reset Label
  LABEL_STATE_RESET: "LABEL_STATE_RESET",

  //#region //* ------ Global State ------ *//
  SET_SELECTED_LABEL_SETTING: "SET_SELECTED_LABEL_SETTING",
  IS_UNLABELLED_SELECTED: "IS_UNLABELLED_SELECTED",
  //#endregion

  //#region //* ------ Save Label Data ------ *//
  SAVE_LABEL_DATA_START: "SAVE_LABEL_DATA_START",
  SAVE_LABEL_DATA_SUCCESS: "SAVE_LABEL_DATA_SUCCESS",
  SAVE_LABEL_DATA_FAILURE: "SAVE_LABEL_DATA_FAILURE",
  //#endregion

  //#region //* ------ Retrieve Label Data ------ *//
  RETRIEVE_LABEL_DATA_START: "RETRIEVE_LABEL_DATA_START",
  RETRIEVE_LABEL_DATA_SUCCESS: "RETRIEVE_LABEL_DATA_SUCCESS",
  RETRIEVE_LABEL_DATA_FAILURE: "RETRIEVE_LABEL_DATA_FAILURE",
  //#endregion

  //#region //* ------ Export Label Data ------ *//
  EXPORT_LABEL_DATA_START: "EXPORT_LABEL_DATA_START",
  EXPORT_LABEL_DATA_SUCCESS: "EXPORT_LABEL_DATA_SUCCESS",
  EXPORT_LABEL_DATA_FAILURE: "EXPORT_LABEL_DATA_FAILURE",
  //#endregion

  //#region //* ------ Save Labelling Setting ------ *//
  SAVE_LABELLING_SETTING_START: "SAVE_LABELLING_SETTING_START",
  SAVE_LABELLING_SETTING_SUCCESS: "SAVE_LABELLING_SETTING_SUCCESS",
  SAVE_LABELLING_SETTING_FAILURE: "SAVE_LABELLING_SETTING_FAILURE",
  //#endregion

  //#region //* ------ Get Labelling Setting ------ *//
  GET_LABELLING_SETTING_START: "GET_LABELLING_SETTING_START",
  GET_LABELLING_SETTING_SUCCESS: "GET_LABELLING_SETTING_SUCCESS",
  GET_LABELLING_SETTING_FAILURE: "GET_LABELLING_SETTING_FAILURE",
  //#endregion

  //#region //* ------ Delete Labelling Setting ------ *//
  DELETE_LABELLING_SETTING_START: "DELETE_LABELLING_SETTING_START",
  DELETE_LABELLING_SETTING_SUCCESS: "DELETE_LABELLING_SETTING_SUCCESS",
  DELETE_LABELLING_SETTING_FAILURE: "DELETE_LABELLING_SETTING_FAILURE",
  //#endregion

  //#region //* ------ Duplicate Label ------ *//
  DUPLICATE_LABEL_START: "DUPLICATE_LABEL_START",
  DUPLICATE_LABEL_SUCCESS: "DUPLICATE_LABEL_SUCCESS",
  DUPLICATE_LABEL_FAILURE: "DUPLICATE_LABEL_FAILURE",
  //#endregion
};

export default LabelActionTypes;
