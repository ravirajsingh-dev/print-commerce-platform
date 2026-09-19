import axios from "axios";
import { setAlert } from "./alertActions";
import { setErrorsList } from "./errorActions";
import { removeErrors } from "@src/reducers/errorReducer";
import { logout } from "./authActions";

import {
  currentBalanceUpdated,
  transactionsUpdated,
  walletError,
  loadingCurrentBalance,
  loadingTransactions,
  loadingOnWalletRequestSubmit,
  walletRequestCreated,
  walletRequestListUpdated,
  loadingWalletRequestList,
} from "@src/reducers/walletReducer";

// Fetch Current Wallet Balance
export const fetchCurrentBalance = (user_id) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingCurrentBalance());
  try {
    const res = await axios.get(`/api/wallet/${user_id}/balance`);
    if (res.data.status === true) {
      dispatch(currentBalanceUpdated(res.data.response));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(walletError());
        dispatch(setAlert(res.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.error("Error fetching current balance:", err);
    if (
      err.response &&
      err.response.data &&
      err.response.data.tokenStatus === 0
    ) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          walletError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );
      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Fetch Wallet Transactions
export const fetchWalletTransactions =
  (user_id, params) => async (dispatch) => {
    try {
      dispatch(removeErrors());
      dispatch(loadingTransactions());

      const config = {
        "Content-Type": "application/json",
      };

      const query = params.query ? params.query : "";
      params.query = query;
      config.params = params;

      const res = await axios.get(
        `/api/wallet/${user_id}/transactions`,
        config
      );
      if (res.data.status === true) {
        dispatch(transactionsUpdated(res.data.response[0]));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(walletError());
          dispatch(setAlert(res.data.message, "danger"));
          errors.forEach((error) => {
            dispatch(setErrorsList(error.msg, error.param));
          });
        }
      }
      return res.data ? res.data : { status: false };
    } catch (err) {
      console.error("Error fetching wallet transactions:", err);
      if (
        err.response &&
        err.response.data &&
        err.response.data.tokenStatus === 0
      ) {
        dispatch(logout());
      } else {
        err.response &&
          dispatch(
            walletError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );
        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

export const fetchWalletRequests = (user_id, params) => async (dispatch) => {
  try {
    dispatch(removeErrors());
    dispatch(loadingWalletRequestList());

    const config = {
      "Content-Type": "application/json",
    };

    const query = params.query ? params.query : "";
    params.query = query;
    config.params = params;

    const res = await axios.get(`/api/wallet/${user_id}/requests`, config);
    if (res.data.status === true) {
      dispatch(walletRequestListUpdated(res.data.response[0]));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(walletError());
        dispatch(setAlert(res.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.error("Error fetching wallet transactions:", err);
    if (
      err.response &&
      err.response.data &&
      err.response.data.tokenStatus === 0
    ) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          walletError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );
      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const createWalletRechargeRequest =
  (user_id, formData, navigate) => async (dispatch) => {
    try {
      const config = {
        "Content-Type": "application/json",
      };

      dispatch(loadingOnWalletRequestSubmit());

      let res = await axios.post(
        `/api/wallet/${user_id}/create`,
        formData,
        config
      );

      if (res.data.status === true) {
        navigate(`/user/wallet`);
        dispatch(walletRequestCreated(res.data.response));
        dispatch(setAlert(res.data.message, "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(setAlert(res.data.message, "danger"));

          errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger"));

            dispatch(setErrorsList(error.msg, error.param));
          });
        }
      }
      return res.data ? res.data : { status: false };
    } catch (err) {
      console.error("err", err);
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

// Reset Wallet Errors
export const removeWalletErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(walletError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.param));
    });
  }
};
