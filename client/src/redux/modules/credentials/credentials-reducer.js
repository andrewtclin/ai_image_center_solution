import CredentialsActionTypes from "./credentials-types";

const INITIAL_STATE = {
  defaultUser: {
    isLoading: false,
    error: null,
  },

  signedIn: {
    isLoading: false,
    error: null,
    user: {},
  },

  signedOut: {
    isLoading: false,
    error: null,
  },

  signUp: { isLoading: false, error: null, signupSuccess: false },

  forgetCredentials: {
    sentInfo: false,
    isLoading: false,
    error: null,
  },
};

const credentialsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    //#region //* ------ Reset ------ *//
    case CredentialsActionTypes.USER_STATE_RESET:
      return {
        defaultUser: {
          isLoading: false,
          error: null,
        },

        signedIn: {
          isLoading: false,
          error: null,
          user: {},
        },
        signedOut: {
          isLoading: false,
          error: null,
        },

        signUp: { isLoading: false, error: null, signupSuccess: false },

        forgetCredentials: {
          sentInfo: false,
          isLoading: false,
          error: null,
        },
      };
    //#endregion

    //#region //* ------ Create Default User ------ *//
    case CredentialsActionTypes.CREATE_DEFAULT_USER_START:
      return {
        ...state,
        defaultUser: {
          ...state.defaultUser,
          isLoading: true,
        },
      };
    case CredentialsActionTypes.CREATE_DEFAULT_USER_SUCCESS:
      return {
        ...state,
        defaultUser: {
          ...state.defaultUser,
          isLoading: false,
          error: null,
        },
      };

    case CredentialsActionTypes.CREATE_DEFAULT_USER_FAILURE:
      return {
        ...state,
        defaultUser: {
          ...state.defaultUser,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Sign in ------ *//
    case CredentialsActionTypes.SIGN_IN_START:
      return {
        ...state,
        signedIn: {
          ...state.signedIn,
          isLoading: true,
        },
      };
    case CredentialsActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        signedIn: {
          ...state.signedIn,
          isLoading: false,
          error: null,
          user: action.payload,
        },
      };
    case CredentialsActionTypes.SIGN_IN_FAILURE:
      return {
        ...state,
        signedIn: {
          ...state.signedIn,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Sign out ------ *//
    case CredentialsActionTypes.SIGN_OUT_START:
      return {
        ...state,
        signedOut: {
          ...state.signedOut,
          isLoading: true,
        },
      };
    case CredentialsActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        signedOut: {
          ...state.signedOut,
          isLoading: false,
          error: null,
        },
        signedIn: {
          ...state.signedIn,
          isLoading: false,
          error: null,
          user: {},
        },
      };

    case CredentialsActionTypes.SIGN_OUT_FAILURE:
      return {
        ...state,
        signedOut: {
          ...state.signedOut,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Sign up ------  *//
    case CredentialsActionTypes.SIGN_UP_START:
      return {
        ...state,
        signUp: { ...state.signUp, isLoading: true },
      };
    case CredentialsActionTypes.SIGN_UP_SUCCESS:
      return {
        ...state,
        signUp: {
          ...state.signUp,
          isLoading: false,
          error: null,
          signupSuccess: true,
        },
      };
    case CredentialsActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        signUp: {
          ...state.signUp,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    //#region //* ------ Forget Password ------ *//
    case CredentialsActionTypes.FORGET_PASSWORD_START:
      return {
        ...state,
        forgetCredentials: {
          ...state.forgetCredentials,
          isLoading: true,
        },
      };
    case CredentialsActionTypes.FORGET_PASSWORD_SUCCESS:
      return {
        ...state,
        forgetCredentials: {
          ...state.forgetCredentials,
          sentInfo: true,
          isLoading: false,
          error: null,
        },
      };
    case CredentialsActionTypes.FORGET_PASSWORD_FAILURE:
      return {
        ...state,
        forgetCredentials: {
          ...state.forgetCredentials,
          isLoading: false,
          error: action.payload,
        },
      };
    //#endregion

    default:
      return state;
  }
};

export default credentialsReducer;
