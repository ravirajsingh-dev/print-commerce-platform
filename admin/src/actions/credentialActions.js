import axios from "axios";

import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { removeErrors } from "@reducers/errors";
import { logout } from "./auth";

import {
  credentialCreated,
  resetCredential,
  loadCredentialPage,
  credentialUpdated,
  credentialError,
  credentialDeleted,
  credentialDetailsById,
  credentialListUpdated,
  credentialSearchParameterUpdate,
  loadingOnCredentialSubmit,
  loadingCredentialsList,
  credentialStatusUpdated,
} from "@reducers/credentialsReducer";

export const getCredentialsList =
  (credentialParams, user_id) => async (dispatch) => {
    try {
      const config = {
        "Content-Type": "application/json",
      };

      const query = credentialParams.query ? credentialParams.query : "";
      credentialParams.query = query;
      config.params = credentialParams;

      dispatch(loadingCredentialsList());

      const res = await axios.get(`/api/admin/credentials`, config);

      dispatch(credentialSearchParameterUpdate(credentialParams));
      dispatch(credentialListUpdated(res.data.response[0]));
    } catch (err) {
      console.error(err.response);
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        err.response &&
          dispatch(
            credentialError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

// Get User UPI by id
export const getCredentialById = (credential_id) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnCredentialSubmit());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(
      `/api/admin/credentials/${credential_id}`,
      config
    );

    dispatch(credentialDetailsById(res.data.response));
    return res.data ? res.data.response : { status: false };
  } catch (err) {
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          credentialError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const save = (formData, credential_id, navigate) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    dispatch(loadingOnCredentialSubmit());

    let res = null;
    if (credential_id) {
      res = await axios.put(
        `/api/admin/credentials/${credential_id}`,
        formData,
        config
      );
    } else {
      res = await axios.post(`/api/admin/credentials`, formData, config);
    }

    if (res.data.status === true) {
      navigate(`/admin/credentials`);
      dispatch(credentialCreated(res.data.response));
      dispatch(setAlert("Credential Created.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(credentialError());
        dispatch(setAlert(res.data.message, "danger"));

        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
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
        dispatch(credentialError());
        dispatch(setAlert(err.response.data.message, "danger"));

        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
  }
};

// Delete User UPI
export const deleteCredential = (credential_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios.delete(`/api/admin/credentials/${credential_id}`, config);

    dispatch(credentialDeleted(credential_id));
    dispatch(setAlert("User UPI deleted", "success"));
  } catch (err) {
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      let errors = err.response.data.errors;

      if (errors) {
        dispatch(credentialError());
        dispatch(setAlert(err.response.data.message, "danger"));

        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
  }
};

export const cancelSave = (navigate) => async (dispatch) => {
  dispatch(removeErrors());
  navigate("/admin/user-upis");
};

// Reset errors
export const removeCredentialErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetCredential());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(credentialError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.path));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadCredentialPage());
};
