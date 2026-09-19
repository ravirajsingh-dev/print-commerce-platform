import axios from "axios";
import { saveAs } from "file-saver";
import { removeAlert, setAlert } from "./alertActions";
import { setErrorsList } from "./errorActions";
import { logout } from "./authActions";
import { removeErrors } from "@src/reducers/errorReducer";

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
  ordersListAllUpdated,
  loadingOnOrderTracking,
  orderTrackUpdated,
  loadingOnInvoice,
  orderInvoiceUpdated,
} from "@reducers/orderReducer";

export const getOrdersList = (orderParams) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const query = orderParams.query ? orderParams.query : "";
    orderParams.query = query;
    config.params = orderParams;

    dispatch(loadingOrdersList());

    const res = await axios.get("/api/user/orders/list", config);

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
    const res = await axios.get(`/api/user/orders/${order_id}`, config);

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

    const res = await axios.post("/api/user/orders", formData, config);
    if (res.data.status === true) {
      dispatch(orderCreated(res.data.response));
      dispatch(setAlert("Order Created.", "success"));
      navigate(`/user/orders`);
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
            msg: err.response?.statusText,
            status: err.response?.status,
          })
        );

      dispatch(setAlert(err.response?.data?.message, "danger"));
    }
  }
};

// // Edit Order
// export const editOrder = (formData, navigate, order_id) => async (dispatch) => {
//   dispatch(removeErrors());
//   try {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };
//     const res = await axios.put(
//       `/api/user/orders/${order_id}`,
//       formData,
//       config
//     );
//     if (res.data.status === true) {
//       dispatch(orderUpdated(res.data.response));
//       dispatch(setAlert("Order Updated.", "success"));
//     } else {
//       const errors = res.data.errors;
//       if (errors) {
//         dispatch(orderError());
//         dispatch(setAlert(res.data.message, "danger"));

//         errors.forEach((error) => {
//           dispatch(setErrorsList(error.msg, error.param));
//         });
//       }
//     }
//     return res.data ? res.data : { status: false };
//   } catch (err) {
//     // console.log(err);
//     if (err.response.data && err.response.data.tokenStatus === 0) {
//       dispatch(logout());
//     } else {
//       err.response &&
//         dispatch(
//           orderError({
//             msg: err.response.statusText,
//             status: err.response.status,
//           })
//         );

//       dispatch(setAlert(err.response.message, "danger"));
//     }
//   }
// };

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
        `/api/user/orders/${order_id}/update-status`,
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

export const getOrdersListAll = () => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const res = await axios.get("/api/user/orders/list-all", config);

    dispatch(ordersListAllUpdated(res.data.response));

    return res ? res.data : { status: false };
  } catch (err) {
    console.error(err.response);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const trackOrderByID = (order_id) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    dispatch(loadingOnOrderTracking());

    const res = await axios.get(
      `/api/user/orders/${order_id}/track-order`,
      config
    );

    dispatch(orderTrackUpdated(res.data.response));

    return res ? res.data : { status: false };
  } catch (err) {
    console.error(err.response);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const getInvoiceByID = (order_id, orderID) => async (dispatch) => {
  try {
    const config = {
      responseType: "blob",
    };

    dispatch(loadingOnInvoice());

    const res = await axios.get(
      `/api/user/orders/${order_id}/generate-invoice`,
      config
    );

    // Extract filename from headers or fallback
    const contentDisposition = res.headers["content-disposition"];
    let fileName = `invoice_${orderID}.pdf`;

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }

    const pdfBlob = new Blob([res.data], { type: "application/pdf" });

    // Trigger the download
    saveAs(pdfBlob, fileName);

    dispatch(orderInvoiceUpdated());

    return { status: true };
  } catch (err) {
    console.error(err.response);
    if (err.response?.data?.tokenStatus === 0) {
      dispatch(logout());
    } else {
      dispatch(
        setAlert(err.response?.message || "Error downloading invoice", "danger")
      );
    }
  }
};

export const cancelSave = (navigate) => async (dispatch) => {
  dispatch(removeErrors());
  navigate("/");
};

// reset errors
export const removeOrderErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetOrder());
  await dispatch(removeErrors());
  await dispatch(removeAlert());
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
  await dispatch(removeErrors());
};
