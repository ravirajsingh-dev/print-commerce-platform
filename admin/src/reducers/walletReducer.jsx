import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "../constants/index";

const initialState = {
  walletRequestsList: {
    page: 1,
    data: [],
    count: 0,
  },
  currentWalletRequest: {},
  loadingWalletRequestList: true,
  loadingWalletRequest: false,
  error: {},
  sortingParams: {
    limit: Constants.DEFAULT_PAGE_SIZE,
    page: 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    isAll: 1,
  },
  loadingChangePassword: false,
};

const walletRequestSlice = createSlice({
  name: "wallet",
  initialState: initialState,
  reducers: {
    walletRequestCreated(state) {
      state.loadingWalletRequest = false;
    },
    resetWalletRequest(state) {
      return {
        ...initialState,
      };
    },
    loadWalletRequestPage(state) {
      return {
        ...state,
        loadingWalletRequest: false,
      };
    },
    walletRequestUpdated(state, action) {
      return {
        ...state,
        currentWalletRequest: action.payload,
        sortingParams: initialState.sortingParams,
        loadingWalletRequest: false,
      };
    },
    walletRequestError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingWalletRequest: false,
        loadingWalletRequestList: false,
      };
    },
    walletRequestDeleted(state, action) {
      const currentCount = state.walletRequestsList.count;
      const currentLimit = state.sortingParams.limit;
      const currentPage = parseInt(state.walletRequestsList.page);
      const remainingPages = Math.ceil((currentCount - 1) / currentLimit);
      return {
        ...state,
        walletRequestsList: {
          data: state.walletRequestsList.data.filter(
            (user) => user._id !== action.payload
          ),
          count: currentCount - 1,
          page:
            currentPage <= remainingPages
              ? currentPage.toString()
              : remainingPages.toString(),
        },
        sortingParams: initialState.sortingParams,
        loadingWalletRequestList: false,
      };
    },
    walletRequestDetailsById(state, action) {
      return {
        ...state,
        currentWalletRequest: action.payload,
        loadingWalletRequest: false,
      };
    },
    walletRequestListUpdated(state, action) {
      return {
        ...state,
        walletRequestsList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        // loadingWalletRequest: true,
        loadingWalletRequestList: false,
      };
    },
    walletRequestSearchParameterUpdate(state, action) {
      return {
        ...state,
        sortingParams: { ...action.payload },
        loadingWalletRequestList: false,
      };
    },
    loadingOnWalletRequestSubmit(state) {
      return {
        ...state,
        loadingWalletRequest: true,
      };
    },
    loadingWalletRequestsList(state) {
      return {
        ...state,
        loadingWalletRequestList: true,
      };
    },

    walletRequestStatusUpdated(state, action) {
      return {
        ...state,
        walletRequestsList: {
          ...state.walletRequestsList,
          data: state.walletRequestsList.data.map((walletRequest) =>
            walletRequest._id === action.payload._id
              ? { ...walletRequest, status: action.payload.status }
              : walletRequest
          ),
        },
      };
    },
  },
});

export const {
  walletRequestCreated,
  resetWalletRequest,
  loadWalletRequestPage,
  walletRequestUpdated,
  walletRequestError,
  walletRequestDeleted,
  walletRequestDetailsById,
  walletRequestListUpdated,
  walletRequestSearchParameterUpdate,
  loadingOnWalletRequestSubmit,
  loadingWalletRequestsList,
  walletRequestStatusUpdated,
} = walletRequestSlice.actions;
export default walletRequestSlice.reducer;
