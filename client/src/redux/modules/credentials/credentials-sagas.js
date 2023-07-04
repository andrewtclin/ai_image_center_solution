import { takeLatest, put, all, call } from "redux-saga/effects";
import { axiosUser, axiosRoot } from "../../../api/axios/axios";

import CredentialsActionTypes from "./credentials-types";

import {
  createDefaultUserSuccess,
  createDefaultUserFailure,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure,
  forgetPasswordSuccess,
  forgetPasswordFailure,
  signInStart,
} from "./credentials-actions";

import Swal from "sweetalert2";

//#region //* ------ APIs ------ *//
const createDefaultUserApi = async () => {
  const response = await axiosRoot({
    method: "get",
    url: "/db/check_db",
  });
  return response.data.result;
};

const signInApi = async ({ account, password }) => {
  const response = await axiosUser({
    method: "post",
    url: "/login",
    data: {
      username: account,
      password: password,
    },
  });
  return response.data.result;
};

const signOutApi = async (token) => {
  const response = await axiosUser({
    method: "delete",
    url: "/logout",
    headers: {
      Authorization: token,
    },
  });
  return response.data.result;
};

const forgetPasswordApi = async ({ account, email }) => {
  const response = await axiosUser({
    method: "post",
    url: "/forget",
    data: {
      username: account,
      email: email,
    },
  });
  return response.data.result;
};

const forgetPasswordEmailApi = async ({ account, email, token }) => {
  const response = await axiosUser({
    method: "post",
    url: "/message",
    data: {
      username: account,
      email: email,
      token: token,
    },
  });
  return response.data.result;
};

const signUpApi = async ({ account, password, email, mword }) => {
  const response = await axiosUser({
    method: "post",
    url: "/register",
    data: {
      username: account,
      password: password,
      email: email,
      mword: mword,
    },
  });
  return response.data.result;
};

//#endregion

//#region //* ------ WATCHERS ------ *//
function* createDefaultUserStart() {
  yield takeLatest(
    CredentialsActionTypes.CREATE_DEFAULT_USER_START,
    createDefaultUser
  );
}

function* signInStartSaga() {
  yield takeLatest(CredentialsActionTypes.SIGN_IN_START, signIn);
}

function* signOutStart() {
  yield takeLatest(CredentialsActionTypes.SIGN_OUT_START, signOut);
}

function* forgetPasswordStart() {
  yield takeLatest(
    CredentialsActionTypes.FORGET_PASSWORD_START,
    forgetPassword
  );
}

function* signUpStart() {
  yield takeLatest(CredentialsActionTypes.SIGN_UP_START, signUp);
}
//#endregion

//#region //* ------ WORKERS ------ *//
function* createDefaultUser() {
  try {
    yield call(createDefaultUserApi);
    yield put(createDefaultUserSuccess());
    yield put(signInStart({ account: "username", password: "password" }));
  } catch (error) {
    yield put(createDefaultUserFailure(error));
    Swal.fire("Error", "Unable to create a default user", "error");
  }
}

function* signIn({ payload: { account = "username", password = "password" } }) {
  try {
    const apiResponse = yield call(signInApi, { account, password });
    const response = { token: apiResponse.token, account: account };
    yield put(signInSuccess(response));
  } catch (error) {
    yield put(signInFailure(error.response.data.description));
  }
}

function* signOut({ payload }) {
  try {
    yield call(signOutApi, payload);
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error.response.data.description));
  }
}

function* forgetPassword({ payload: { account, email } }) {
  try {
    const response = yield call(forgetPasswordApi, { account, email });
    yield put(forgetPasswordSuccess());
    const token = yield response?.token;
    yield call(forgetPasswordEmailApi, { account, email, token });
  } catch (error) {
    yield put(forgetPasswordFailure(error));
  }
}

function* signUp({ payload: { email, password, account, mword } }) {
  try {
    const response = yield call(signUpApi, {
      account,
      password,
      email,
      mword,
    });
    yield put(signUpSuccess(response));
  } catch (error) {
    yield put(signUpFailure(error.response.data.description));
  }
}
//#endregion

/* ------ Sagas Collaboration ------ */
export function* credentialsSaga() {
  yield all([
    call(createDefaultUserStart),
    call(signInStartSaga),
    call(signOutStart),
    call(forgetPasswordStart),
    call(signUpStart),
  ]);
}
