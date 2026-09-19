import { createSlice } from "@reduxjs/toolkit";
import * as Constants from "../constants/index";

const initialState = {
  ordersList: {
    page: 1,
    data: [],
    count: 0,
  },
  currentOrder: null,
  loadingOrderList: true,
  loadingOrder: false,
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

const orderSlice = createSlice({
  name: "orders",
  initialState: initialState,
  reducers: {
    orderCreated(state) {
      return {
        ...state,
        loadingOrder: false,
      };
    },
    resetOrder(state) {
      return {
        ...initialState,
      };
    },
    loadOrderPage(state) {
      return {
        ...state,
        loadingOrder: false,
      };
    },
    orderUpdated(state, action) {
      return {
        ...state,
        currentOrder: action.payload,
        sortingParams: initialState.sortingParams,
        loadingOrder: false,
      };
    },
    orderError(state, action) {
      return {
        ...state,
        error: action.payload,
        loadingOrder: false,
        loadingOrderList: false,
      };
    },
    orderDeleted(state, action) {
      const currentCount = state.ordersList.count;
      const currentLimit = state.sortingParams.limit;
      const currentPage = parseInt(state.ordersList.page);
      const remainingPages = Math.ceil((currentCount - 1) / currentLimit);
      return {
        ...state,
        ordersList: {
          data: state.ordersList.data.filter(
            (order) => order._id !== action.payload
          ),
          count: currentCount - 1,
          page:
            currentPage <= remainingPages
              ? currentPage.toString()
              : remainingPages.toString(),
        },
        sortingParams: initialState.sortingParams,
        loadingOrderList: false,
      };
    },
    orderDetailsById(state, action) {
      return {
        ...state,
        currentOrder: action.payload,
        loadingOrder: false,
      };
    },
    orderListUpdated(state, action) {
      return {
        ...state,
        ordersList: {
          data: action.payload.data,
          page: action.payload.metadata[0].current_page,
          count: action.payload.metadata[0].totalRecord,
        },
        // loadingOrder: true,
        loadingOrderList: false,
      };
    },
    orderSearchParameterUpdate(state, action) {
      return {
        ...state,
        sortingParams: { ...action.payload },
        loadingOrderList: false,
      };
    },
    loadingOnOrderSubmit(state) {
      return {
        ...state,
        loadingOrder: true,
      };
    },
    loadingOrdersList(state) {
      return {
        ...state,
        loadingOrderList: true,
      };
    },
    loadingOnChangeOrderPassword(state, action) {
      return {
        ...state,
        loadingChangePassword: true,
      };
    },
    orderPasswordUpdated(state, action) {
      return {
        ...state,
        loadingChangePassword: false,
      };
    },
    orderStatusUpdated(state, action) {
      return {
        ...state,
        ordersList: {
          ...state.ordersList,
          data: state.ordersList.data.map((order) =>
            order._id === action.payload._id
              ? { ...order, status: action.payload.status }
              : order
          ),
        },
      };
    },
  },
});

export const {
  orderCreated,
  resetOrder,
  loadOrderPage,
  orderUpdated,
  orderError,
  orderDeleted,
  orderDetailsById,
  orderListUpdated,
  orderSearchParameterUpdate,
  loadingOnOrderSubmit,
  loadingOrdersList,
  loadingOnChangeOrderPassword,
  orderPasswordUpdated,
  orderStatusUpdated,
} = orderSlice.actions;
export default orderSlice.reducer;
