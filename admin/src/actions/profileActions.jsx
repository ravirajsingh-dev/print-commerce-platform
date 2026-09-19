import axios from "axios";
import { setAlert } from "@actions/alert";
import { setErrorsList } from "@actions/errors";

import { logout } from "@actions/auth";
import setAuthToken from "@utils/setAuthToken";

import {
  userProfileUpdated,
  userProfilePasswordUpdated,
  userProfileError,
  loadingOnProfileSubmit,
  loadingOnChangePassword,
  loadProfilePage,
  setProfileUploadError,
} from "@reducers/profileReducer";
import { removeErrors } from "@reducers/errors";
import { loginSucess, userLoaded } from "@reducers/auth";

export const onProfileSubmit = (formData, navigate) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnProfileSubmit());
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.put(`/api/admin/profile`, formData, config);
    if (res.data.status === true) {
      dispatch(userProfileUpdated(res.data.response));
      dispatch(userLoaded(res.data.response));
      dispatch(setAlert("Profile Updated.", "success"));
      navigate("/admin/profile");
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(userProfileError());
        dispatch(setAlert(res.data.message, "danger"));

        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    if (err.response) {
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        dispatch(
          userProfileError({
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

export const changePassword = (formData) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnChangePassword());
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.put(
      `/api/admin/profile/password`,
      formData,
      config
    );
    if (res.data.status === true) {
      console.log(res.data.response);
      const { token, user } = res.data.response;
      dispatch(userProfilePasswordUpdated(user));
      dispatch(loginSucess({ token }));
      setAuthToken(token);
      dispatch(setAlert("Password Updated.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(userProfileError());
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
          userProfileError({
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

export const saveUserProfile = (userProfile) => async (dispatch) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const res = await axios.put(
      `/api/admin/profile/upload-profile`,
      { userProfile },
      config
    );

    if (res.data.status === true) {
      dispatch(userLoaded(res.data.response));
      dispatch(setAlert("Profile Updated.", "success"));
    } else {
      const errors = res.data.errors;
      const firstError = errors.length
        ? errors[0].msg
        : res.data.message
        ? res.data.message
        : "Something Went Wrong";

      dispatch(setProfileUploadError(firstError));
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response) {
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(logout());
      } else {
        dispatch(
          setAlert(
            (err.response.data && err.response.data.message
              ? err.response.data.message
              : err.response.statusText) || "Something went wrong",
            "danger"
          )
        );
      }
    }
  }
};

export const setUserProfileUploadError = (error) => async (dispatch) => {
  dispatch(setProfileUploadError(error));
};

// cancel
export const cancelSave = (navigate) => async (dispatch) => {
  dispatch(removeErrors());
  navigate("/admin/dashboard");
};

// page not found
export const notFound = (navigate) => async (dispatch) => {
  navigate("/admin/page-not-found");
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(userProfileError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.param));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadProfilePage());
};

// reset errors
export const removeProfileErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};
