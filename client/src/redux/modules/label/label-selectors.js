import { createSelector } from "reselect";

const selectLabel = (state) => state.label;

export const selectSaveLabelData = createSelector(
  [selectLabel],
  (label) => label.saveLabelData
);

export const selectIsUnlabelledSelected = createSelector(
  [selectLabel],
  (label) => label.isUnlabelledSelected
);

export const selectRetrieveLabelData = createSelector(
  [selectLabel],
  (label) => label.retrieveLabelData
);

export const selectExportLabelData = createSelector(
  [selectLabel],
  (label) => label.exportLabelData
);

export const selectSaveLabellingSetting = createSelector(
  [selectLabel],
  (label) => label.saveLabellingSetting
);

export const selectGetLabellingSetting = createSelector(
  [selectLabel],
  (label) => label.getLabellingSetting
);

export const selectDeleteLabellingSetting = createSelector(
  [selectLabel],
  (label) => label.deleteLabellingSetting
);

export const selectSelectedLabelSetting = createSelector(
  [selectLabel],
  (label) => label.selectedLabelSetting
);

export const selectDuplicateLabel = createSelector(
  [selectLabel],
  (label) => label.duplicateLabel
);
