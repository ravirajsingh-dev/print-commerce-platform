import axios from "axios";

import { usersListUpdated } from "@reducers/commonReducer";
import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { logout } from "./auth";

export const getUsersList = () => async (dispatch) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const res = await axios.get(`/api/common/users-list`, config);

    dispatch(usersListUpdated(res.data.response));
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    }
  }
};

// Generate QR Code With Amount
export const deductMoneyFromWallet = (user_id, data) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(
      `/api/common/${user_id}/deduct-money`,
      data,
      config
    );

    if (res.data.status === true) {
      dispatch(setAlert(res.data.message, "success"));
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
    return { status: false };
  }
};

export const setCommonAlert = (message, type) => (dispatch) => {
  dispatch(setAlert(message, type));
};
