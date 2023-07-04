import { createSelector } from "reselect";

const selectCredentials = (state) => state.credentials;

export const selectSignedIn = createSelector(
  [selectCredentials],
  (credentials) => credentials.signedIn
);

export const selectSignedOut = createSelector(
  [selectCredentials],
  (credentials) => credentials.signedOut
);

export const selectSignUp = createSelector(
  [selectCredentials],
  (credentials) => credentials.signUp
);

export const selectForgetCredentials = createSelector(
  [selectCredentials],
  (credentials) => credentials.forgetCredentials
);

export const selectDefaultUser = createSelector(
  [selectCredentials],
  (credentials) => credentials.defaultUser
);
