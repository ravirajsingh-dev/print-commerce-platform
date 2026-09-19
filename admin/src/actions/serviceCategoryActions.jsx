import axios from "axios";
import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { logout } from "./auth";

import {
  serviceCatCreated,
  resetServiceCat,
  loadServiceCatPage,
  serviceCatUpdated,
  serviceCatDeleted,
  serviceCatError,
  serviceCatDetailsById,
  serviceCatListUpdated,
  serviceCatSearchParameterUpdate,
  loadingOnServiceCatSubmit,
  loadingServiceCatsList,
  loadingOnChangeServiceCatPassword,
  serviceCatPasswordUpdated,
  serviceCatsListAll,
} from "@reducers/serviceCatReducer";
import { removeErrors } from "@reducers/errors";

export const getServiceCatsList = (serviceCatParams) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const query = serviceCatParams.query ? serviceCatParams.query : "";
    serviceCatParams.query = query;
    config.params = serviceCatParams;

    dispatch(loadingServiceCatsList());

    const res = await axios.get("/api/admin/service-categories/list", config);

    dispatch(serviceCatSearchParameterUpdate(serviceCatParams));
    dispatch(serviceCatListUpdated(res.data.response[0]));
  } catch (err) {
    console.error(err.response);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          serviceCatError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// get ServiceCat by id
export const getServiceCatById = (serviceCat_id) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnServiceCatSubmit());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(
      `/api/admin/service-categories/${serviceCat_id}`,
      config
    );

    dispatch(serviceCatDetailsById(res.data.response));
    return res.data ? res.data.response : { status: false };
  } catch (err) {
    // console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          serviceCatError({
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

    dispatch(loadingOnServiceCatSubmit());

    const res = await axios.post(
      "/api/admin/service-categories",
      formData,
      config
    );

    if (res.data.status === true) {
      dispatch(serviceCatCreated(res.data.response));
      dispatch(setAlert("ServiceCat Created.", "success"));
      navigate(`/admin/service-categories`);
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(serviceCatError());
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
          serviceCatError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Edit ServiceCat
export const editServiceCat =
  (formData, navigate, serviceCat_id) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/service-categories/${serviceCat_id}`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(serviceCatUpdated(res.data.response));
        dispatch(setAlert("ServiceCat Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(serviceCatError());
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
            serviceCatError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

// Delete ServiceCat
export const deleteServiceCat = (serviceCat_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.delete(
      `/api/admin/service-categories/${serviceCat_id}`,
      config
    );

    dispatch(serviceCatDeleted(serviceCat_id));
    dispatch(setAlert("ServiceCat deleted", "success"));
  } catch (err) {
    // console.log(err);
    err.response &&
      dispatch(
        serviceCatError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
  }
};

export const saveServiceCatClientAccess =
  (formData, serviceCat_id) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/service-categories/${serviceCat_id}/client-access`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(serviceCatUpdated(res.data.response));
        dispatch(setAlert("Client Access Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(serviceCatError());
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
            serviceCatError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

export const changeServiceCatPassword =
  (serviceCat_id, formData) => async (dispatch) => {
    dispatch(removeErrors());
    dispatch(loadingOnChangeServiceCatPassword());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.put(
        `/api/admin/service-categories/${serviceCat_id}/update-password`,
        formData,
        config
      );
      if (res.data.status === true) {
        const { token, serviceCat } = res.data.response;
        dispatch(serviceCatPasswordUpdated(serviceCat));

        dispatch(setAlert("Password Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(serviceCatError());
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
            serviceCatError({
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

export const getServiceCatsListAll = () => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const res = await axios.get(
      "/api/admin/service-categories/list-all",
      config
    );

    dispatch(serviceCatsListAll(res.data.response));

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
  navigate("/admin/service-categories");
};

// page not found
export const notFound = (navigate) => async (dispatch) => {
  navigate("/admin/page-not-found");
};

// reset errors
export const removeServiceCatErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetServiceCat());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(serviceCatError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.param));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadServiceCatPage());
};
