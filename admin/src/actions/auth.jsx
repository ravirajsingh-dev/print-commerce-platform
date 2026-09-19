import axios from "axios";
import { setAlert, removeAlert } from "./alert";

import { setErrorsList } from "./errors";
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
  resetAuth,
  otpVerifiedSuccess,
  otpVerificationFail,
  loadingOnOTPVerified,
} from "@reducers/auth";
import { removeErrors } from "@reducers/errors";

export const login = (formData, navigate) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnLoginSubmit());
  dispatch(removeAlert());
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const res = await axios.post(`/api/auth`, formData, config);

    if (res.data.status === true) {
      dispatch(loginSucess(res.data.response));
      if (res.data.response && res.data.response.user.role === 3) {
        if (res.data.response.user.setPassword) {
          navigate(`/set-password`);
        }
      } else {
        navigate("/admin/dashboard");
      }
      setAuthToken(res.data.response.token);

      // dispatch(loadUser());
      //Remember me
      //Do it later
      // if (formData.rememberMe) {
      //   localStorage.setItem("rmcheck", formData.rememberMe);
      //   if (formData.loginType === "email") {
      //     localStorage.setItem(
      //       "rmval",
      //       btoa(formData.email) + "-" + btoa(formData.password)
      //     );
      //   } else {
      //     localStorage.setItem(
      //       "rmval",
      //       btoa(formData.ccode) +
      //         "-" +
      //         btoa(formData.phone) +
      //         "-" +
      //         btoa(formData.password)
      //     );
      //   }
      // } else {
      //   localStorage.removeItem("rmcheck");
      //   localStorage.removeItem("rmval");
      // }
    } else {
      const errors = res.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
      dispatch(
        loginFail({
          msg: res.data.message || res.statusText,
          status: res.status,
        })
      );
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
          dispatch(setErrorsList(error.msg, error.param));
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

export const loadUser = (navigate) => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  dispatch(loadingOnLoginSubmit());

  try {
    const res = await axios.get(`/api/auth`);

    if (res.data.status === true) {
      dispatch(userLoaded(res.data.response));
      if (!window.location.pathname.match(/admin/)) {
        navigate("/admin/dashboard");
      }
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));
      }
    }
  } catch (err) {
    navigate("/");
    // console.log(err);
    dispatch(
      authError({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Generate Reset Link
export const resetLink =
  ({ email }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email });

    try {
      dispatch(removeAlert());
      dispatch(removeErrors());
      dispatch(loadingOnPasswordReset());
      const res = await axios.post(`/api/admin/forgot-password`, body, config);
      if (res.data.status === true) {
        dispatch(resetLinkSuccess(res.data.response));
        dispatch(
          setAlert(
            res.data.message ||
              "We sent you an email with reset password link!",
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
            dispatch(setErrorsList(error.msg, error.param));
          });
        }
      }
    } catch (err) {
      if (err.response) {
        dispatch(
          resetLinkFail({
            msg: err.response.data.message || err.response.statusText,
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
  };

// Reset Password
export const resetPassword =
  ({ email, resendOTP }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, resendOTP });

    try {
      dispatch(removeAlert());
      dispatch(removeErrors());
      dispatch(loadingOnPasswordReset());
      const res = await axios.post(`/api/admin/forgot-password`, body, config);
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
          setAlert(
            err.response.data.message || err.response.statusText,
            "danger"
          )
        );
      }
    }
  };

export const verifyOtp =
  ({ email, otp }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, otp });

    try {
      dispatch(removeAlert());
      dispatch(removeErrors());
      dispatch(loadingOnOTPVerified());
      const res = await axios.post(
        `/api/admin/forgot-password/verify-otp`,
        body,
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
          setAlert(
            err.response.data.message || err.response.statusText,
            "danger"
          )
        );
      }
    }
  };

export const updatePassword = (payload) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify(payload);

  try {
    dispatch(removeAlert());
    dispatch(removeErrors());
    dispatch(loadingOnPasswordReset());
    const res = await axios.post(
      `/api/admin/forgot-password/update-password`,
      body,
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

//Logout / Clear Profile
export const logout = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    // clearInterval(authTimer);
    dispatch(removeAlert());
    dispatch(removeErrors());
    const res = await axios.put(`/api/auth/logout`, {}, config);

    if (res.data.status === true) {
      setAuthToken();
      dispatch(logoutAuth());
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.param));
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

export const setPassword = (password, id, navigate) => async (dispatch) => {
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
      `/api/auth/set-password`,
      { password, id },
      config
    );

    let providerID =
      res.data && res.data.response ? res.data.response.provider_id : null;

    if (res.data.status === true) {
      loadUser();
      dispatch(setAlert(res.data.message, "Password set successful"));
      navigate(`/admin/providers/${providerID}/provider-dashboard`);
    } else {
      const errors = res.data.errors;
      dispatch(resetLinkFail());

      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));
        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
    return res.data ? res.data : { status: false };
  } catch (err) {
    dispatch(resetLinkFail());
  }
};

// Token invalid
export const tokenInvalid = (navigate, type) => async (dispatch) => {
  navigate("/forgot-password");
};

// Redirect to Login screen
export const loginRedirect = (history, type) => async (dispatch) => {
  dispatch(removeAlert());
  dispatch(removeErrors());
  history.push("/login");
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

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetAuth());
};
