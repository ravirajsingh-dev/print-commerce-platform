import React from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import store from "./store";
import { loadUser } from "@actions/auth";

import setAuthToken from "./utils/setAuthToken";
import Login from "./views/Auth/Login";
import PrivateRoute from "./views/Routing/PrivateRoute";
import AdminLayout from "./views/Admin/Layout/index";
import ResetPassword from "./views/Auth/ForgotPassword/ResetPassword";
import ForgotPassword from "./views/Auth/ForgotPassword/ForgotPassword";
import NotFound from "@views/NotFound";
import SetPassword from "@views/Auth/SetPassword";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = (props) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    store.dispatch(loadUser(navigate));
  }, []);
  return (
    <div className="App">
      {/* Hello */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin/*" element={<AdminLayout />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
