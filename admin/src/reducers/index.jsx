import { combineReducers } from "redux";

import errors from "./errors";
import signup from "./signupReducer";
import alert from "./alert";
import auth from "./auth";
import user from "./user";
import profile from "./profileReducer";
import common from "./commonReducer";
import dashboard from "./dashboardReducer";
import order from "./orderReducer";
import service from "./serviceReducer";
import product from "./productReducer";
import productService from "./productServiceReducer";
import serviceCat from "./serviceCatReducer";
import credentials from "./credentialsReducer";
import wallet from "./walletReducer";
import banner from "./bannerReducer";
import complaint from "./complaintReducer";

const rootReducer = combineReducers({
  errors,
  signup,
  alert,
  auth,
  user,
  profile,
  common,
  order,
  service,
  product,
  productService,
  serviceCat,
  credentials,
  wallet,
  dashboard,
  banner,
  complaint,
});

export default rootReducer;
