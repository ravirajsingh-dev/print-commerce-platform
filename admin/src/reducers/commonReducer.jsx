import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  usersList: [],
  productsList: [],
  productServicesList: [],
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    usersListUpdated(state, action) {
      return {
        ...state,
        usersList: action.payload,
      };
    },
  },
});

export const { usersListUpdated } = commonSlice.actions;
export default commonSlice.reducer;
