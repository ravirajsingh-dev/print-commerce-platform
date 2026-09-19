import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "../constants/index";

const initialState = {
  serviceCatsList: {
    page: 1,
    data: [],
    count: 0,
  },
  currentServiceCat: {},
  loadingServiceCatList: true,
  loadingServiceCat: false,
  error: {},
  sortingParams: {
    limit: Constants.DEFAULT_PAGE_SIZE,
    page: 1,
    serviceCatBy: "createdAt",
    ascending: "desc",
    query: "",
    isAll: 1,
  },
  loadingChangePassword: false,
  serviceCatsListAll: [],
};

const serviceCatSlice = createSlice({
  name: "serviceCats",
  initialState: initialState,
  reducers: {
    serviceCatCreated(state) {
      state.loadingServiceCat = false;
    },
    resetServiceCat(state) {
      return {
        ...initialState,
      };
    },
    loadServiceCatPage(state) {
      return {
        ...state,
        loadingServiceCat: false,
      };
    },
    serviceCatUpdated(state, action) {
      return {
        ...state,
        currentServiceCat: action.payload,
        sortingParams: initialState.sortingParams,
        loadingServiceCat: false,
      };
    },
    serviceCatError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingServiceCat: false,
        loadingServiceCatList: false,
      };
    },
    serviceCatDeleted(state, action) {
      const currentCount = state.serviceCatsList.count;
      const currentLimit = state.sortingParams.limit;
      const currentPage = parseInt(state.serviceCatsList.page);
      const remainingPages = Math.ceil((currentCount - 1) / currentLimit);
      return {
        ...state,
        serviceCatsList: {
          data: state.serviceCatsList.data.filter(
            (serviceCat) => serviceCat._id !== action.payload
          ),
          count: currentCount - 1,
          page:
            currentPage <= remainingPages
              ? currentPage.toString()
              : remainingPages.toString(),
        },
        sortingParams: initialState.sortingParams,
        loadingServiceCatList: false,
      };
    },
    serviceCatDetailsById(state, action) {
      return {
        ...state,
        currentServiceCat: action.payload,
        loadingServiceCat: false,
      };
    },
    serviceCatListUpdated(state, action) {
      return {
        ...state,
        serviceCatsList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        // loadingServiceCat: true,
        loadingServiceCatList: false,
      };
    },
    serviceCatSearchParameterUpdate(state, action) {
      return {
        ...state,
        sortingParams: { ...action.payload },
        loadingServiceCatList: false,
      };
    },
    loadingOnServiceCatSubmit(state) {
      return {
        ...state,
        loadingServiceCat: true,
      };
    },
    loadingServiceCatsList(state) {
      return {
        ...state,
        loadingServiceCatList: true,
      };
    },
    loadingOnChangeServiceCatPassword(state, action) {
      return {
        ...state,
        loadingChangePassword: true,
      };
    },
    serviceCatPasswordUpdated(state, action) {
      return {
        ...state,
        loadingChangePassword: false,
      };
    },
    serviceCatsListAll(state, action) {
      return {
        ...state,
        serviceCatsListAll: action.payload,
      };
    },
  },
});

export const {
  serviceCatCreated,
  resetServiceCat,
  loadServiceCatPage,
  serviceCatUpdated,
  serviceCatError,
  serviceCatDeleted,
  serviceCatDetailsById,
  serviceCatListUpdated,
  serviceCatSearchParameterUpdate,
  loadingOnServiceCatSubmit,
  loadingServiceCatsList,
  loadingOnChangeServiceCatPassword,
  serviceCatPasswordUpdated,
  serviceCatsListAll,
} = serviceCatSlice.actions;
export default serviceCatSlice.reducer;
