import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "../constants/index";

const initialState = {
  credentialsList: {
    page: 1,
    data: [],
    count: 0,
  },
  currentCredential: [],
  loadingCredentialList: true,
  loadingCredential: false,
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

const credentialSlice = createSlice({
  name: "credentials",
  initialState: initialState,
  reducers: {
    credentialCreated(state) {
      state.loadingCredential = false;
    },
    resetCredential(state) {
      return {
        ...initialState,
      };
    },
    loadCredentialPage(state) {
      return {
        ...state,
        loadingCredential: false,
      };
    },
    credentialUpdated(state, action) {
      return {
        ...state,
        currentCredential: action.payload,
        sortingParams: initialState.sortingParams,
        loadingCredential: false,
      };
    },
    credentialError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingCredential: false,
        loadingCredentialList: false,
      };
    },
    credentialDeleted(state, action) {
      const currentCount = state.credentialsList.count;
      const currentLimit = state.sortingParams.limit;
      const currentPage = parseInt(state.credentialsList.page);
      const remainingPages = Math.ceil((currentCount - 1) / currentLimit);
      return {
        ...state,
        credentialsList: {
          data: state.credentialsList.data.filter(
            (credential) => credential._id !== action.payload
          ),
          count: currentCount - 1,
          page:
            currentPage <= remainingPages
              ? currentPage.toString()
              : remainingPages.toString(),
        },
        sortingParams: initialState.sortingParams,
        loadingCredentialList: false,
      };
    },
    credentialDetailsById(state, action) {
      return {
        ...state,
        currentCredential: action.payload,
        loadingCredential: false,
      };
    },
    credentialListUpdated(state, action) {
      return {
        ...state,
        credentialsList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        loadingCredentialList: false,
      };
    },
    credentialSearchParameterUpdate(state, action) {
      return {
        ...state,
        sortingParams: { ...action.payload },
        loadingCredentialList: false,
      };
    },
    loadingOnCredentialSubmit(state) {
      return {
        ...state,
        loadingCredential: true,
      };
    },
    loadingCredentialsList(state) {
      return {
        ...state,
        loadingCredentialList: true,
      };
    },
    credentialStatusUpdated(state, action) {
      return {
        ...state,
        credentialsList: {
          ...state.credentialsList,
          data: state.credentialsList.data.map((credential) =>
            credential._id === action.payload.credential_id
              ? { ...credential, status: action.payload.status }
              : credential
          ),
        },
      };
    },
  },
});

export const {
  credentialCreated,
  resetCredential,
  loadCredentialPage,
  credentialUpdated,
  credentialError,
  credentialDeleted,
  credentialDetailsById,
  credentialListUpdated,
  credentialSearchParameterUpdate,
  loadingOnCredentialSubmit,
  loadingCredentialsList,
  credentialStatusUpdated,
} = credentialSlice.actions;
export default credentialSlice.reducer;
