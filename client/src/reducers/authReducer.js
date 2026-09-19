import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  authId: false,
  loading: false,
  loadingPasswordReset: false,
  userRegistered: false,
  user: null,
  error: {},
  loadingProfile: true,
  otpSentForLogin: false,
  enableResendOTPOption: false,
  sponsorUser: null,
  isUserSidebarExpended: true,
  loadingOnChangePassword: false,
  loadingOnOTPVerified: false,
  otpSent: false,
  otpVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadAuthPage(state) {
      return {
        ...state,
        loading: false,
      };
    },
    resetAuth(state) {
      return {
        ...initialState,
      };
    },
    authTokenRefresh(state, action) {
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.action.payload,
      };
    },
    userLoaded(state, action) {
      return {
        ...state,
        loading: false,
        loadingProfile: false,
        user: action.payload,
        isAuthenticated: true,
      };
    },
    registerSuccess(state) {
      return {
        ...state,
        loadingPasswordReset: false,
        userRegistered: true,
      };
    },
    resetLinkSuccess(state) {
      return {
        ...state,
        loadingPasswordReset: false,
        otpSent: true,
        loadingOnOTPVerified: false,
      };
    },

    otpVerifiedSuccess(state) {
      return {
        ...state,
        otpVerified: true,
        loadingOnOTPVerified: false,
      };
    },

    otpVerificationFail(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingOnOTPVerified: false,
      };
    },

    loadingOnOTPVerified(state) {
      return {
        ...state,
        loadingOnOTPVerified: true,
      };
    },

    loginSucess(state, action) {
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        authId: false,
        loading: false,
        otpSentForLogin: false,
        enableResendOTPOption: false,
        isAuthenticated: true,
      };
    },
    registerFail(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingPasswordReset: false,
      };
    },
    resetLinkFail(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingPasswordReset: false,
      };
    },
    authError(state, action) {
      localStorage.removeItem("token");
      return {
        ...state,
        error: action.payload,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        loadingProfile: false,
      };
    },
    logoutAuth(state) {
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        loadingProfile: false,
      };
    },
    loginFail(state) {
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    },
    loadingOnPasswordReset(state) {
      return {
        ...state,
        loadingPasswordReset: true,
      };
    },
    loadingOnLoginSubmit(state) {
      return {
        ...state,
        loading: true,
      };
    },
    loginOTPSend(state) {
      return {
        ...state,
        otpSentForLogin: true,
        loading: false,
        enableResendOTPOption: false,
      };
    },
    enableResendOTP(state) {
      return {
        ...state,
        enableResendOTPOption: true,
      };
    },
    sponsorUserLoaded(state, action) {
      return {
        ...state,
        sponsorUser: action.payload,
      };
    },
    updateUserSidebarExpended(state, action) {
      return {
        ...state,
        isUserSidebarExpended: !state.isUserSidebarExpended,
      };
    },

    // Change password
    setLoadingOnChangePassword(state) {
      return {
        ...state,
        loadingOnChangePassword: true,
      };
    },

    changePasswordSuccess(state, action) {
      return {
        ...state,
        loadingOnChangePassword: false,
        user: {
          ...state.user,
          txn_password: action.payload.txnPassword,
        },
      };
    },
    changePasswordError(state) {
      return {
        ...state,
        loadingOnChangePassword: false,
      };
    },
    loadingOnProfileSubmit(state) {
      return {
        ...state,
        loadingProfile: true,
      };
    },
    userProfileUpdated(state, action) {
      return {
        ...state,
        loadingProfile: false,
        user: action.payload,
      };
    },
    userProfileError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingProfile: false,
      };
    },
    passwordUpdated(state, action) {
      return {
        ...state,
        loadingOnChangePassword: false,
      };
    },
  },
});

export const {
  loadAuthPage,
  resetAuth,
  authTokenRefresh,
  userLoaded,
  registerSuccess,
  resetLinkSuccess,
  otpVerifiedSuccess,
  otpVerificationFail,
  loadingOnOTPVerified,
  loginSucess,
  registerFail,
  resetLinkFail,
  authError,
  logoutAuth,
  loginFail,
  loadingOnPasswordReset,
  loadingOnLoginSubmit,
  loginOTPSend,
  enableResendOTPOption,
  enableResendOTP,
  sponsorUserLoaded,
  updateUserSidebarExpended,
  setLoadingOnChangePassword,
  changePasswordSuccess,
  changePasswordError,
  loadingOnProfileSubmit,
  userProfileUpdated,
  userProfileError,
  passwordUpdated,
} = authSlice.actions;
export default authSlice.reducer;
