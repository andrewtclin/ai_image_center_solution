import { all, call } from "redux-saga/effects";
import { credentialsSaga } from "./modules/credentials/credentials-sagas";
import { fileSystemSaga } from "./modules/fileSystem/fileSystem-sagas";
import { labelSaga } from "./modules/label/label-sagas";

export default function* rootSaga() {
  yield all([call(credentialsSaga), call(fileSystemSaga), call(labelSaga)]);
}
