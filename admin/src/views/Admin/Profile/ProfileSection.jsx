import React from "react";
import { Row, Col, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { FaUserEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { RiLockPasswordLine } from "react-icons/ri";
import NoUserImage from "@assets/images/no-user.png";

import UploadProfileModal from "./UploadProfileModal";
import Spinner from "@views/Spinner";

const ProfileSection = ({ setModal, auth: { user }, loadingProfile }) => {
  const onClickHandle = () => {
    setModal(true);
  };

  const { avatar } = user ? user : {};

  const [userProfile, setUserProfile] = React.useState(null);
  const [userProfileToShow, setUserProfileToShow] = React.useState(null);
  const [profileModal, setProfileModal] = React.useState(false);
  const toggle = () => setProfileModal(!profileModal);

  React.useEffect(() => {
    if (!avatar) return;

    setUserProfileToShow(avatar);
  }, [avatar]);

  return (
    <React.Fragment>
      <UploadProfileModal
        profileModal={profileModal}
        setProfileModal={setProfileModal}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        toggle={toggle}
      />
      <Row>
        <Col>
          <div className="crm-card">
            <Row>
              <Col sm="1" className="user-image-section ">
                {loadingProfile ? (
                  <Spinner />
                ) : userProfileToShow ? (
                  <Image
                    src={userProfileToShow}
                    className="rounded-circle img-thumbnail"
                  />
                ) : (
                  <Image
                    src={NoUserImage}
                    className="rounded-circle img-thumbnail"
                  />
                )}

                {!loadingProfile ? (
                  <span
                    className="profile-icon"
                    title="Upload Profile Picture"
                    onClick={toggle}
                  >
                    <MdEdit size="15px" />
                  </span>
                ) : null}
              </Col>
              <Col className="user-info">
                <h4> {user && user.name ? user.name : "Anonymous user"}</h4>
                <p>{user && user.title ? user.title : null}</p>

                <div className="profile-section-info" title="Mock Data">
                  <div className="user-revenue">
                    <h5>$ 25,184</h5>
                    <span>Total Revenue </span>
                  </div>

                  <div className="ml-2">
                    <h5>5482</h5>
                    <span>Number Of Orders </span>
                  </div>
                </div>
              </Col>
              <Col className="profile-buttons m-0 p-0">
                <Link to="/admin/profile/edit" className="btn btn-outline-dark">
                  <FaUserEdit /> Edit Profile
                </Link>

                <div className="mt-2">
                  <Button
                    className="btn  btn-outline-dark"
                    onClick={onClickHandle}
                  >
                    <RiLockPasswordLine /> Change Password
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  loadingProfile: state.auth.loadingProfile,
});

export default connect(mapStateToProps, {})(ProfileSection);
