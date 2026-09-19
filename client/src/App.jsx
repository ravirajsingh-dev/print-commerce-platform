import React from "react";
import { RouterProvider } from "react-router-dom";
import "./app.scss";

import { ToastContainer, toast } from "react-toastify";
import setAuthToken from "./utils/setAuthToken";

import store from "./store.jsx";
import PortalRoutes from "./views/Routing/PortalRoutes.jsx";

import { loadUser } from "src/actions/authActions";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  React.useEffect(() => {
    store.dispatch(loadUser(PortalRoutes));
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={PortalRoutes} />
    </div>
  );
};

export default App;
