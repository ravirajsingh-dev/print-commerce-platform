import axios from "axios";

import {
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
} from "@reducers/commonReducer";
import { removeErrors } from "@src/reducers/errorReducer";
import { removeAlertMsg } from "@src/reducers/alertReducer";
import { setAlert } from "./alertActions";
import { setErrorsList } from "./errorActions";

export const getServicesList = () => async (dispatch) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const res = await axios.get(`/api/common/services-list`, config);

    dispatch(servicesListUpdated(res.data.response));
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    }
  }
};

export const getProductsList = () => async (dispatch) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const res = await axios.get(`/api/common/products-list`, config);

    dispatch(productsListUpdated(res.data.response));
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    }
  }
};

export const getProductServicesListByID = (product_id) => async (dispatch) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const res = await axios.get(
      `/api/common/product-services/${product_id}/list-full`,
      config
    );

    dispatch(productServicesListUpdated(res.data.response));
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    }
  }
};

export const getProductServiceCategoriesListByID =
  (product_service_id) => async (dispatch) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };

      const res = await axios.get(
        `/api/common/services-categories/${product_service_id}`,
        config
      );

      dispatch(productServiceCategoriesListUpdated(res.data.response));
      return res.data ? res.data : { status: false };
    } catch (err) {
      console.log(err);
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      }
    }
  };

// Generate QR Code With Amount
export const generateQRCode = (upi_id, amount) => async (dispatch) => {
  dispatch(removeErrors());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    dispatch(loadingOnGenerateQRCode());

    const res = await axios.get(
      `/api/common/generate-qr/${upi_id}/${amount}`,
      config
    );

    if (res.data.status === true) {
      dispatch(generateQRCodeUpdated(res.data.response));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));

        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      let errors = err.response.data.errors;

      if (errors) {
        dispatch(setAlert(err.response.data.message, "danger"));

        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
  }
};

export const getAdminPrimeCredentials = () => async (dispatch) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const res = await axios.get(`/api/common/admin/credentials`, config);

    dispatch(adminPrimeCredentialListUpdated(res.data.response));
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    }
  }
};

export const getAdminDetails = () => async (dispatch) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const res = await axios.get(`/api/common/admin/details`, config);

    dispatch(adminDetailsUpdated(res.data.response));
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    }
  }
};

export const getBannersList = () => async (dispatch) => {
  try {
    dispatch(laodingBannersList());
    const config = { headers: { "Content-Type": "application/json" } };

    const res = await axios.get(`/api/common/banners-list`, config);

    dispatch(bannersListUpdated(res.data.response));
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    }
  }
};

export const removeAllErrors = () => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(removeAlertMsg());
};
