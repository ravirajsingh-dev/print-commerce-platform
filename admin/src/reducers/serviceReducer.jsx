import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "../constants/index";

const initialState = {
  servicesList: {
    page: 1,
    data: [],
    count: 0,
  },
  currentService: [],
  loadingServiceList: true,
  loadingService: false,
  error: {},
  sortingParams: {
    limit: Constants.DEFAULT_PAGE_SIZE,
    page: 1,
    serviceBy: "createdAt",
    ascending: "desc",
    query: "",
    isAll: 1,
  },
  loadingChangePassword: false,
  servicesListAll: [],
};

const serviceSlice = createSlice({
  name: "services",
  initialState: initialState,
  reducers: {
    serviceCreated(state) {
      state.loadingService = false;
    },
    resetService(state) {
      return {
        ...initialState,
      };
    },
    loadServicePage(state) {
      return {
        ...state,
        loadingService: false,
      };
    },
    serviceUpdated(state, action) {
      return {
        ...state,
        currentService: action.payload,
        sortingParams: initialState.sortingParams,
        loadingService: false,
      };
    },
    serviceError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingService: false,
        loadingServiceList: false,
      };
    },
    serviceDeleted(state, action) {
      const currentCount = state.servicesList.count;
      const currentLimit = state.sortingParams.limit;
      const currentPage = parseInt(state.servicesList.page);
      const remainingPages = Math.ceil((currentCount - 1) / currentLimit);
      return {
        ...state,
        servicesList: {
          data: state.servicesList.data.filter(
            (service) => service._id !== action.payload
          ),
          count: currentCount - 1,
          page:
            currentPage <= remainingPages
              ? currentPage.toString()
              : remainingPages.toString(),
        },
        sortingParams: initialState.sortingParams,
        loadingServiceList: false,
      };
    },
    serviceDetailsById(state, action) {
      return {
        ...state,
        currentService: action.payload,
        loadingService: false,
      };
    },
    serviceListUpdated(state, action) {
      return {
        ...state,
        servicesList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        // loadingService: true,
        loadingServiceList: false,
      };
    },
    serviceSearchParameterUpdate(state, action) {
      return {
        ...state,
        sortingParams: { ...action.payload },
        loadingServiceList: false,
      };
    },
    loadingOnServiceSubmit(state) {
      return {
        ...state,
        loadingService: true,
      };
    },
    loadingServicesList(state) {
      return {
        ...state,
        loadingServiceList: true,
      };
    },
    loadingOnChangeServicePassword(state, action) {
      return {
        ...state,
        loadingChangePassword: true,
      };
    },
    servicePasswordUpdated(state, action) {
      return {
        ...state,
        loadingChangePassword: false,
      };
    },
    servicesListAll(state, action) {
      return {
        ...state,
        servicesListAll: action.payload,
      };
    },
  },
});

export const {
  serviceCreated,
  resetService,
  loadServicePage,
  serviceUpdated,
  serviceError,
  serviceDeleted,
  serviceDetailsById,
  serviceListUpdated,
  serviceSearchParameterUpdate,
  loadingOnServiceSubmit,
  loadingServicesList,
  loadingOnChangeServicePassword,
  servicePasswordUpdated,
  servicesListAll,
} = serviceSlice.actions;
export default serviceSlice.reducer;
