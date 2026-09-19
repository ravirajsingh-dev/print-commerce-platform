import axios from "axios";
import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { logout } from "./auth";

import {
  productCreated,
  resetProduct,
  loadProductPage,
  productUpdated,
  productDeleted,
  productError,
  productDetailsById,
  productListUpdated,
  productSearchParameterUpdate,
  loadingOnProductSubmit,
  loadingProductsList,
  loadingOnChangeProductPassword,
  productPasswordUpdated,
  productsListAll,
} from "@reducers/productReducer";
import { removeErrors } from "@reducers/errors";

export const getProductsList = (productParams) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const query = productParams.query ? productParams.query : "";
    productParams.query = query;
    config.params = productParams;

    dispatch(loadingProductsList());

    const res = await axios.get("/api/admin/products/list", config);

    dispatch(productSearchParameterUpdate(productParams));
    dispatch(productListUpdated(res.data.response[0]));
  } catch (err) {
    console.error(err.response);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          productError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// get Product by id
export const getProductById = (product_id) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnProductSubmit());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(`/api/admin/products/${product_id}`, config);

    dispatch(productDetailsById(res.data.response));
    return res.data ? res.data.response : { status: false };
  } catch (err) {
    // console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          productError({
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
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    dispatch(loadingOnProductSubmit());

    const res = await axios.post("/api/admin/products", formData, config);

    if (res.data.status === true) {
      dispatch(productCreated(res.data.response));
      dispatch(setAlert("Product Created.", "success"));
      navigate(`/admin/products`);
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(productError());
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
          productError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Edit Product
export const editProduct =
  (formData, navigate, product_id) => async (dispatch) => {
    dispatch(removeErrors());
    dispatch(loadingOnProductSubmit());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/products/${product_id}`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(productUpdated(res.data.response));
        dispatch(setAlert("Product Updated.", "success"));
        navigate("/admin/products");
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(productError());
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
            productError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

// Delete Product
export const deleteProduct = (product_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.delete(`/api/admin/products/${product_id}`, config);

    dispatch(productDeleted(product_id));
    dispatch(setAlert("Product deleted", "success"));
  } catch (err) {
    // console.log(err);
    err.response &&
      dispatch(
        productError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
  }
};

export const saveProductClientAccess =
  (formData, product_id) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/products/${product_id}/client-access`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(productUpdated(res.data.response));
        dispatch(setAlert("Client Access Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(productError());
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
            productError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

export const changeProductPassword =
  (product_id, formData) => async (dispatch) => {
    dispatch(removeErrors());
    dispatch(loadingOnChangeProductPassword());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.put(
        `/api/admin/products/${product_id}/update-password`,
        formData,
        config
      );
      if (res.data.status === true) {
        const { token, product } = res.data.response;
        dispatch(productPasswordUpdated(product));

        dispatch(setAlert("Password Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(productError());
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
            productError({
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

export const getProductsListAll = () => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const res = await axios.get("/api/admin/products/list-all", config);

    dispatch(productsListAll(res.data.response));

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

// Delete Physician
export const cancelSave = (navigate) => async (dispatch) => {
  dispatch(removeErrors());
  navigate("/admin/products");
};

// page not found
export const notFound = (navigate) => async (dispatch) => {
  navigate("/admin/page-not-found");
};

// reset errors
export const removeProductErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetProduct());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(productError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.param));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadProductPage());
};
