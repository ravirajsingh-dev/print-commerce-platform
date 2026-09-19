import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import UserImage from "@assets/images/letest-team-img2.png";
import { formatLastLoginTime } from "@src/utils/helper";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";
import { removeAllErrors } from "@src/actions/authActions";

const Profile = ({ loggedInUser = {}, removeAllErrors }) => {
  const {
    business_name = "-",
    name = "-",
    SA_ID = "-",
    phone,
    email = "-",
    address,
    pin_code,
    gst_number,
    city,
    state,
    last_login,
    terms_accepted,
  } = loggedInUser;

  React.useEffect(() => {
    removeAllErrors();
  }, []);

  return (
    <>
      <AppBreadCrumb
        title={business_name}
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: `${business_name}` },
        ]}
      />

      <div className="elementor-widget-container p-5">
        <section className="main-team-details__area rr-el-section">
          <div className="container">
            <div className="row">
              <div className="col-xl-5 col-lg-6 col-md-12 col-sm-12 col-12">
                <div className="main-team-details__first-img">
                  <Image src={UserImage} alt="User Profile" />
                </div>
              </div>
              <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 col-12">
                <div className="main-team-details__content">
                  <div className="main-team-details__content-title mb-30">
                    <h2 className="rr-team-details-title rr-el-title">
                      {business_name}
                    </h2>
                    <p className="rr-el-sub-title">Associate Member</p>
                  </div>
                  <div className="main-team-details__content-thumb">
                    <ul className="personal-info__list mt-30 mb-35">
                      <ProfileInfo label="Name" value={name} />
                      <ProfileInfo label="SA ID" value={SA_ID} />
                      <ProfileInfo
                        label="Phone"
                        value={phone ? `+91 ${phone}` : "-"}
                      />
                      <ProfileInfo label="Email" value={email} />

                      {address && pin_code && city && state && (
                        <ProfileInfo
                          label="Address"
                          value={`${address || ""}, ${city || ""}, ${
                            state || ""
                          } - ${pin_code || ""}`}
                        />
                      )}

                      <ProfileInfo label="GST Number" value={gst_number} />
                      <ProfileInfo
                        label="Last Login"
                        value={
                          last_login
                            ? formatLastLoginTime(last_login)
                            : "Never Logged In"
                        }
                      />
                      <ProfileInfo
                        label="Terms Accepted"
                        value={
                          terms_accepted ? (
                            <span className="text-success">
                              You have accepted all Terms & Conditions.
                            </span>
                          ) : (
                            <span className="text-danger">
                              You have not accepted the Terms & Conditions yet.{" "}
                              <Link
                                to="/terms-and-conditions"
                                className="text-primary"
                              >
                                Click here to review and accept.
                              </Link>
                            </span>
                          )
                        }
                      />
                    </ul>
                    <div className="main-team-details__content-thumb-btn d-flex">
                      <Link to={`/user/edit-profile/${loggedInUser._id}`}>
                        <FaUserEdit size={22} />
                        <span className="m-2">Edit Profile</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const ProfileInfo = ({ label, value }) => (
  <li className="mb-15 rr-el-re">
    <span>{label}:</span> <p className="rr-el-re-title">{value}</p>
  </li>
);

Profile.propTypes = {
  loggedInUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.user,
});

export default connect(mapStateToProps, { removeAllErrors })(Profile);
