import axios from "axios";
import { setAlert } from "./alert";
import { setErrorsList } from "./errors";
import { logout } from "./auth";

import {
  bannerCreated,
  resetBanner,
  loadBannerPage,
  bannerUpdated,
  bannerDeleted,
  bannerError,
  bannerDetailsById,
  bannerListUpdated,
  bannerSearchParameterUpdate,
  loadingOnBannerSubmit,
  loadingBannersList,
  loadingOnChangeBannerPassword,
  bannerPasswordUpdated,
} from "@reducers/bannerReducer";
import { removeErrors } from "@reducers/errors";

export const getBannersList = (bannerParams) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const query = bannerParams.query ? bannerParams.query : "";
    bannerParams.query = query;
    config.params = bannerParams;

    dispatch(loadingBannersList());

    const res = await axios.get("/api/admin/banners/list", config);

    dispatch(bannerSearchParameterUpdate(bannerParams));
    dispatch(bannerListUpdated(res.data.response[0]));
  } catch (err) {
    console.error(err.response);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          bannerError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// get Banner by id
export const getBannerById = (banner_id) => async (dispatch) => {
  dispatch(removeErrors());
  dispatch(loadingOnBannerSubmit());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(`/api/admin/banners/${banner_id}`, config);

    dispatch(bannerDetailsById(res.data.response));
    return res.data ? res.data.response : { status: false };
  } catch (err) {
    // console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      err.response &&
        dispatch(
          bannerError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

export const create = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    dispatch(loadingOnBannerSubmit());

    const res = await axios.post("/api/admin/banners", formData, config);
    if (res.data.status === true) {
      dispatch(bannerCreated(res.data.response));
      dispatch(setAlert("Banner Created.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(bannerError());
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
          bannerError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Edit Banner
export const editBanner =
  (formData, navigate, banner_id) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/banners/${banner_id}`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(bannerUpdated(res.data.response));
        dispatch(setAlert("Banner Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(bannerError());
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
            bannerError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

// Activate new  Banner
export const activateNewBanner = (banner_id) => async (dispatch) => {
  dispatch(removeErrors());
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put(
      `/api/admin/banners/${banner_id}/activation`,
      config
    );
    if (res.data.status === true) {
      dispatch(bannerUpdated(res.data.response));
      dispatch(setAlert("Banner Activated.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(bannerError());
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
          bannerError({
            msg: err.response.statusText,
            status: err.response.status,
          })
        );

      dispatch(setAlert(err.response.message, "danger"));
    }
  }
};

// Delete Banner
export const deleteBanner = (banner_id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.delete(`/api/admin/banners/${banner_id}`, config);

    dispatch(bannerDeleted(banner_id));
    dispatch(setAlert("Banner deleted", "success"));
  } catch (err) {
    // console.log(err);
    err.response &&
      dispatch(
        bannerError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
  }
};

export const saveBannerClientAccess =
  (formData, banner_id) => async (dispatch) => {
    dispatch(removeErrors());
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put(
        `/api/admin/banners/${banner_id}/client-access`,
        formData,
        config
      );
      if (res.data.status === true) {
        dispatch(bannerUpdated(res.data.response));
        dispatch(setAlert("Client Access Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(bannerError());
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
            bannerError({
              msg: err.response.statusText,
              status: err.response.status,
            })
          );

        dispatch(setAlert(err.response.message, "danger"));
      }
    }
  };

export const changeBannerPassword =
  (banner_id, formData) => async (dispatch) => {
    dispatch(removeErrors());
    dispatch(loadingOnChangeBannerPassword());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.put(
        `/api/admin/banners/${banner_id}/update-password`,
        formData,
        config
      );
      if (res.data.status === true) {
        const { token, banner } = res.data.response;
        dispatch(bannerPasswordUpdated(banner));

        dispatch(setAlert("Password Updated.", "success"));
      } else {
        const errors = res.data.errors;
        if (errors) {
          dispatch(bannerError());
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
            bannerError({
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
  navigate("/admin/banners");
};

// page not found
export const notFound = (navigate) => async (dispatch) => {
  navigate("/admin/page-not-found");
};

// reset errors
export const removeBannerErrors = () => async (dispatch) => {
  dispatch(removeErrors());
};

// Dispatch Reset store
export const resetComponentStore = () => async (dispatch) => {
  await dispatch(resetBanner());
};

export const setErrors = (errors) => async (dispatch) => {
  if (errors) {
    dispatch(bannerError());
    dispatch(setAlert("Please correct the following errors", "danger"));
    errors.forEach((error) => {
      dispatch(setErrorsList(error.msg, error.param));
    });
  }
};

// Load Page/Show Page
export const loadPage = () => async (dispatch) => {
  await dispatch(loadBannerPage());
};
