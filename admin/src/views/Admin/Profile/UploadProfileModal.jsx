import React from "react";
import { connect } from "react-redux";
import { Button, Modal, Alert } from "react-bootstrap";
import Avatar from "react-avatar-edit";

import {
  saveUserProfile,
  setUserProfileUploadError,
} from "@actions/profileActions";

const UploadProfileModal = ({
  profileModal,
  setProfileModal,
  toggle,
  userProfile,
  setUserProfile,
  saveUserProfile,
  profileImageError,
  setUserProfileUploadError,
}) => {
  const labelCSS = {
    width: "380px",
    fontSize: "20px",
    fontWeight: 700,
  };

  const [loading, setLoading] = React.useState(false);

  const onClose = () => {
    setUserProfile(null);
  };

  const onCrop = (pv) => {
    setUserProfile(pv);
  };

  const onSubmit = () => {
    if (!userProfile) {
      setUserProfileUploadError("Error! Please upload a profile picture.");
      return;
    }

    setLoading(true);
    saveUserProfile(userProfile).then((res) => {
      setLoading(false);

      if (res && res.status) {
        setProfileModal(false);
        setUserProfile(null);
      }
    });
  };

  React.useEffect(() => {
    setUserProfileUploadError();
  }, [profileModal]);

  return (
    <Modal show={profileModal} onHide={toggle} size="lg">
      <Modal.Header toggle={toggle} closeButton>
        <h4 className="d-inline">Choose Profile Picture</h4>
      </Modal.Header>
      <Modal.Body>
        {profileImageError ? (
          <Alert key="danger" variant="danger">
            {profileImageError}
          </Alert>
        ) : null}

        <div className="upload-profile-area">
          <Avatar
            className="upload-profile-area"
            label="Choose an image"
            labelStyle={labelCSS}
            width={390}
            height={295}
            onCrop={onCrop}
            onClose={onClose}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="submit"
          variant="primary"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              {` Loading... `}
            </>
          ) : (
            <>Save</>
          )}
        </Button>
        <Button variant="danger" onClick={toggle} disabled={loading}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  profileImageError: state.profile.profileImageError,
});

export default connect(mapStateToProps, {
  saveUserProfile,
  setUserProfileUploadError,
})(UploadProfileModal);
