import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "../constants/index";

const initialState = {
  bannersList: {
    page: 1,
    data: [],
    count: 0,
  },
  currentBanner: {},
  loadingBannerList: true,
  loadingBanner: false,
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

const bannerSlice = createSlice({
  name: "banners",
  initialState: initialState,
  reducers: {
    bannerCreated(state) {
      state.loadingBanner = false;
    },
    resetBanner(state) {
      return {
        ...initialState,
      };
    },
    loadBannerPage(state) {
      return {
        ...state,
        loadingBanner: false,
      };
    },
    bannerUpdated(state, action) {
      return {
        ...state,
        currentBanner: action.payload,
        sortingParams: initialState.sortingParams,
        loadingBanner: false,
      };
    },
    bannerError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingBanner: false,
        loadingBannerList: false,
      };
    },
    bannerDeleted(state, action) {
      const currentCount = state.bannersList.count;
      const currentLimit = state.sortingParams.limit;
      const currentPage = parseInt(state.bannersList.page);
      const remainingPages = Math.ceil((currentCount - 1) / currentLimit);
      return {
        ...state,
        bannersList: {
          data: state.bannersList.data.filter(
            (banner) => banner._id !== action.payload
          ),
          count: currentCount - 1,
          page:
            currentPage <= remainingPages
              ? currentPage.toString()
              : remainingPages.toString(),
        },
        sortingParams: initialState.sortingParams,
        loadingBannerList: false,
      };
    },
    bannerDetailsById(state, action) {
      return {
        ...state,
        currentBanner: action.payload,
        loadingBanner: false,
      };
    },
    bannerListUpdated(state, action) {
      return {
        ...state,
        bannersList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        // loadingBanner: true,
        loadingBannerList: false,
      };
    },
    bannerSearchParameterUpdate(state, action) {
      return {
        ...state,
        sortingParams: { ...action.payload },
        loadingBannerList: false,
      };
    },
    loadingOnBannerSubmit(state) {
      return {
        ...state,
        loadingBanner: true,
      };
    },
    loadingBannersList(state) {
      return {
        ...state,
        loadingBannerList: true,
      };
    },
    loadingOnChangeBannerPassword(state, action) {
      return {
        ...state,
        loadingChangePassword: true,
      };
    },
    bannerPasswordUpdated(state, action) {
      return {
        ...state,
        loadingChangePassword: false,
      };
    },
  },
});

export const {
  bannerCreated,
  resetBanner,
  loadBannerPage,
  bannerUpdated,
  bannerError,
  bannerDeleted,
  bannerDetailsById,
  bannerListUpdated,
  bannerSearchParameterUpdate,
  loadingOnBannerSubmit,
  loadingBannersList,
  loadingOnChangeBannerPassword,
  bannerPasswordUpdated,
} = bannerSlice.actions;
export default bannerSlice.reducer;
