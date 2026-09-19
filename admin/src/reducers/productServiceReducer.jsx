import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "../constants/index";

const initialState = {
  productServicesList: {
    page: 1,
    data: [],
    count: 0,
  },
  currentProductService: [],
  loadingProductServiceList: true,
  loadingProductService: false,
  error: {},
  sortingParams: {
    limit: Constants.DEFAULT_PAGE_SIZE,
    page: 1,
    productServiceBy: "createdAt",
    ascending: "desc",
    query: "",
    isAll: 1,
  },
  loadingChangePassword: false,
  productServices: [],
  productServicesListAll: [],
};

const productServiceSlice = createSlice({
  name: "productServices",
  initialState: initialState,
  reducers: {
    productServiceCreated(state) {
      state.loadingProductService = false;
    },
    resetProductService(state) {
      return {
        ...initialState,
      };
    },
    loadProductServicePage(state) {
      return {
        ...state,
        loadingProductService: false,
      };
    },
    productServiceUpdated(state, action) {
      return {
        ...state,
        currentProductService: action.payload,
        sortingParams: initialState.sortingParams,
        loadingProductService: false,
      };
    },
    productServiceError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingProductService: false,
        loadingProductServiceList: false,
      };
    },
    productServiceDeleted(state, action) {
      const currentCount = state.productServicesList.count;
      const currentLimit = state.sortingParams.limit;
      const currentPage = parseInt(state.productServicesList.page);
      const remainingPages = Math.ceil((currentCount - 1) / currentLimit);
      return {
        ...state,
        productServicesList: {
          data: state.productServicesList.data.filter(
            (productService) => productService._id !== action.payload
          ),
          count: currentCount - 1,
          page:
            currentPage <= remainingPages
              ? currentPage.toString()
              : remainingPages.toString(),
        },
        sortingParams: initialState.sortingParams,
        loadingProductServiceList: false,
      };
    },
    productServiceDetailsById(state, action) {
      return {
        ...state,
        currentProductService: action.payload,
        loadingProductService: false,
      };
    },
    productServiceListUpdated(state, action) {
      return {
        ...state,
        productServicesList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        // loadingProductService: true,
        loadingProductServiceList: false,
      };
    },
    productServiceSearchParameterUpdate(state, action) {
      return {
        ...state,
        sortingParams: { ...action.payload },
        loadingProductServiceList: false,
      };
    },
    loadingOnProductServiceSubmit(state) {
      return {
        ...state,
        loadingProductService: true,
      };
    },
    loadingProductServicesList(state) {
      return {
        ...state,
        loadingProductServiceList: true,
      };
    },
    loadingOnChangeProductServicePassword(state, action) {
      return {
        ...state,
        loadingChangePassword: true,
      };
    },
    productServicePasswordUpdated(state, action) {
      return {
        ...state,
        loadingChangePassword: false,
      };
    },
    productServiceByID(state, action) {
      return {
        ...state,
        productServices: action.payload,
      };
    },
    productServicesListAll(state, action) {
      return {
        ...state,
        productServicesListAll: action.payload,
      };
    },
  },
});

export const {
  productServiceCreated,
  resetProductService,
  loadProductServicePage,
  productServiceUpdated,
  productServiceError,
  productServiceDeleted,
  productServiceDetailsById,
  productServiceListUpdated,
  productServiceSearchParameterUpdate,
  loadingOnProductServiceSubmit,
  loadingProductServicesList,
  loadingOnChangeProductServicePassword,
  productServicePasswordUpdated,
  productServiceByID,
  productServicesListAll,
} = productServiceSlice.actions;
export default productServiceSlice.reducer;
