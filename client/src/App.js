import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Particles from "react-particles-js";
import { particlesOptions } from "./utils/particles-config";

import Start from "./pages/start/Start";
import Footer from "./containers/footer/Footer";
import Login from "./pages/login/Login";
import Forgot from "./pages/login/Forgot";
import Register from "./pages/login/Register";
import NonClassLabel from "./pages/label/nonClassLabel/NonClassLabel";

import Workstation from "./pages/workstation/Workstation";
import { selectSignedIn } from "./redux/modules/credentials/credentials-selectors";
import {
  selectCreateFolderHierarchy,
  selectDeleteFiles,
  selectDeleteFolders,
  selectGlobalState,
  selectLoadFiles,
  selectUploadFiles,
} from "./redux/modules/fileSystem/fileSystem-selectors";
import {
  checkIsFileLabelledStart,
  getFileMemoryStart,
  getFilesStart,
  getFolderHierarchyStart,
  getHomepageIdStart,
  loadFilesV1Start,
} from "./redux/modules/fileSystem/fileSystem-actions";
import {
  selectDeleteLabellingSetting,
  selectDuplicateLabel,
  selectSaveLabelData,
} from "./redux/modules/label/label-selectors";
import { createDefaultUserStart } from "./redux/modules/credentials/credentials-actions";

function App() {
  //#region ------ Configuration ------
  const dispatch = useDispatch();
  const signedInDetail = useSelector(selectSignedIn);
  const createFolderHierarchy = useSelector(selectCreateFolderHierarchy);
  const selectedFolderId = useSelector(selectGlobalState)?.selectedFolderId;
  const uploadFileStatus = useSelector(selectUploadFiles);
  const loadedFiles = useSelector(selectLoadFiles);
  const saveLabelDataStatus = useSelector(selectSaveLabelData);
  const deleteFileStatus = useSelector(selectDeleteFiles);
  const duplicateLabelStatus = useSelector(selectDuplicateLabel);
  const deleteLabellingSetting = useSelector(selectDeleteLabellingSetting);
  const deleteFolderStatus = useSelector(selectDeleteFolders);

  //#endregion

  //#region ------ Lifecycle ------
  useEffect(() => {
    dispatch(createDefaultUserStart());
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (signedInDetail?.user?.token) {
      dispatch(getHomepageIdStart(signedInDetail?.user?.token));
    }
    //eslint-disable-next-line
  }, [signedInDetail]);

  useEffect(() => {
    if (signedInDetail?.user?.token) {
      dispatch(getFolderHierarchyStart(signedInDetail?.user?.token));
    }
    //eslint-disable-next-line
  }, [signedInDetail, createFolderHierarchy, deleteFolderStatus?.isLoading]);

  useEffect(() => {
    if (signedInDetail?.user?.token && selectedFolderId) {
      dispatch(
        getFilesStart({
          userToken: signedInDetail?.user?.token,
          folderId: selectedFolderId,
        })
      );
    }
    //eslint-disable-next-line
  }, [
    selectedFolderId,
    uploadFileStatus?.isLoading,
    saveLabelDataStatus?.isLoading,
    deleteFileStatus?.isLoading,
    duplicateLabelStatus?.isLoading,
  ]);

  useEffect(() => {
    if (signedInDetail?.user?.token && selectedFolderId) {
      dispatch(
        loadFilesV1Start({
          userToken: signedInDetail?.user?.token,
          folderId: selectedFolderId,
        })
      );
    }
    //eslint-disable-next-line
  }, [
    selectedFolderId,
    uploadFileStatus?.isLoading,
    saveLabelDataStatus?.isLoading,
    deleteFileStatus?.isLoading,
    duplicateLabelStatus?.isLoading,
    deleteLabellingSetting?.isLoading,
    deleteFolderStatus?.isLoading,
  ]);

  useEffect(() => {
    if (loadedFiles?.loadedFiles?.files?.length) {
      let fileArray = loadedFiles?.loadedFiles?.files?.map((file) => ({
        fileId: file.fileId,
        folderId: file.folderId,
      }));
      let request = {
        userToken: signedInDetail?.user?.token,
        fileArray: fileArray,
      };

      dispatch(checkIsFileLabelledStart(request));
    }
    //eslint-disable-next-line
  }, [loadedFiles?.isLoading]);

  useEffect(() => {
    dispatch(getFileMemoryStart());
    //eslint-disable-next-line
  }, [
    uploadFileStatus?.isLoading,
    saveLabelDataStatus?.isLoading,
    deleteFileStatus?.isLoading,
  ]);

  //#endregion

  return (
    <div>
      <Particles params={particlesOptions} className="fixed inset-0 z-0" />

      <div className="animate__animated animate__fadeIn animate__slower">
        <Router>
          <Switch>
            <Route
              path="/label"
              render={() =>
                signedInDetail?.user?.token ? (
                  <NonClassLabel />
                ) : (
                  <Redirect to="/" />
                )
              }
            />

            <Route
              path="/"
              render={() =>
                signedInDetail?.user?.token ? (
                  <Workstation />
                ) : (
                  <Redirect to="/" />
                )
              }
            />

            <Route
              path="/register"
              render={() =>
                signedInDetail?.user?.token ? <Redirect to="/" /> : <Register />
              }
            />
            <Route
              path="/forgot"
              render={() =>
                signedInDetail?.user?.token ? <Redirect to="/" /> : <Forgot />
              }
            />

            <Route
              path="/login"
              render={() =>
                signedInDetail?.user?.token ? <Redirect to="/" /> : <Login />
              }
            />
            <Route
              path="/start"
              render={() =>
                signedInDetail?.user?.token ? <Redirect to="/" /> : <Start />
              }
            />
          </Switch>
        </Router>
      </div>
      <div className="flex flex-col justify-end items-center">
        <Footer />
      </div>
    </div>
  );
}

export default App;
