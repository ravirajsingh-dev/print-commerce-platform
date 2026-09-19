import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  loadingChangePassword: false,
  error: {},
  user: null,
  profileImageError: null,
};

const profileSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    userProfileLoaded(state, action) {
      return {
        ...state,
        user: action.payload,
        loading: false,
        loadingChangePassword: false,
      };
    },
    loadProfilePage(state) {
      return {
        ...state,
        loading: false,
      };
    },
    userProfileUpdated(state, action) {
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    },
    userProfilePasswordUpdated(state, action) {
      return {
        ...state,
        user: action.payload,
        loadingChangePassword: false,
      };
    },
    userProfileError(state, action) {
      return {
        ...state,
        error: action.payload,
        loading: false,
        loadingChangePassword: false,
      };
    },
    userProfilePasswordError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingChangePassword: false,
      };
    },
    loadingOnProfileSubmit(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    loadingOnChangePassword(state, action) {
      return {
        ...state,
        loadingChangePassword: true,
      };
    },
    setProfileUploadError(state, action) {
      return {
        ...state,
        profileImageError: action.payload,
      };
    },
  },
});

export const {
  userProfileLoaded,
  userProfileUpdated,
  loadProfilePage,
  userProfilePasswordUpdated,
  userProfileError,
  userProfilePasswordError,
  loadingOnProfileSubmit,
  loadingOnChangePassword,
  setProfileUploadError,
} = profileSlice.actions;
export default profileSlice.reducer;
