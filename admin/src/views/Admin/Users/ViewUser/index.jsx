import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import Spinner from "@views/Spinner";
import UserNav from "./UserNav";

import { getUserById, resetComponentStore, loadPage } from "@actions/user";
import EditUser from "./EditUser";
import ChangePassword from "./ChangePassword";

import { isAdmin } from "@utils/helper";

const ViewUser = ({
  loadingUser,
  currentUser,
  loadPage,
  resetComponentStore,
  getUserById,
  loggedInUser,
}) => {
  const { user_id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user_id) return;

    resetComponentStore();
    loadPage();
    getUserById(user_id);
  }, [user_id, resetComponentStore, loadPage, getUserById]);

  const [name, setName] = React.useState("");
  React.useEffect(() => {
    if (!currentUser) return;

    setName(currentUser.name || "");
  }, [currentUser]);

  React.useEffect(() => {
    if (loggedInUser && !isAdmin(loggedInUser)) {
      navigate("/admin/dashboard");
    }
  }, [loggedInUser, navigate]);

  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle={name ? name : "Edit User"}
        crumbs={[
          { name: "Users", path: "/admin/users" },
          { name: name ? name : "Edit User" },
        ]}
      />
      {loadingUser ? (
        <Spinner />
      ) : (
        <Row>
          <Col xs="12" sm="6">
            <UserNav user={currentUser} />

            <Routes path="/admin/users/:user_id/">
              <Route path="profile" element={<EditUser />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Routes>
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
};

ViewUser.propTypes = {
  loadingUser: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  loadPage: PropTypes.func.isRequired,
  resetComponentStore: PropTypes.func.isRequired,
  getUserById: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loadingUser: state.user.loadingUser,
  currentUser: state.user.currentUser,
  loggedInUser: state.auth.user,
});

export default connect(mapStateToProps, {
  resetComponentStore,
  getUserById,
  loadPage,
})(ViewUser);
