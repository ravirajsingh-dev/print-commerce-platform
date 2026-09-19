import axios from "axios";
import { setAlert } from "./alert";
import { logout } from "./auth";

import {
  loadingDashboardClientsList,
  dashboardClientListUpdated,
  dashboardError,
  loadingDashboardData,
  dashbaordDetailsUpdated,
  newUserStatusUpdated,
} from "@reducers/dashboardReducer";

export const getDashboardClientsList = () => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    dispatch(loadingDashboardClientsList());
    const res = await axios.get("/api/admin/dashboard/clients-list", config);

    dispatch(dashboardClientListUpdated(res.data.response[0]));
  } catch (err) {
    console.error(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          dashboardError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const getDashboardDetails =
  (isLoading = true) =>
  async (dispatch) => {
    try {
      const config = {
        "Content-Type": "application/json",
      };

      if (isLoading) {
        dispatch(loadingDashboardData());
      }
      const res = await axios.get("/api/admin/dashboard", config);

      dispatch(dashbaordDetailsUpdated(res.data.response));
    } catch (err) {
      console.error(err);
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        err.response &&
          dispatch(
            dashboardError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

export const getPastWeekOrdersData = () => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    dispatch(loadingDashboardData());
    const res = await axios.get(
      "/api/admin/dashboard/order-weekly-data",
      config
    );

    dispatch(dashbaordDetailsUpdated(res.data.response));
  } catch (err) {
    console.error(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          dashboardError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const generateOrderReport = (dateRange) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    // dispatch(loadingDashboardData());
    const res = await axios.get(
      `/api/admin/dashboard/order-report?dateRange=${JSON.stringify(
        dateRange
      )}`,
      config
    );
    return res.data ? res.data : { status: false };
    // dispatch(dashbaordDetailsUpdated(res.data.response));
  } catch (err) {
    console.error(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          dashboardError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const generateStockReport = (dateRange) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    // dispatch(loadingDashboardData());
    const res = await axios.get(
      `/api/admin/dashboard/stock-report?dateRange=${JSON.stringify(
        dateRange
      )}`,
      config
    );

    return res.data ? res.data : { status: false };

    // dispatch(dashbaordDetailsUpdated(res.data.response));
  } catch (err) {
    console.error(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          dashboardError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const updateUserByID = (user_id, status) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const res = await axios.post(
      `/api/admin/dashboard/${user_id}/user-status`,
      { status },
      config
    );

    if (res.data.status) {
      dispatch(setAlert("User status updated successfully", "success"));
      dispatch(newUserStatusUpdated({ _id: user_id, status }));
    }

    return res.data ? res.data : { status: false };
  } catch (err) {
    console.error(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          dashboardError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};
