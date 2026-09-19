import axios from "axios";
import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { logout } from "./auth";

import {
  serviceCreated,
  resetService,
  loadServicePage,
  serviceUpdated,
  serviceDeleted,
  serviceError,
  serviceDetailsById,
  serviceListUpdated,
  serviceSearchParameterUpdate,
  loadingOnServiceSubmit,
  loadingServicesList,
  loadingOnChangeServicePassword,
  servicePasswordUpdated,
  servicesListAll,
} from "@reducers/serviceReducer";
import { removeErrors } from "@reducers/errors";

export const getServicesList = (serviceParams) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const query = serviceParams.query ? serviceParams.query : "";
    serviceParams.query = query;
    config.params = serviceParams;

    dispatch(loadingServicesList());

    const res = await axios.get("/api/admin/services/list", config);

    dispatch(serviceSearchParameterUpdate(serviceParams));
    dispatch(serviceListUpdated(res.data.response[0]));
  } catch (err) {
    console.error(err.response);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          serviceError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// get Service by id
export const getServiceById = (service_id) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnServiceSubmit());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(`/api/admin/services/${service_id}`, config);

    dispatch(serviceDetailsById(res.data.response));
    return res.data ? res.data.response : { status: false };
  } catch (err) {
    // console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          serviceError({
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

    dispatch(loadingOnServiceSubmit());

    const res = await axios.post("/api/admin/services", formData, config);

    if (res.data.status === true) {
      dispatch(serviceCreated(res.data.response));
      dispatch(setAlert("Service Created.", "success"));
      navigate(`/admin/services`);
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(serviceError());
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
          serviceError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Edit Service
export const editService =
  (formData, navigate, service_id) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/services/${service_id}`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(serviceUpdated(res.data.response));
        dispatch(setAlert("Service Updated.", "success"));
        navigate("/admin/services");
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(serviceError());
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
            serviceError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

// Delete Service
export const deleteService = (service_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.delete(`/api/admin/services/${service_id}`, config);

    dispatch(serviceDeleted(service_id));
    dispatch(setAlert("Service deleted", "success"));
  } catch (err) {
    // console.log(err);
    err.response &&
      dispatch(
        serviceError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
  }
};

export const saveServiceClientAccess =
  (formData, service_id) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/services/${service_id}/client-access`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(serviceUpdated(res.data.response));
        dispatch(setAlert("Client Access Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(serviceError());
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
            serviceError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

export const changeServicePassword =
  (service_id, formData) => async (dispatch) => {
    dispatch(removeErrors());
    dispatch(loadingOnChangeServicePassword());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.put(
        `/api/admin/services/${service_id}/update-password`,
        formData,
        config
      );
      if (res.data.status === true) {
        const { token, service } = res.data.response;
        dispatch(servicePasswordUpdated(service));

        dispatch(setAlert("Password Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(serviceError());
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
            serviceError({
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

export const getServicesListAll = () => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const res = await axios.get("/api/admin/services/list-all", config);

    dispatch(servicesListAll(res.data.response));

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
  navigate("/admin/services");
};

// page not found
export const notFound = (navigate) => async (dispatch) => {
  navigate("/admin/page-not-found");
};

// reset errors
export const removeServiceErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetService());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(serviceError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.param));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadServicePage());
};
