import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "../constants/index";

const initialState = {
  usersList: {
    page: 1,
    data: [],
    count: 0,
  },
  currentUser: [],
  loadingUserList: true,
  loadingUser: false,
  error: {},
  sortingParams: {
    limit: Constants.DEFAULT_PAGE_SIZE,
    page: 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    isAll: 1,
  },
};

const userSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    userCreated(state) {
      state.loadingUser = false;
    },
    resetUser(state) {
      return {
        ...initialState,
      };
    },
    loadUserPage(state) {
      return {
        ...state,
        loadingUser: false,
      };
    },
    userUpdated(state, action) {
      return {
        ...state,
        currentUser: action.payload,
        sortingParams: initialState.sortingParams,
        loadingUser: false,
      };
    },
    userError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingUser: false,
        loadingUserList: false,
      };
    },
    userDeleted(state, action) {
      const currentCount = state.usersList.count;
      const currentLimit = state.sortingParams.limit;
      const currentPage = parseInt(state.usersList.page);
      const remainingPages = Math.ceil((currentCount - 1) / currentLimit);
      return {
        ...state,
        usersList: {
          data: state.usersList.data.filter(
            (user) => user._id !== action.payload
          ),
          count: currentCount - 1,
          page:
            currentPage <= remainingPages
              ? currentPage.toString()
              : remainingPages.toString(),
        },
        sortingParams: initialState.sortingParams,
        loadingUserList: false,
      };
    },
    userDetailsById(state, action) {
      return {
        ...state,
        currentUser: action.payload,
        loadingUser: false,
      };
    },
    userListUpdated(state, action) {
      return {
        ...state,
        usersList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        // loadingUser: true,
        loadingUserList: false,
      };
    },
    userSearchParameterUpdate(state, action) {
      return {
        ...state,
        sortingParams: { ...action.payload },
        loadingUserList: false,
      };
    },
    loadingOnUserSubmit(state) {
      return {
        ...state,
        loadingUser: true,
      };
    },
    loadingUsersList(state) {
      return {
        ...state,
        loadingUserList: true,
      };
    },
    userStatusUpdated(state, action) {
      return {
        ...state,
        usersList: {
          ...state.usersList,
          data: state.usersList.data.map((user) =>
            user._id === action.payload.user_id
              ? { ...user, status: action.payload.status }
              : user
          ),
        },
      };
    },
  },
});

export const {
  userCreated,
  resetUser,
  loadUserPage,
  userUpdated,
  userError,
  userDeleted,
  userDetailsById,
  userListUpdated,
  userSearchParameterUpdate,
  loadingOnUserSubmit,
  loadingUsersList,
  userStatusUpdated,
} = userSlice.actions;
export default userSlice.reducer;
