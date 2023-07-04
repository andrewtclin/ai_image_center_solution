import CredentialsActionTypes from "./credentials-types";

//* ------ Reset ------ *//
export const credentialsStateReset = () => ({
  type: CredentialsActionTypes.CREDENTIALS_STATE_RESET,
});

//#region //* ------ Create Default User ------ *//
export const createDefaultUserStart = () => ({
  type: CredentialsActionTypes.CREATE_DEFAULT_USER_START,
});

export const createDefaultUserSuccess = () => ({
  type: CredentialsActionTypes.CREATE_DEFAULT_USER_SUCCESS,
});

export const createDefaultUserFailure = (error) => ({
  type: CredentialsActionTypes.CREATE_DEFAULT_USER_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Signin ------ *//
export const signInStart = (userCredentials) => ({
  type: CredentialsActionTypes.SIGN_IN_START,
  payload: userCredentials,
});

export const signInSuccess = (user) => ({
  type: CredentialsActionTypes.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = (error) => ({
  type: CredentialsActionTypes.SIGN_IN_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Signout ------ *//
export const signOutStart = (token) => ({
  type: CredentialsActionTypes.SIGN_OUT_START,
  payload: token,
});

export const signOutSuccess = () => ({
  type: CredentialsActionTypes.SIGN_OUT_SUCCESS,
});

export const signOutFailure = (error) => ({
  type: CredentialsActionTypes.SIGN_OUT_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Signup ------ */
export const signUpStart = (userCredentials) => ({
  type: CredentialsActionTypes.SIGN_UP_START,
  payload: userCredentials,
});

export const signUpSuccess = (statusCode) => ({
  type: CredentialsActionTypes.SIGN_UP_SUCCESS,
  payload: statusCode,
});

export const signUpFailure = (error) => ({
  type: CredentialsActionTypes.SIGN_UP_FAILURE,
  payload: error,
});
//#endregion

//#region //* ------ Forget Password ------ *//
export const forgetPasswordStart = (userInfo) => ({
  type: CredentialsActionTypes.FORGET_PASSWORD_START,
  payload: userInfo,
});

export const forgetPasswordSuccess = () => ({
  type: CredentialsActionTypes.FORGET_PASSWORD_SUCCESS,
});

export const forgetPasswordFailure = (error) => ({
  type: CredentialsActionTypes.FORGET_PASSWORD_FAILURE,
  payload: error,
});
//#endregion
