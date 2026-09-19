import axios from "axios";
import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { logout } from "./auth";

import {
  orderCreated,
  resetOrder,
  loadOrderPage,
  orderUpdated,
  orderDeleted,
  orderError,
  orderDetailsById,
  orderListUpdated,
  orderSearchParameterUpdate,
  loadingOnOrderSubmit,
  loadingOrdersList,
  loadingOnChangeOrderPassword,
  orderPasswordUpdated,
  orderStatusUpdated,
} from "@reducers/orderReducer";
import { removeErrors } from "@reducers/errors";

export const getOrdersList =
  (orderParams, isLoading = true) =>
  async (dispatch) => {
    try {
      const config = {
        "Content-Type": "application/json",
      };

      const query = orderParams.query ? orderParams.query : "";
      orderParams.query = query;
      config.params = orderParams;

      if (isLoading) {
        dispatch(loadingOrdersList());
      }

      const res = await axios.get("/api/admin/orders/list", config);

      dispatch(orderSearchParameterUpdate(orderParams));
      dispatch(orderListUpdated(res.data.response[0]));
    } catch (err) {
      console.error(err.response);
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        err.response &&
          dispatch(
            orderError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

// get Order by id
export const getOrderById = (order_id) => async (dispatch) => {
  dispatch(removeErrors());

  dispatch(loadingOnOrderSubmit());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(`/api/admin/orders/${order_id}`, config);

    dispatch(orderDetailsById(res.data.response));
    return res.data ? res.data.response : { status: false };
  } catch (err) {
    // console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          orderError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const create = (formData, navigate) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    dispatch(loadingOnOrderSubmit());

    const res = await axios.post("/api/admin/orders", formData, config);
    if (res.data.status === true) {
      dispatch(orderCreated(res.data.response));
      dispatch(setAlert("Order Created.", "success"));
      navigate(`/admin/orders`);
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(orderError());
        dispatch(setAlert(res.data.message, "danger"));

        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.error(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          orderError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Edit Order
export const editOrder = (formData, navigate, order_id) => async (dispatch) => {
  dispatch(removeErrors());

  dispatch(loadingOnOrderSubmit());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(
      `/api/admin/orders/${order_id}`,
      formData,
      config
    );
    if (res.data.status === true) {
      navigate("/admin/orders");
      dispatch(orderUpdated(res.data.response));
      dispatch(setAlert("Order Updated.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(orderError());
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
          orderError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Delete Order
export const deleteOrder = (order_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.delete(`/api/admin/orders/${order_id}`, config);

    dispatch(orderDeleted(order_id));
    dispatch(setAlert("Order deleted", "success"));
  } catch (err) {
    // console.log(err);
    err.response &&
      dispatch(
        orderError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
  }
};

export const updateOrderStatusByID =
  (order_id, formData) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/orders/${order_id}/update-status`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(
          orderStatusUpdated({
            _id: order_id,
            status: formData?.status,
          })
        );
        dispatch(setAlert("Order Status Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(orderError());
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
            orderError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response?.data?.message, "danger"));
      }
    }
  };

export const changeOrderPassword = (order_id, formData) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnChangeOrderPassword());
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.put(
      `/api/admin/orders/${order_id}/update-password`,
      formData,
      config
    );
    if (res.data.status === true) {
      const { token, order } = res.data.response;
      dispatch(orderPasswordUpdated(order));

      dispatch(setAlert("Password Updated.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(orderError());
        dispatch(setAlert(res.data.message, "danger"));

        errors.length &&
          errors.forEach((error) => {
            dispatch(setErrorsList(error.msg, error.param));
          });
      }
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    // console.log(err);
    if (err.response) {
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        dispatch(
          orderError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );
        dispatch(
          setAlert(
            err.response.data.message || err.response.statusText,
            "danger"
          )
        );
      }
    }
  }
};

// Delete Physician
export const cancelSave = (navigate) => async (dispatch) => {
  dispatch(removeErrors());
  navigate("/admin/orders");
};

// page not found
export const notFound = (navigate) => async (dispatch) => {
  navigate("/admin/page-not-found");
};

// reset errors
export const removeOrderErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetOrder());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(orderError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.param));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadOrderPage());
};
