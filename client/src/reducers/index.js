import { combineReducers } from "redux";

import alert from "./alertReducer";
import auth from "./authReducer";
import errors from "./errorReducer";
import user from "./userReducer";
import common from "./commonReducer";
import order from "./orderReducer";
import wallet from "./walletReducer";

const rootReducer = combineReducers({
  alert,
  auth,
  errors,
  user,
  common,
  order,
  wallet,
});

export default rootReducer;
