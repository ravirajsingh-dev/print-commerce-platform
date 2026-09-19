import React from "react";

import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";

import ProfileSection from "./ProfileSection";
import ProfileBasicInfo from "./ProfileBasicInfo";
import ChangePasswordModal from "./ChangePasswordModal";

const AdminProfile = () => {
  const [modal, setModal] = React.useState(false);
  return (
    <React.Fragment>
      <AppBreadcrumb pageTitle="Profile" crumbs={[{ name: "profile" }]} />

      <ChangePasswordModal modal={modal} setModal={setModal} />

      <ProfileSection setModal={setModal} />

      <ProfileBasicInfo />
    </React.Fragment>
  );
};

export default AdminProfile;
