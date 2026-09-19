import axios from "axios";

import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { removeErrors } from "@reducers/errors";
import { logout } from "./auth";

import {
  complaintCreated,
  resetComplaint,
  loadComplaintPage,
  complaintUpdated,
  complaintError,
  complaintDeleted,
  complaintDetailsById,
  complaintListUpdated,
  complaintSearchParameterUpdate,
  loadingOnComplaintSubmit,
  loadingComplaintsList,
  complaintStatusUpdated,
} from "@reducers/complaintReducer";

export const getComplaintsList =
  (complaintParams, user_id) => async (dispatch) => {
    try {
      const config = {
        "Content-Type": "application/json",
      };

      const query = complaintParams.query ? complaintParams.query : "";
      complaintParams.query = query;
      config.params = complaintParams;

      dispatch(loadingComplaintsList());

      const res = await axios.get(`/api/admin/complaints`, config);

      dispatch(complaintSearchParameterUpdate(complaintParams));
      dispatch(complaintListUpdated(res.data.response[0]));
    } catch (err) {
      console.error(err.response);
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        err.response &&
          dispatch(
            complaintError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

// Get User UPI by id
export const getComplaintById = (complaint_id) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnComplaintSubmit());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(
      `/api/admin/complaints/${complaint_id}`,
      config
    );

    dispatch(complaintDetailsById(res.data.response));
    return res.data ? res.data.response : { status: false };
  } catch (err) {
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          complaintError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const save = (formData, complaint_id, navigate) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    dispatch(loadingOnComplaintSubmit());

    let res = null;
    if (complaint_id) {
      res = await axios.put(
        `/api/admin/complaints/${complaint_id}`,
        formData,
        config
      );
    } else {
      res = await axios.post(`/api/admin/complaints`, formData, config);
    }

    if (res.data.status === true) {
      navigate(`/admin/complaints`);
      dispatch(complaintCreated(res.data.response));
      dispatch(setAlert("Complaint Created.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(complaintError());
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
        dispatch(complaintError());
        dispatch(setAlert(err.response.data.message, "danger"));

        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
  }
};

export const updateComplaintStatus =
  (complaint_id, navigate) => async (dispatch) => {
    try {
      const config = {
        "Content-Type": "application/json",
      };

      let res = null;

      res = await axios.put(
        `/api/admin/complaints/${complaint_id}/update-status`,
        {},
        config
      );

      if (res.data.status === true) {
        navigate(`/admin/complaints`);
        dispatch(setAlert("Status Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(complaintError());
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
          dispatch(complaintError());
          dispatch(setAlert(err.response.data.message, "danger"));

          errors.forEach((error) => {
            dispatch(setErrorsList(error.msg, error.path));
          });
        }
      }
    }
  };

// Delete User UPI
export const deleteComplaint = (complaint_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios.delete(`/api/admin/complaints/${complaint_id}`, config);

    dispatch(complaintDeleted(complaint_id));
    dispatch(setAlert("User UPI deleted", "success"));
  } catch (err) {
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      let errors = err.response.data.errors;

      if (errors) {
        dispatch(complaintError());
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
export const removeComplaintErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetComplaint());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(complaintError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.path));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadComplaintPage());
};
