import axios from "axios";
import { setAlert, removeAlert } from "./alertActions";

import { setErrorsList } from "./errorActions";
import setAuthToken from "../utils/setAuthToken";

import {
  userLoaded,
  registerSuccess,
  resetLinkSuccess,
  loginSucess,
  registerFail,
  resetLinkFail,
  authError,
  logoutAuth,
  loginFail,
  loadingOnPasswordReset,
  loadingOnLoginSubmit,
  loginOTPSend,
  sponsorUserLoaded,
  updateUserSidebarExpended,
  setLoadingOnChangePassword,
  changePasswordSuccess,
  changePasswordError,
  loadingOnProfileSubmit,
  userProfileUpdated,
  userProfileError,
  passwordUpdated,
  otpVerifiedSuccess,
  loadingOnOTPVerified,
  otpVerificationFail,
  resetAuth,
} from "src/reducers/authReducer";
import { removeErrors } from "src/reducers/errorReducer";
import { userDetailsById } from "@src/reducers/userReducer";
import { removeAlertMsg } from "@src/reducers/alertReducer";
import { getRouter } from "@src/utils/routerService";

export const login = (formData, navigate) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnLoginSubmit());
  dispatch(removeAlert());
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const res = await axios.post(`/api/auth/users`, formData, config);

    if (res.data.status === true) {
      setAuthToken(res.data.response.token);
      dispatch(loginSucess(res.data.response));

      navigate("/");
      return res.data;
    } else {
      const errors = res.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }

      dispatch(
        loginFail({
          msg: res.data.message || res.statusText,
          status: res.status,
        })
      );

      if (formData.otp) {
        dispatch(enableResendOTP());
      }
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response) {
      dispatch(
        loginFail({
          msg: err.response.data.message || err.response.statusText,
          status: err.response.status,
        })
      );
      dispatch(
        setAlert(err.response.data.message || err.response.statusText, "danger")
      );
      return err.response.data;
    }
  }
};

export const signup = (formData) => async (dispatch) => {
  try {
    dispatch(removeAlert());
    dispatch(removeErrors());
    const config = {
      "Content-Type": "application/json",
    };

    const res = await axios.post("/api/register", formData, config);

    if (res.data.status === true) {
      dispatch(registerSuccess(res.data.response));
      dispatch(login(formData));
      setAlert("Sign up successfully", 200);
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
  } catch (err) {
    dispatch(
      registerFail({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

export const loadUser = (router) => async (dispatch) => {
  dispatch(loadingOnLoginSubmit());
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(`/api/auth/users`);
    if (res.data.status === true) {
      dispatch(userLoaded(res.data.response));
      dispatch(userDetailsById(res.data.response));

      // if (!window.location.pathname.match(/user/)) {
      //   router.navigate("/user/dashboard");
      // }
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));
      }
    }
  } catch (err) {
    router.navigate("/");
    dispatch(
      authError({ msg: err.response?.statusText, status: err.response?.status })
    );
  }
};

// Reset Password
export const resetPassword = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    dispatch(removeAlert());
    dispatch(removeErrors());
    dispatch(loadingOnPasswordReset());
    const res = await axios.post(`/api/forgot-password`, formData, config);
    if (res.data.status === true) {
      dispatch(resetLinkSuccess(res.data.response));
      dispatch(
        setAlert(
          res.data.message ||
            "One-Time Password (OTP) has been resent to your registered email address.",
          "success"
        )
      );
    } else {
      const errors = res.data.errors;
      dispatch(resetLinkFail({ msg: res.data.message }));
      dispatch(
        setAlert(
          "Errors! Please correct the following error and try again.",
          "danger"
        )
      );
      if (errors) {
        // dispatch(setAlert(res.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    if (err.response) {
      dispatch(
        resetLinkFail({
          msg: err.response.data.message || err.response.statusText,
          status: err.response.status,
        })
      );

      dispatch(
        setAlert(err.response.data.message || err.response.statusText, "danger")
      );
    }
  }
};

export const verifyOtp = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    dispatch(removeAlert());
    dispatch(removeErrors());
    dispatch(loadingOnOTPVerified());
    const res = await axios.post(
      `/api/forgot-password/verify-otp`,
      formData,
      config
    );
    if (res.data.status === true) {
      dispatch(otpVerifiedSuccess(res.data.response));
      dispatch(
        setAlert(
          res.data.message ||
            "One-Time Password verified. Setup your password.",
          "success"
        )
      );
    } else {
      const errors = res.data.errors;
      dispatch(otpVerificationFail({ msg: res.data.message }));
      dispatch(
        setAlert(
          "Errors! Please correct the following error and try again.",
          "danger"
        )
      );
      if (errors) {
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
  } catch (err) {
    if (err.response) {
      dispatch(
        otpVerificationFail({
          msg: err.response.data.message || err.response.statusText,
          status: err.response.status,
        })
      );

      dispatch(
        setAlert(err.response.data.message || err.response.statusText, "danger")
      );
    }
  }
};

export const updatePassword = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    dispatch(removeAlert());
    dispatch(removeErrors());
    dispatch(loadingOnPasswordReset());
    const res = await axios.post(
      `/api/forgot-password/update-password`,
      formData,
      config
    );
    if (res.data.status === true) {
      dispatch(resetLinkSuccess(res.data.response));
      dispatch(
        setAlert(
          res.data.message || "Password updated successfully.",
          "success"
        )
      );
    } else {
      const errors = res.data.errors;
      dispatch(resetLinkFail({ msg: res.data.message }));
      dispatch(
        setAlert(
          "Errors! Please correct the following error and try again.",
          "danger"
        )
      );
      if (errors) {
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    if (err.response) {
      dispatch(
        resetLinkFail({
          msg: err.response.data.message || err.response.statusText,
          status: err.response.status,
        })
      );

      dispatch(
        setAlert(err.response.data.message || err.response.statusText, "danger")
      );
    }
  }
};

// Verify Reset Password Token Validity
export const getResetTokenStatus = (token) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(`/api/forgot-password/${token}`, config);

    if (res.data.status === true) {
      dispatch(resetLinkSuccess(res.data.response));
    } else {
      dispatch(setAlert(res.data.message || res.message, "danger"));
    }

    return res.data ? res.data : { status: false };
  } catch (err) {
    if (err.response) {
      resetLinkFail({
        msg: err.response.data.message || err.response.statusText,
        status: err.response.status,
      });
    }
  }
};

//Logout
export const logout = () => async (dispatch) => {
  // Logout directly, no API call.
  setAuthToken();
  dispatch(logoutAuth());

  const navigate = getRouter();
  navigate("/");
  return;

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    // clearInterval(authTimer);
    dispatch(removeAlert());
    dispatch(removeErrors());
    const res = await axios.put(`/api/auth/users/logout`, {}, config);

    if (res.data.status === true) {
      setAuthToken();
      dispatch(logoutAuth());
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
  } catch (err) {
    if (err.response) {
      if (err.response.data && err.response.data.tokenStatus === 0) {
        dispatch(setAlert(err.response.data.msg, "danger"));
        setAuthToken();
        dispatch(removeErrors());
        dispatch(logoutAuth());
      } else {
        dispatch(
          authError({
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

export const register = (formData, navigate) => async (dispatch) => {
  try {
    dispatch(removeAlert());
    dispatch(removeErrors());
    const config = {
      "Content-Type": "application/json",
    };
    const res = await axios.post(`/api/auth/users/signup`, formData, config);
    if (res.data.status === true) {
      dispatch(registerSuccess(res.data.response));
      dispatch(
        setAlert(
          "You’re all set for the Help To Community. Please hold on for login details",
          "success"
        )
      );
      const { H2C_ID } = res.data.response;
      const submitData = {
        email: H2C_ID,
        password: formData.password,
      };
      dispatch(login(submitData, navigate));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
  } catch (err) {
    if (err.response) {
      dispatch(
        registerFail({
          msg: err.response.data.message || err.response.statusText,
          status: err.response.status,
        })
      );
      dispatch(
        setAlert(err.response.data.message || err.response.statusText, "danger")
      );
      return err.response.data;
    }
  }
};

//
export const getSponsorUserDetails = (sponsor_id) => async (dispatch) => {
  try {
    dispatch(removeAlert());
    const res = await axios.get(`/api/auth/users/sponsor-user/${sponsor_id}`);

    if (res.data.status === true) {
      dispatch(sponsorUserLoaded(res.data.response));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));
      }
    }
  } catch (err) {
    console.log("err", err);
    const error = err?.response?.data;
    if (error && error?.errors.length > 0) {
      dispatch(setAlert(error.message, "danger"));
      error?.errors.forEach((error) => {
        dispatch(setErrorsList(error.msg, error.path));
      });
    }
  }
};

export const setTxnPassword = (formData, navigate) => async (dispatch) => {
  try {
    dispatch(removeErrors());
    dispatch(setLoadingOnChangePassword());
    dispatch(removeAlert());
    const config = {
      "Content-Type": "application/json",
    };
    console.log("calling from tnx pass");
    const res = await axios.post(
      `/api/auth/users/set-txn-password`,
      formData,
      config
    );

    if (res.data.status === true) {
      dispatch(changePasswordSuccess(formData));
      dispatch(setAlert(res.data.message, "success"));
    } else {
      dispatch(changePasswordError());
      const errors = res.data.errors;
      if (errors.length > 0) {
        dispatch(setAlert(err.response.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
  } catch (err) {
    console.log("error from change password:", err);
    const errors = err.response?.data?.errors;
    if (errors.length > 0) {
      dispatch(setAlert(err.response.data.message, "danger"));
      errors.forEach((error) => {
        dispatch(setErrorsList(error.msg, error.path));
      });
    }
    dispatch(changePasswordError());
  }
};

export const changeTxnPassword = (formData, navigate) => async (dispatch) => {
  try {
    dispatch(removeErrors());
    dispatch(setLoadingOnChangePassword());
    dispatch(removeAlert());
    const config = {
      "Content-Type": "application/json",
    };

    const res = await axios.post(
      `/api/auth/users/change-txn-password`,
      formData,
      config
    );

    if (res.data.status === true) {
      dispatch(changePasswordSuccess(res.data.response));
      dispatch(setAlert(res.data.message, "success"));
      navigate("/");
    } else {
      dispatch(changePasswordError());
      const errors = res.data.errors;
      if (errors.length > 0) {
        dispatch(setAlert(err.response.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
  } catch (err) {
    console.log("error from change password:", err);
    const errors = err.response?.data?.errors;
    if (errors.length > 0) {
      dispatch(setAlert(err.response.data.message, "danger"));
      errors.forEach((error) => {
        dispatch(setErrorsList(error.msg, error.path));
      });
    }
    dispatch(changePasswordError());
  }
};

export const changePassword = (formData, navigate) => async (dispatch) => {
  try {
    dispatch(removeErrors());
    dispatch(setLoadingOnChangePassword());
    dispatch(removeAlert());
    const config = {
      "Content-Type": "application/json",
    };

    const res = await axios.put(`/api/auth/users/password`, formData, config);

    if (res.data.status === true) {
      dispatch(passwordUpdated(res.data.response));
      dispatch(setAlert(res.data.message, "success"));
      navigate("/");
    } else {
      dispatch(changePasswordError());
      const errors = res.data.errors;
      if (errors.length > 0) {
        dispatch(setAlert(err.response.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
        });
      }
    }
  } catch (err) {
    console.log("error from change password:", err);
    const errors = err.response?.data?.errors;
    if (errors.length > 0) {
      dispatch(setAlert(err.response.data.message, "danger"));
      errors.forEach((error) => {
        dispatch(setErrorsList(error.msg, error.path));
      });
    }
    dispatch(changePasswordError());
  }
};

export const onProfileSubmit = (formData) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnProfileSubmit());
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.put(`/api/auth/users/profile`, formData, config);
    if (res.data.status === true) {
      dispatch(userProfileUpdated(res.data.response));
      dispatch(setAlert("Profile Updated.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(userProfileError());
        dispatch(setAlert(res.data.message, "danger"));

        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.path));
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

export const removeAllErrors = () => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(removeAlertMsg());
};

// Token invalid
export const tokenInvalid = (navigate, type) => async (dispatch) => {
  navigate("/forgot-password");
};

// Redirect to Login screen
export const loginRedirect = (history, type) => async (dispatch) => {
  dispatch(removeAlert());
  dispatch(removeErrors());
  // history.push("/login");
};

//Dispatch Confirm password error
export const setPasswordError = (msg, param) => async (dispatch) => {
  dispatch(setErrorsList(msg, param));
};

export const loadPage = () => async (dispatch) => {
  dispatch(removeAlert());
  dispatch(removeErrors());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(authError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.path));
    });
  }
};

// reset errors
export const removeRegistrationErrors = () => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(removeAlert());
};

// sidebar update
export const updateUserSidebarExpendedAction = () => async (dispatch) => {
  dispatch(await updateUserSidebarExpended());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetAuth());
};
