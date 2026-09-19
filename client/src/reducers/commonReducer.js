import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  servicesList: [],
  productsList: [],
  productServicesList: [],
  productServiceCategoriesList: [],
  adminPrimeCredentialsList: [],
  adminDetails: {},
  adminDetailsLoading: true,
  adminPrimeCredentialsLoading: true,
  loadingGenerateQRCode: false,
  amountQRCode: "",
  bannersList: [],
  laodingBannersList: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    servicesListUpdated(state, action) {
      return {
        ...state,
        servicesList: action.payload,
      };
    },

    productsListUpdated(state, action) {
      return {
        ...state,
        productsList: action.payload,
      };
    },

    productServicesListUpdated(state, action) {
      return {
        ...state,
        productServicesList: action.payload,
      };
    },

    productServiceCategoriesListUpdated(state, action) {
      return {
        ...state,
        productServiceCategoriesList: action.payload,
      };
    },

    loadingOnGenerateQRCode(state) {
      return {
        ...state,
        loadingGenerateQRCode: true,
      };
    },

    generateQRCodeUpdated(state, action) {
      return {
        ...state,
        amountQRCode: action.payload,
        loadingGenerateQRCode: false,
      };
    },

    adminPrimeCredentialListUpdated(state, action) {
      return {
        ...state,
        adminPrimeCredentialsList: action.payload,
        adminPrimeCredentialsLoading: false,
      };
    },
    adminDetailsUpdated(state, action) {
      return {
        ...state,
        adminDetails: action.payload,
        adminDetailsLoading: false,
      };
    },
    laodingBannersList(state, action) {
      return {
        ...state,
        laodingBannersList: true,
      };
    },
    bannersListUpdated(state, action) {
      return {
        ...state,
        bannersList: action.payload,
        laodingBannersList: false,
      };
    },
  },
});

export const {
  servicesListUpdated,
  productsListUpdated,
  productServicesListUpdated,
  productServiceCategoriesListUpdated,
  loadingOnGenerateQRCode,
  generateQRCodeUpdated,
  adminPrimeCredentialListUpdated,
  adminDetailsUpdated,
  laodingBannersList,
  bannersListUpdated,
} = commonSlice.actions;
export default commonSlice.reducer;
