import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "@src/constants/index";

const initialState = {
  currentTxnDetails: 0,
  transactions: {
    page: 1,
    data: [],
    count: 0,
  },
  walletRequestsList: {
    page: 1,
    data: [],
    count: 0,
  },
  loadingWalletRequestList: false,
  loadingCurrentBalance: false,
  loadingTransactions: false,
  loadingWalletRequest: false,
  error: {},
  sortingParams: {
    limit: Constants.DEFAULT_PAGE_SIZE,
    page: 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
  },
};

const walletSlice = createSlice({
  name: "wallet",
  initialState: initialState,
  reducers: {
    currentBalanceUpdated(state, action) {
      return {
        ...state,
        currentTxnDetails: action.payload,
        loadingCurrentBalance: false,
      };
    },
    transactionsUpdated(state, action) {
      return {
        ...state,
        transactions: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        loadingTransactions: false,
      };
    },
    walletError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingCurrentBalance: false,
        loadingTransactions: false,
      };
    },
    loadingCurrentBalance(state) {
      return {
        ...state,
        loadingCurrentBalance: true,
      };
    },
    loadingTransactions(state) {
      return {
        ...state,
        loadingTransactions: true,
      };
    },
    walletRequestCreated(state) {
      return {
        ...state,
        loadingWalletRequest: false,
      };
    },

    loadingOnWalletRequestSubmit(state) {
      return {
        ...state,
        loadingWalletRequest: true,
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
        loadingWalletRequestList: false,
      };
    },
    loadingWalletRequestList(state) {
      return {
        ...state,
        loadingWalletRequestList: true,
      };
    },
  },
});

export const {
  currentBalanceUpdated,
  transactionsUpdated,
  walletError,
  loadingCurrentBalance,
  loadingTransactions,
  walletRequestCreated,
  loadingOnWalletRequestSubmit,
  walletRequestListUpdated,
  loadingWalletRequestList,
} = walletSlice.actions;
export default walletSlice.reducer;
