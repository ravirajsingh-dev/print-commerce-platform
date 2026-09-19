import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientsList: {
    page: 1,
    data: [],
    count: 0,
  },
  loadingClientList: true,
  loadingDashboard: false,
  dashboardDetails: {},
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    loadingDashboardClientsList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    dashboardClientListUpdated(state, action) {
      return {
        ...state,
        clientsList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        loadingClientList: false,
      };
    },
    dashboardError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingClientList: false,
      };
    },
    loadingDashboardData(state, action) {
      return {
        ...state,
        loadingDashboard: true,
      };
    },
    dashbaordDetailsUpdated(state, action) {
      return {
        ...state,
        dashboardDetails: action.payload,
        loadingDashboard: false,
      };
    },
    newUserStatusUpdated(state, action) {
      return {
        ...state,
        dashboardDetails: {
          ...state.dashboardDetails,
          newUsers: state.dashboardDetails?.newUsers.filter(
            (user) => user._id !== action.payload._id
          ),
        },
      };
    },
  },
});

export const {
  loadingDashboardClientsList,
  dashboardClientListUpdated,
  dashboardError,
  loadingDashboardData,
  dashbaordDetailsUpdated,
  newUserStatusUpdated,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
