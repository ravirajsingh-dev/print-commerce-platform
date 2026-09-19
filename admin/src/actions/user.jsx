import axios from "axios";
import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { logout } from "./auth";

import {
  userCreated,
  resetUser,
  loadUserPage,
  userUpdated,
  userDeleted,
  userError,
  userDetailsById,
  userListUpdated,
  userSearchParameterUpdate,
  loadingOnUserSubmit,
  loadingUsersList,
  loadingOnChangeUserPassword,
  userPasswordUpdated,
} from "@reducers/user";
import { removeErrors } from "@reducers/errors";

export const getUsersList = (userParams) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const query = userParams.query ? userParams.query : "";
    userParams.query = query;
    config.params = userParams;

    dispatch(loadingUsersList());

    const res = await axios.get("/api/admin/users/list", config);

    dispatch(userSearchParameterUpdate(userParams));
    dispatch(userListUpdated(res.data.response[0]));
  } catch (err) {
    console.error(err.response);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          userError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// get User by id
export const getUserById = (user_id) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnUserSubmit());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(`/api/admin/users/${user_id}`, config);

    dispatch(userDetailsById(res.data.response));
    return res.data ? res.data.response : { status: false };
  } catch (err) {
    // console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          userError({
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

    dispatch(loadingOnUserSubmit());

    const res = await axios.post("/api/admin/users", formData, config);
    if (res.data.status === true) {
      dispatch(userCreated(res.data.response));
      dispatch(setAlert("User Created.", "success"));
      navigate(`/admin/users`);
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(userError());
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
          userError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Edit User
export const editUser = (formData, navigate, user_id) => async (dispatch) => {
  dispatch(removeErrors());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(
      `/api/admin/users/${user_id}`,
      formData,
      config
    );
    if (res.data.status === true) {
      dispatch(userUpdated(res.data.response));
      dispatch(setAlert("User Updated.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(userError());
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
          userError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Activate new  User
export const activateNewUser = (user_id) => async (dispatch) => {
  dispatch(removeErrors());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(
      `/api/admin/users/${user_id}/activation`,
      config
    );
    if (res.data.status === true) {
      dispatch(userUpdated(res.data.response));
      dispatch(setAlert("User Activated.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(userError());
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
          userError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Delete User
export const deleteUser = (user_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.delete(`/api/admin/users/${user_id}`, config);

    dispatch(userDeleted(user_id));
    dispatch(setAlert("User deleted", "success"));
  } catch (err) {
    // console.log(err);
    err.response &&
      dispatch(
        userError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
  }
};

export const saveUserClientAccess = (formData, user_id) => async (dispatch) => {
  dispatch(removeErrors());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(
      `/api/admin/users/${user_id}/client-access`,
      formData,
      config
    );
    if (res.data.status === true) {
      dispatch(userUpdated(res.data.response));
      dispatch(setAlert("Client Access Updated.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(userError());
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
          userError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const changeUserPassword = (user_id, formData) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnChangeUserPassword());
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.put(
      `/api/admin/users/${user_id}/update-password`,
      formData,
      config
    );
    if (res.data.status === true) {
      const { token, user } = res.data.response;
      dispatch(userPasswordUpdated(user));

      dispatch(setAlert("Password Updated.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(userError());
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
          userError({
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

// Delete Physician
export const cancelSave = (navigate) => async (dispatch) => {
  dispatch(removeErrors());
  navigate("/admin/users");
};

// page not found
export const notFound = (navigate) => async (dispatch) => {
  navigate("/admin/page-not-found");
};

// reset errors
export const removeUserErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetUser());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(userError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.param));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadUserPage());
};
