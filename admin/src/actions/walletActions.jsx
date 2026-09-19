import axios from "axios";
import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { logout } from "./auth";

import {
  resetWalletRequest,
  loadWalletRequestPage,
  walletRequestUpdated,
  walletRequestError,
  walletRequestDetailsById,
  walletRequestListUpdated,
  walletRequestSearchParameterUpdate,
  loadingOnWalletRequestSubmit,
  loadingWalletRequestsList,
  walletRequestStatusUpdated,
} from "@reducers/walletReducer";

import { removeErrors } from "@reducers/errors";

export const getWalletRequestsList =
  (walletRequestParams) => async (dispatch) => {
    try {
      const config = {
        "Content-Type": "application/json",
      };

      const query = walletRequestParams.query ? walletRequestParams.query : "";
      walletRequestParams.query = query;
      config.params = walletRequestParams;

      dispatch(loadingWalletRequestsList());

      const res = await axios.get("/api/admin/wallet/request", config);

      dispatch(walletRequestSearchParameterUpdate(walletRequestParams));
      dispatch(walletRequestListUpdated(res.data.response[0]));
    } catch (err) {
      console.error(err.response);
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        err.response &&
          dispatch(
            walletRequestError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

// get User by id
export const getWalletRequestById = (wallet_request_id) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnWalletRequestSubmit());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(
      `/api/admin/wallet/request/${wallet_request_id}`,
      config
    );

    dispatch(walletRequestDetailsById(res.data.response));
    return res.data ? res.data.response : { status: false };
  } catch (err) {
    // console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          walletRequestError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Edit User
export const editWalletRequest =
  (formData, navigate, wallet_request_id) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/wallet/request/${wallet_request_id}`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(walletRequestUpdated(res.data.response));
        dispatch(setAlert("User Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(walletRequestError());
          dispatch(setAlert(res.data.message, "danger"));

          errors.forEach((error) => {
            dispatch(setErrorsList(error.msg, error.param));
          });
        }
      }
      return res.data ? res.data : { status: false };
    } catch (err) {
      // console.log(err);
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        err.response &&
          dispatch(
            walletRequestError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

export const updateWalletRequestStatusByID =
  (wallet_request_id, formData) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/wallet/request/${wallet_request_id}/update-status`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(
          walletRequestStatusUpdated({
            _id: wallet_request_id,
            status: formData?.status,
          })
        );
        dispatch(setAlert("Wallet Request Status Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(walletRequestError());
          dispatch(setAlert(res.data.message, "danger"));

          errors.forEach((error) => {
            dispatch(setErrorsList(error.msg, error.param));
          });
        }
      }
      return res.data ? res.data : { status: false };
    } catch (err) {
      console.log(err);
      if (err.response?.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        err.response &&
          dispatch(
            walletRequestError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response?.data?.message, "danger"));
      }
    }
  };

// Delete Physician
export const cancelSave = (navigate) => async (dispatch) => {
  dispatch(removeErrors());
  navigate("/admin/wallet-request");
};

// page not found
export const notFound = (navigate) => async (dispatch) => {
  navigate("/admin/page-not-found");
};

// reset errors
export const removeWalletRequestErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetWalletRequest());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(walletRequestError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.param));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadWalletRequestPage());
};
