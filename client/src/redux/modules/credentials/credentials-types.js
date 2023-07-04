const CredentialsActionTypes = {
  //User State Reset
  CREDENTIALS_STATE_RESET: "CREDENTIALS_STATE_RESET",

  //#region //* ------ Create Default User ------ *//
  CREATE_DEFAULT_USER_START: "CREATE_DEFAULT_USER_START",
  CREATE_DEFAULT_USER_SUCCESS: "CREATE_DEFAULT_USER_SUCCESS",
  CREATE_DEFAULT_USER_FAILURE: "CREATE_DEFAULT_USER_FAILURE",

  //#endregion

  //#region //* ------ Sign in ------ *//
  SIGN_IN_START: "SIGN_IN_START",
  SIGN_IN_SUCCESS: "SIGN_IN_SUCCESS",
  SIGN_IN_FAILURE: "SIGN_IN_FAILURE",
  //#endregion

  //#region //* ------ Sign out ------ *//
  SIGN_OUT_START: "SIGN_OUT_START",
  SIGN_OUT_SUCCESS: "SIGN_OUT_SUCCESS",
  SIGN_OUT_FAILURE: "SIGN_OUT_FAILURE",
  //#endregion

  //#region //* ------ Signup Process ------ *//
  SIGN_UP_START: "SIGN_UP_START",
  SIGN_UP_SUCCESS: "SIGN_UP_SUCCESS",
  SIGN_UP_FAILURE: "SIGN_UP_FAILURE",
  //#endregion

  //#region //* ------ Forget Password ------ *//
  FORGET_PASSWORD_START: "FORGET_PASSWORD_START",
  FORGET_PASSWORD_SUCCESS: "FORGET_PASSWORD_SUCCESS",
  FORGET_PASSWORD_FAILURE: "FORGET_PASSWORD_FAILURE",
  //#endregion
};

export default CredentialsActionTypes;
