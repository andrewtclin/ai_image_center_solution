import { createSelector } from "reselect";

const selectFileSystem = (state) => state.fileSystem;

export const selectGlobalState = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.globalState
);

export const selectFileMemory = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.memory
);

export const selectHomepage = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.homepage
);

export const selectCurrentPage = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.currentPage
);

export const selectCreateFolders = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.createFolders
);

export const selectLoadFiles = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.loadFiles
);

export const selectLoadFilesV1 = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.loadFilesV1
);

export const selectFileLabellingStatus = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.fileLabellingStatus
);

export const selectUploadFiles = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.uploadFiles
);

export const selectDownloadFiles = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.downloadFiles
);

export const selectDownloadFolders = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.downloadFolders
);

export const selectDeleteFiles = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.deleteFiles
);

export const selectDeleteFolders = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.deleteFolders
);

export const selectFolderHierarchy = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.folderHierarchy
);

export const selectCreateFolderHierarchy = createSelector(
  [selectFileSystem],
  (fileSystem) => fileSystem.createFolderHierarchy
);
