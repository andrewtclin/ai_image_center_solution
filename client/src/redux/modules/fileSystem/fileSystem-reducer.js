import FileSystemActionTypes from "./fileSystem-types";

const INITIAL_STATE = {
  globalState: {
    selectedFolderId: null,
    isLabelModeOn: false,
    isDeleteModeOn: false,
    isExportModeOn: false,
    selectedImages: [],
    imagesInLabel: null,
    classImagesInLabel: null,

    checkboxStatus: {
      classification: { labelled_checked: false, unlabelled_checked: false },
      detection: { labelled_checked: false, unlabelled_checked: false },
      segmentation: { labelled_checked: false, unlabelled_checked: false },
    },
    isFileUploading: false,
  },

  memory: {
    isLoading: false,
    memory: 0,
    error: null,
  },

  folderHierarchy: {
    folders: [],
    isLoading: false,
    error: null,
  },

  createFolderHierarchy: {
    isLoading: false,
    response: null,
    error: null,
  },

  homepage: {
    id: null,
    isLoading: false,
    error: null,
  },

  currentPage: {
    content: {
      info: null,
      foldersInCurrentPage: [],
    },
    isLoading: false,
    error: null,
  },

  createFolders: {
    createdFolders: [],
    isLoading: false,
    error: null,
  },

  loadFiles: {
    loadedFiles: [],
    isLoading: false,
    error: null,
  },

  loadFilesV1: {
    loadedFiles: [],
    isLoading: false,
    error: null,
  },

  fileLabellingStatus: {
    labelArray: [],
    isLoading: false,
    error: null,
  },

  uploadFiles: {
    response: null,
    isLoading: false,
    error: null,
  },

  downloadFiles: {
    response: null,
    isLoading: false,
    error: null,
  },

  downloadFolders: {
    response: null,
    isLoading: false,
    error: null,
  },

  deleteFiles: {
    response: null,
    isLoading: false,
    error: null,
  },

  deleteFolders: {
    response: null,
    isLoading: false,
    error: null,
  },
};

const fileSystemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* ------ File Manager Reset ------ */
    case FileSystemActionTypes.FILE_SYSTEM_RESET:
      return INITIAL_STATE;

    //#region //* ------ Global State ------ *//
    case FileSystemActionTypes.SET_SELECTED_FOLDER:
      return {
        ...state,
        globalState: {
          ...state.globalState,
          selectedFolderId: action.payload,
        },
      };

    case FileSystemActionTypes.SET_IS_LABEL_MODE:
      return {
        ...state,
        globalState: {
          ...state.globalState,
          isLabelModeOn: action.payload,
        },
      };

    case FileSystemActionTypes.SET_IS_DELETE_MODE:
      return {
        ...state,
        globalState: {
          ...state.globalState,
          isDeleteModeOn: action.payload,
        },
      };

    case FileSystemActionTypes.SET_IS_EXPORT_MODE:
      return {
        ...state,
        globalState: {
          ...state.globalState,
          isExportModeOn: action.payload,
        },
      };

    case FileSystemActionTypes.SET_SELECTED_IMAGES:
      return {
        ...state,
        globalState: {
          ...state.globalState,
          selectedImages: action.payload,
        },
      };

    case FileSystemActionTypes.SET_IMAGES_IN_LABEL:
      return {
        ...state,
        globalState: {
          ...state.globalState,
          imagesInLabel: action.payload,
        },
      };

    case FileSystemActionTypes.SET_CLASS_IMAGES_IN_LABEL:
      return {
        ...state,
        globalState: {
          ...state.globalState,
          classImagesInLabel: action.payload,
        },
      };

    case FileSystemActionTypes.SET_CHECKBOX_STATUS:
      return {
        ...state,
        globalState: {
          ...state.globalState,
          checkboxStatus: action.payload,
        },
      };

    case FileSystemActionTypes.SET_IS_FILE_UPLOADING:
      return {
        ...state,
        globalState: {
          ...state.globalState,
          isFileUploading: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Get file memory ------ *//
    case FileSystemActionTypes.GET_FILE_MEMORY_START:
      return {
        ...state,
        memory: {
          ...state.memory,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.GET_FILE_MEMORY_SUCCESS:
      return {
        ...state,
        memory: {
          ...state.memory,
          isLoading: false,
          memory: action.payload,
          error: null,
        },
      };

    case FileSystemActionTypes.GET_FILE_MEMORY_FAILURE:
      return {
        ...state,
        memory: {
          ...state.memory,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Folder Hierarchy ------ *//
    case FileSystemActionTypes.GET_FOLDER_HIERARCHY_START:
      return {
        ...state,
        folderHierarchy: {
          ...state.folderHierarchy,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.GET_FOLDER_HIERARCHY_SUCCESS:
      return {
        ...state,
        folderHierarchy: {
          ...state.folderHierarchy,
          folders: action.payload,
          isLoading: false,
          error: null,
        },
      };

    case FileSystemActionTypes.GET_FOLDER_HIERARCHY_FAILURE:
      return {
        ...state,
        folderHierarchy: {
          ...state.folderHierarchy,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Create Folder Hierarchy ------ *//
    case FileSystemActionTypes.CREATE_FOLDER_HIERARCHY_START:
      return {
        ...state,
        createFolderHierarchy: {
          ...state.createFolderHierarchy,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.CREATE_FOLDER_HIERARCHY_SUCCESS:
      return {
        ...state,
        createFolderHierarchy: {
          ...state.createFolderHierarchy,
          isLoading: false,
          response: action.payload,
          error: null,
        },
      };

    case FileSystemActionTypes.CREATE_FOLDER_HIERARCHY_FAILURE:
      return {
        ...state,
        createFolderHierarchy: {
          ...state.createFolderHierarchy,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Homepage ID ------ *//
    case FileSystemActionTypes.GET_HOMEPAGE_ID_START:
      return {
        ...state,
        homepage: {
          ...state.homepage,
          isLoading: true,
        },
      };
    case FileSystemActionTypes.GET_HOMEPAGE_ID_SUCCESS:
      return {
        ...state,
        homepage: {
          ...state.homepage,
          id: action.payload,
          isLoading: false,
          error: null,
        },
      };
    case FileSystemActionTypes.GET_HOMEPAGE_ID_FAILURE:
      return {
        ...state,
        homepage: {
          ...state.homepage,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Current Page Info ------ *//
    case FileSystemActionTypes.GET_CURRENT_PAGE_INFO_START:
      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          isLoading: true,
        },
      };
    case FileSystemActionTypes.GET_CURRENT_PAGE_INFO_SUCCESS:
      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          content: {
            info: action.payload.pageDetail,
            foldersInCurrentPage: action.payload.pageFolders,
          },
          isLoading: false,
          error: null,
        },
      };
    case FileSystemActionTypes.GET_CURRENT_PAGE_INFO_FAILURE:
      return {
        ...state,
        currentPage: {
          ...state.currentPage,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Create Folder ------ *//
    case FileSystemActionTypes.CREATE_FOLDER_START:
      return {
        ...state,
        createFolders: {
          ...state.createFolders,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.CREATE_FOLDER_SUCCESS:
      return {
        ...state,
        createFolders: {
          ...state.createFolders,
          createdFolders: action.payload,
          isLoading: false,
          error: null,
        },
      };

    case FileSystemActionTypes.CREATE_FOLDER_FAILURE:
      return {
        ...state,
        createFolders: {
          ...state.createFolders,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Load Files ------ *//
    case FileSystemActionTypes.GET_FILES_START:
      return {
        ...state,
        loadFiles: {
          ...state.loadFiles,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.GET_FILES_SUCCESS:
      return {
        ...state,
        loadFiles: {
          ...state.loadFiles,
          loadedFiles: action.payload,
          isLoading: false,
          error: null,
        },
      };

    case FileSystemActionTypes.GET_FILES_FAILURE:
      return {
        ...state,
        loadFiles: {
          ...state.loadFiles,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Load Files V1 ------ *//
    case FileSystemActionTypes.LOAD_FILES_V1_START:
      return {
        ...state,
        loadFilesV1: {
          ...state.loadFilesV1,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.LOAD_FILES_V1_SUCCESS:
      return {
        ...state,
        loadFilesV1: {
          ...state.loadFilesV1,
          loadedFiles: action.payload,
          isLoading: false,
          error: null,
        },
      };

    case FileSystemActionTypes.LOAD_FILES_V1_FAILURE:
      return {
        ...state,
        loadFilesV1: {
          ...state.loadFilesV1,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Check is file labelled ------ *//
    case FileSystemActionTypes.CHECK_IS_FILE_LABELLED_START:
      return {
        ...state,
        fileLabellingStatus: {
          ...state.fileLabellingStatus,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.CHECK_IS_FILE_LABELLED_SUCCESS:
      return {
        ...state,
        fileLabellingStatus: {
          ...state.fileLabellingStatus,
          labelArray: action.payload,
          isLoading: false,
          error: null,
        },
      };

    case FileSystemActionTypes.CHECK_IS_FILE_LABELLED_FAILURE:
      return {
        ...state,
        fileLabellingStatus: {
          ...state.fileLabellingStatus,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Upload Files ------ *//
    case FileSystemActionTypes.UPLOAD_FILES_START:
      return {
        ...state,
        uploadFiles: {
          ...state.uploadFiles,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.UPLOAD_FILES_SUCCESS:
      return {
        ...state,
        uploadFiles: {
          ...state.uploadFiles,
          response: action.payload,
          isLoading: false,
          error: null,
        },
      };

    case FileSystemActionTypes.UPLOAD_FILES_FAILURE:
      return {
        ...state,
        uploadFiles: {
          ...state.uploadFiles,
          isLoading: false,
          error: action.payload,
        },
      };

    //#endregion

    //#region //* ------ Download Files & Folders ------ *//
    case FileSystemActionTypes.DOWNLOAD_FILES_START:
      return {
        ...state,
        downloadFiles: {
          ...state.downloadFiles,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.DOWNLOAD_FILES_SUCCESS:
      return {
        ...state,
        downloadFiles: {
          ...state.downloadFiles,
          response: action.payload,
          isLoading: false,
          error: null,
        },
      };

    case FileSystemActionTypes.DOWNLOAD_FILES_FAILURE:
      return {
        ...state,
        downloadFiles: {
          ...state.downloadFiles,
          isLoading: false,
          error: action.payload,
        },
      };

    case FileSystemActionTypes.DOWNLOAD_FOLDERS_START:
      return {
        ...state,
        downloadFolders: {
          ...state.downloadFolders,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.DOWNLOAD_FOLDERS_SUCCESS:
      return {
        ...state,
        downloadFolders: {
          ...state.downloadFolders,
          response: action.payload,
          isLoading: false,
          error: null,
        },
      };

    case FileSystemActionTypes.DOWNLOAD_FOLDERS_FAILURE:
      return {
        ...state,
        downloadFolders: {
          ...state.downloadFolders,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Delete Files & Folders ------ *//
    case FileSystemActionTypes.DELETE_FILES_START:
      return {
        ...state,
        deleteFiles: {
          ...state.deleteFiles,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.DELETE_FILES_SUCCESS:
      return {
        ...state,
        deleteFiles: {
          ...state.deleteFiles,
          response: action.payload,
          isLoading: false,
          error: null,
        },
      };

    case FileSystemActionTypes.DELETE_FILES_FAILURE:
      return {
        ...state,
        deleteFiles: {
          ...state.deleteFiles,
          isLoading: false,
          error: action.payload,
        },
      };

    case FileSystemActionTypes.DELETE_FOLDERS_START:
      return {
        ...state,
        deleteFolders: {
          ...state.deleteFolders,
          isLoading: true,
        },
      };

    case FileSystemActionTypes.DELETE_FOLDERS_SUCCESS:
      return {
        ...state,
        deleteFolders: {
          ...state.deleteFolders,
          response: action.payload,
          isLoading: false,
          error: null,
        },
      };

    case FileSystemActionTypes.DELETE_FOLDERS_FAILURE:
      return {
        ...state,
        deleteFolders: {
          ...state.deleteFolders,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    default:
      return state;
  }
};

export default fileSystemReducer;
