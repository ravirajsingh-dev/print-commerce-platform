import axios from "axios";
import { setAlert } from "./alertActions";

export const createComplaint = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios.post(`/api/user/complaints`, formData, config);

    if (res.data.status === true) {
      dispatch(setAlert("Complaint Created", "success"));
    }

    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      dispatch(
        setAlert(
          err.response?.data?.message || err?.response?.statusText,
          "danger"
        )
      );
    }
  }
};

export const getComplaintsList = (params) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
    };

    const query = params.query ? params.query : "";
    params.query = query;
    config.params = params;

    const res = await axios.get(`/api/user/complaints/list`, config);

    return res.data ? res.data : { status: false };
  } catch (err) {
    console.log(err);
    if (err.response.data && err.response.data.tokenStatus === 0) {
      dispatch(logout());
    } else {
      dispatch(
        setAlert(
          err.response?.data?.message || err?.response?.statusText,
          "danger"
        )
      );
    }
  }
};
