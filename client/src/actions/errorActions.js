import { setErrors } from "src/reducers/errorReducer";

export const setErrorsList =
  (msg, err_key = "") =>
  (dispatch) => {
    dispatch(setErrors({ [err_key]: msg }));
  };
