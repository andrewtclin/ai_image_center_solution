import LabelActionTypes from "./label-types";

const INITIAL_STATE = {
  isUnlabelledSelected: false,

  selectedLabelSetting: {
    alType: "",
    recordName: "",
    types: [],
    _id: "",
  },

  saveLabelData: {
    isLoading: false,
    response: null,
    error: null,
  },

  retrieveLabelData: {
    isLoading: false,
    labelData: null,
    error: null,
  },

  exportLabelData: {
    isLoading: false,
    response: null,
    error: null,
  },

  saveLabellingSetting: {
    isLoading: false,
    response: null,
    error: null,
  },

  getLabellingSetting: {
    isLoading: false,
    labellingSetting: null,
    error: null,
  },

  deleteLabellingSetting: {
    isLoading: false,
    response: null,
    error: null,
  },

  duplicateLabel: {
    isLoading: false,
    response: null,
    error: null,
  },
};

const labelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LabelActionTypes.LABEL_STATE_RESET:
      return INITIAL_STATE;

    //#region ------ Global State ------
    case LabelActionTypes.SET_SELECTED_LABEL_SETTING:
      return {
        ...state,
        selectedLabelSetting: action.payload,
      };

    case LabelActionTypes.IS_UNLABELLED_SELECTED:
      return {
        ...state,
        isUnlabelledSelected: action.payload,
      };
    //#endregion

    //#region ------ Save Label Data ------
    case LabelActionTypes.SAVE_LABEL_DATA_START:
      return {
        ...state,
        saveLabelData: {
          ...state.saveLabelData,
          isLoading: true,
        },
      };

    case LabelActionTypes.SAVE_LABEL_DATA_SUCCESS:
      return {
        ...state,
        saveLabelData: {
          ...state.saveLabelData,
          isLoading: false,
          response: action.payload,
          error: null,
        },
      };

    case LabelActionTypes.SAVE_LABEL_DATA_FAILURE:
      return {
        ...state,
        saveLabelData: {
          ...state.saveLabelData,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region ------ Retrieve Label Data ------
    case LabelActionTypes.RETRIEVE_LABEL_DATA_START:
      return {
        ...state,
        retrieveLabelData: {
          ...state.retrieveLabelData,
          isLoading: true,
        },
      };

    case LabelActionTypes.RETRIEVE_LABEL_DATA_SUCCESS:
      return {
        ...state,
        retrieveLabelData: {
          ...state.retrieveLabelData,
          isLoading: false,
          labelData: action.payload,
          error: null,
        },
      };

    case LabelActionTypes.RETRIEVE_LABEL_DATA_FAILURE:
      return {
        ...state,
        retrieveLabelData: {
          ...state.retrieveLabelData,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region ------ Export Data ------
    case LabelActionTypes.EXPORT_LABEL_DATA_START:
      return {
        ...state,
        exportLabelData: {
          ...state.exportLabelData,
          isLoading: true,
        },
      };

    case LabelActionTypes.EXPORT_LABEL_DATA_SUCCESS:
      return {
        ...state,
        exportLabelData: {
          ...state.exportLabelData,
          isLoading: false,
          response: action.payload,
          error: null,
        },
      };

    case LabelActionTypes.EXPORT_LABEL_DATA_FAILURE:
      return {
        ...state,
        exportLabelData: {
          ...state.exportLabelData,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Save Labelling Setting ------ *//
    case LabelActionTypes.SAVE_LABELLING_SETTING_START:
      return {
        ...state,
        saveLabellingSetting: {
          ...state.saveLabellingSetting,
          isLoading: true,
        },
      };

    case LabelActionTypes.SAVE_LABELLING_SETTING_SUCCESS:
      return {
        ...state,
        saveLabellingSetting: {
          ...state.saveLabellingSetting,
          isLoading: false,
          response: action.payload,
          error: null,
        },
      };

    case LabelActionTypes.SAVE_LABELLING_SETTING_FAILURE:
      return {
        ...state,
        saveLabellingSetting: {
          ...state.saveLabellingSetting,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Get Label Record ------ *//
    case LabelActionTypes.GET_LABELLING_SETTING_START:
      return {
        ...state,
        getLabellingSetting: {
          ...state.getLabellingSetting,
          isLoading: true,
        },
      };

    case LabelActionTypes.GET_LABELLING_SETTING_SUCCESS:
      return {
        ...state,
        getLabellingSetting: {
          ...state.getLabellingSetting,
          isLoading: false,
          labellingSetting: action.payload,
          error: null,
        },
      };

    case LabelActionTypes.GET_LABELLING_SETTING_FAILURE:
      return {
        ...state,
        getLabellingSetting: {
          ...state.getLabellingSetting,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Delete Label Record ------ *//
    case LabelActionTypes.DELETE_LABELLING_SETTING_START:
      return {
        ...state,
        deleteLabellingSetting: {
          ...state.deleteLabellingSetting,
          isLoading: true,
        },
      };

    case LabelActionTypes.DELETE_LABELLING_SETTING_SUCCESS:
      return {
        ...state,
        deleteLabellingSetting: {
          ...state.deleteLabellingSetting,
          isLoading: false,
          response: action.payload,
          error: null,
        },
      };

    case LabelActionTypes.DELETE_LABELLING_SETTING_FAILURE:
      return {
        ...state,
        deleteLabellingSetting: {
          ...state.deleteLabellingSetting,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Duplicate Label ------ *//
    case LabelActionTypes.DUPLICATE_LABEL_START:
      return {
        ...state,
        duplicateLabel: {
          ...state.duplicateLabel,
          isLoading: true,
        },
      };

    case LabelActionTypes.DUPLICATE_LABEL_SUCCESS:
      return {
        ...state,
        duplicateLabel: {
          ...state.duplicateLabel,
          isLoading: false,
          response: action.payload,
          error: null,
        },
      };

    case LabelActionTypes.DUPLICATE_LABEL_FAILURE:
      return {
        ...state,
        duplicateLabel: {
          ...state.duplicateLabel,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    default:
      return state;
  }
};

export default labelReducer;
