import React from "react";
import { useParams, Link } from "react-router-dom";

const UserNav = ({ user }) => {
  const params = useParams();
  const currentTab = params["*"];

  return (
    <ul className="nav nav-tabs nav-bordered">
      <li className="nav-item">
        <Link
          className={`nav-link py-2 ${
            currentTab === "profile" ? "active" : ""
          }`}
          // data-bs-toggle="tab"
          aria-expanded="false"
          to={`/admin/users/${user._id}/profile`}
        >
          Profile
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className={`nav-link py-2 ${
            currentTab === "change-password" ? "active" : ""
          }`}
          aria-expanded="false"
          to={`/admin/users/${user._id}/change-password`}
        >
          Change Password
        </Link>
      </li>
    </ul>
  );
};

export default UserNav;
