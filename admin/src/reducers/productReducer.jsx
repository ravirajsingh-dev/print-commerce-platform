import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "../constants/index";

const initialState = {
  productsList: {
    page: 1,
    data: [],
    count: 0,
  },
  currentProduct: [],
  loadingProductList: true,
  loadingProduct: false,
  error: {},
  sortingParams: {
    limit: Constants.DEFAULT_PAGE_SIZE,
    page: 1,
    productBy: "createdAt",
    ascending: "desc",
    query: "",
    isAll: 1,
  },
  loadingChangePassword: false,
  productsListAll: [],
};

const productSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    productCreated(state) {
      state.loadingProduct = false;
    },
    resetProduct(state) {
      return {
        ...initialState,
      };
    },
    loadProductPage(state) {
      return {
        ...state,
        loadingProduct: false,
      };
    },
    productUpdated(state, action) {
      return {
        ...state,
        currentProduct: action.payload,
        sortingParams: initialState.sortingParams,
        loadingProduct: false,
      };
    },
    productError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingProduct: false,
        loadingProductList: false,
      };
    },
    productDeleted(state, action) {
      const currentCount = state.productsList.count;
      const currentLimit = state.sortingParams.limit;
      const currentPage = parseInt(state.productsList.page);
      const remainingPages = Math.ceil((currentCount - 1) / currentLimit);
      return {
        ...state,
        productsList: {
          data: state.productsList.data.filter(
            (product) => product._id !== action.payload
          ),
          count: currentCount - 1,
          page:
            currentPage <= remainingPages
              ? currentPage.toString()
              : remainingPages.toString(),
        },
        sortingParams: initialState.sortingParams,
        loadingProductList: false,
      };
    },
    productDetailsById(state, action) {
      return {
        ...state,
        currentProduct: action.payload,
        loadingProduct: false,
      };
    },
    productListUpdated(state, action) {
      return {
        ...state,
        productsList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        // loadingProduct: true,
        loadingProductList: false,
      };
    },
    productSearchParameterUpdate(state, action) {
      return {
        ...state,
        sortingParams: { ...action.payload },
        loadingProductList: false,
      };
    },
    loadingOnProductSubmit(state) {
      return {
        ...state,
        loadingProduct: true,
      };
    },
    loadingProductsList(state) {
      return {
        ...state,
        loadingProductList: true,
      };
    },
    loadingOnChangeProductPassword(state, action) {
      return {
        ...state,
        loadingChangePassword: true,
      };
    },
    productPasswordUpdated(state, action) {
      return {
        ...state,
        loadingChangePassword: false,
      };
    },
    productsListAll(state, action) {
      return {
        ...state,
        productsListAll: action.payload,
      };
    },
  },
});

export const {
  productCreated,
  resetProduct,
  loadProductPage,
  productUpdated,
  productError,
  productDeleted,
  productDetailsById,
  productListUpdated,
  productSearchParameterUpdate,
  loadingOnProductSubmit,
  loadingProductsList,
  loadingOnChangeProductPassword,
  productPasswordUpdated,
  productsListAll,
} = productSlice.actions;
export default productSlice.reducer;
