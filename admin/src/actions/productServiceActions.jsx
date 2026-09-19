import axios from "axios";
import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { logout } from "./auth";

import {
  productServiceCreated,
  resetProductService,
  loadProductServicePage,
  productServiceUpdated,
  productServiceDeleted,
  productServiceError,
  productServiceDetailsById,
  productServiceListUpdated,
  productServiceSearchParameterUpdate,
  loadingOnProductServiceSubmit,
  loadingProductServicesList,
  loadingOnChangeProductServicePassword,
  productServicePasswordUpdated,
  productServiceByID,
  productServicesListAll,
} from "@reducers/productServiceReducer";
import { removeErrors } from "@reducers/errors";

export const getProductServicesList =
  (productServiceParams) => async (dispatch) => {
    try {
      const config = {
        "Content-Type": "application/json",
      };

      const query = productServiceParams.query
        ? productServiceParams.query
        : "";
      productServiceParams.query = query;
      config.params = productServiceParams;

      dispatch(loadingProductServicesList());

      const res = await axios.get("/api/admin/product-services/list", config);

      dispatch(productServiceSearchParameterUpdate(productServiceParams));
      dispatch(productServiceListUpdated(res.data.response[0]));
    } catch (err) {
      console.error(err.response);
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        err.response &&
          dispatch(
            productServiceError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

// get ProductService by id
export const getProductServiceById =
  (productService_id) => async (dispatch) => {
    dispatch(removeErrors());
    dispatch(loadingOnProductServiceSubmit());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(
        `/api/admin/product-services/${productService_id}`,
        config
      );

      dispatch(productServiceDetailsById(res.data.response));
      return res.data ? res.data.response : { status: false };
    } catch (err) {
      // console.log(err);
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        err.response &&
          dispatch(
            productServiceError({
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

    dispatch(loadingOnProductServiceSubmit());

    const res = await axios.post(
      "/api/admin/product-services",
      formData,
      config
    );

    if (res.data.status === true) {
      dispatch(productServiceCreated(res.data.response));
      dispatch(setAlert("ProductService Created.", "success"));
      navigate(`/admin/product-services`);
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(productServiceError());
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
          productServiceError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Edit ProductService
export const editProductService =
  (formData, navigate, productService_id) => async (dispatch) => {
    dispatch(removeErrors());
    dispatch(loadingOnProductServiceSubmit());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/product-services/${productService_id}`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(productServiceUpdated(res.data.response));
        dispatch(setAlert("ProductService Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(productServiceError());
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
            productServiceError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

// Delete ProductService
export const deleteProductService = (productService_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.delete(
      `/api/admin/product-services/${productService_id}`,
      config
    );

    dispatch(productServiceDeleted(productService_id));
    dispatch(setAlert("ProductService deleted", "success"));
  } catch (err) {
    // console.log(err);
    err.response &&
      dispatch(
        productServiceError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
  }
};

export const saveProductServiceClientAccess =
  (formData, productService_id) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/product-services/${productService_id}/client-access`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(productServiceUpdated(res.data.response));
        dispatch(setAlert("Client Access Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(productServiceError());
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
            productServiceError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

export const changeProductServicePassword =
  (productService_id, formData) => async (dispatch) => {
    dispatch(removeErrors());
    dispatch(loadingOnChangeProductServicePassword());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.put(
        `/api/admin/product-services/${productService_id}/update-password`,
        formData,
        config
      );
      if (res.data.status === true) {
        const { token, productService } = res.data.response;
        dispatch(productServicePasswordUpdated(productService));

        dispatch(setAlert("Password Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(productServiceError());
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
            productServiceError({
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

export const getProductServicesByID = (product_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(
      `/api/admin/product-services/${product_id}/list`,
      config
    );

    console.log("res.data?.response", res.data?.response);
    dispatch(productServiceByID(res.data?.response));

    return res?.data ? res.data : { status: false };
  } catch (err) {
    // console.log(err);
    err.response &&
      dispatch(
        productServiceError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
  }
};

export const getProductServicesListAll = () => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const res = await axios.get("/api/admin/product-services/list-all", config);

    dispatch(productServicesListAll(res.data.response));

    return res ? res.data : { status: false };
  } catch (err) {
    console.error(err.response);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    }
  }
};

// Delete Physician
export const cancelSave = (navigate) => async (dispatch) => {
  dispatch(removeErrors());
  navigate("/admin/product-services");
};

// page not found
export const notFound = (navigate) => async (dispatch) => {
  navigate("/admin/page-not-found");
};

// reset errors
export const removeProductServiceErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetProductService());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(productServiceError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.param));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadProductServicePage());
};
