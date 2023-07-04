import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import credentialsReducer from "./modules/credentials/credentials-reducer";
import fileSystemReducer from "./modules/fileSystem/fileSystem-reducer";
import labelReducer from "./modules/label/label-reducer";

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["credentials", "fileSystem", "label"],
};

const rootReducer = combineReducers({
  credentials: credentialsReducer,
  fileSystem: fileSystemReducer,
  label: labelReducer,
});

export default persistReducer(persistConfig, rootReducer);
