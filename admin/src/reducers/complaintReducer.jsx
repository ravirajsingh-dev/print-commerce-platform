import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "../constants/index";

const initialState = {
  complaintsList: {
    page: 1,
    data: [],
    count: 0,
  },
  currentComplaint: [],
  loadingComplaintList: true,
  loadingComplaint: false,
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

const complaintSlice = createSlice({
  name: "complaints",
  initialState: initialState,
  reducers: {
    complaintCreated(state) {
      state.loadingComplaint = false;
    },
    resetComplaint(state) {
      return {
        ...initialState,
      };
    },
    loadComplaintPage(state) {
      return {
        ...state,
        loadingComplaint: false,
      };
    },
    complaintUpdated(state, action) {
      return {
        ...state,
        currentComplaint: action.payload,
        sortingParams: initialState.sortingParams,
        loadingComplaint: false,
      };
    },
    complaintError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingComplaint: false,
        loadingComplaintList: false,
      };
    },
    complaintDeleted(state, action) {
      const currentCount = state.complaintsList.count;
      const currentLimit = state.sortingParams.limit;
      const currentPage = parseInt(state.complaintsList.page);
      const remainingPages = Math.ceil((currentCount - 1) / currentLimit);
      return {
        ...state,
        complaintsList: {
          data: state.complaintsList.data.filter(
            (complaint) => complaint._id !== action.payload
          ),
          count: currentCount - 1,
          page:
            currentPage <= remainingPages
              ? currentPage.toString()
              : remainingPages.toString(),
        },
        sortingParams: initialState.sortingParams,
        loadingComplaintList: false,
      };
    },
    complaintDetailsById(state, action) {
      return {
        ...state,
        currentComplaint: action.payload,
        loadingComplaint: false,
      };
    },
    complaintListUpdated(state, action) {
      return {
        ...state,
        complaintsList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        loadingComplaintList: false,
      };
    },
    complaintSearchParameterUpdate(state, action) {
      return {
        ...state,
        sortingParams: { ...action.payload },
        loadingComplaintList: false,
      };
    },
    loadingOnComplaintSubmit(state) {
      return {
        ...state,
        loadingComplaint: true,
      };
    },
    loadingComplaintsList(state) {
      return {
        ...state,
        loadingComplaintList: true,
      };
    },
    complaintStatusUpdated(state, action) {
      return {
        ...state,
        complaintsList: {
          ...state.complaintsList,
          data: state.complaintsList.data.map((complaint) =>
            complaint._id === action.payload.complaint_id
              ? { ...complaint, status: action.payload.status }
              : complaint
          ),
        },
      };
    },
  },
});

export const {
  complaintCreated,
  resetComplaint,
  loadComplaintPage,
  complaintUpdated,
  complaintError,
  complaintDeleted,
  complaintDetailsById,
  complaintListUpdated,
  complaintSearchParameterUpdate,
  loadingOnComplaintSubmit,
  loadingComplaintsList,
  complaintStatusUpdated,
} = complaintSlice.actions;
export default complaintSlice.reducer;
