import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  authId: false,
  loading: false,
  loadingPasswordReset: false,
  user: null,
  error: {},
  loadingProfile: true,
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
        isAuthenticated: true,
        loading: false,
        loadingProfile: false,
        user: action.payload,
      };
    },
    registerSuccess(state) {
      return {
        ...state,
        loadingPasswordReset: false,
      };
    },
    resetLinkSuccess(state) {
      return {
        ...state,
        loadingPasswordReset: false,
        loadingOnOTPVerified: false,
        otpSent: true,
      };
    },
    loginSucess(state, action) {
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        authId: false,
        isAuthenticated: true,
        loading: false,
      };
    },
    registerFail(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingPasswordReset: false,
        loadingOnOTPVerified: false,
      };
    },
    resetLinkFail(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingPasswordReset: false,
        loadingOnOTPVerified: false,
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
  },
});

export const {
  loadAuthPage,
  authTokenRefresh,
  userLoaded,
  registerSuccess,
  resetLinkSuccess,
  loginSucess,
  registerFail,
  resetLinkFail,
  authError,
  logoutAuth,
  loginFail,
  loadingOnPasswordReset,
  loadingOnLoginSubmit,
  resetAuth,
  otpVerifiedSuccess,
  otpVerificationFail,
  loadingOnOTPVerified,
} = authSlice.actions;
export default authSlice.reducer;
