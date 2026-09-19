import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import Select from "react-select";

import { MdEdit } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import Errors from "@src/Notifications/Errors";

import { validateForm } from "@utils/validation";
import extractNumber from "@utils/extractNumber";
import { STATES_DISTRICTS } from "@src/constants/CustomSelectValues";
import {
  editUser,
  removeUserErrors,
  setErrors,
} from "@src/actions/userActions";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";

const EditUser = ({
  editUser,
  errorList,
  currentUser,
  setErrors,
  removeUserErrors,
}) => {
  const navigate = useNavigate();
  const { user_id } = useParams();

  const initialFormData = {
    business_name: "",
    name: "",
    email: "",
    ccode: "+91",
    phone: "",
    ccode_phone: "+91",
    address: "",
    city: "",
    state: "",
    country: "IN",
    pin_code: "",
    gst_number: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const {
    business_name,
    name,
    email,
    ccode,
    phone,
    ccode_phone,
    address,
    city,
    state,
    country,
    pin_code,
    gst_number,
  } = formData;

  const loadUserFormData = (user) => {
    const {
      business_name,
      name,
      email,
      ccode,
      phone,
      address,
      city,
      state,
      country,
      pin_code,
      gst_number,
    } = user;
    const ccode_phone = ccode + phone;
    setFormData({
      business_name,
      name,
      email,
      ccode,
      phone,
      ccode_phone,
      address,
      city,
      state,
      country,
      pin_code,
      gst_number,
    });
  };

  useEffect(() => {
    console.log("currentUser", currentUser);
    if (currentUser) {
      loadUserFormData(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (state) {
      const stateObj = STATES_DISTRICTS.find((s) => s.state === state);
      setSelectedState(
        stateObj ? { value: stateObj.state, label: stateObj.state } : null
      );
      setDistrictOptions(stateObj ? stateObj.districts : []);
      setSelectedDistrict(
        stateObj && city ? { value: city, label: city } : null
      );
    } else {
      setSelectedState(null);
      setDistrictOptions([]);
      setSelectedDistrict(null);
    }
  }, [state, city]);

  useEffect(() => {
    if (country === "IN") {
      const stateObj = STATES_DISTRICTS.find((s) => s.state === state);
      setDistrictOptions(stateObj ? stateObj.districts : []);
    } else {
      setDistrictOptions([]);
    }
  }, [country, state]);

  const handleStateChange = (option) => {
    setSelectedState(option);
    const stateObj = STATES_DISTRICTS.find((s) => s.state === option?.value);
    setDistrictOptions(stateObj ? stateObj.districts : []);
    setSelectedDistrict(null);
    setFormData({
      ...formData,
      state: option?.value || "",
      city: "",
    });
  };

  const handleDistrictChange = (option) => {
    setSelectedDistrict(option);
    setFormData({
      ...formData,
      city: option?.value || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (value) => {
    const phone = extractNumber(value, ccode);
    setFormData({
      ...formData,
      phone,
      ccode_phone: value || ccode,
    });
  };

  const toggleEdit = () => setDisabled(!isDisabled);

  const handleSubmit = (e) => {
    e.preventDefault();
    removeUserErrors();

    const validationRules = [
      { param: "business_name", msg: "Business Name is required." },
      { param: "name", msg: "Name is required." },
      { param: "email", msg: "Email is required." },
      { param: "phone", msg: "Phone is required." },
    ];

    const errors = validateForm(formData, validationRules);
    if (errors.length) {
      setErrors(errors);
      return;
    }

    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    setSubmitting(true);
    editUser(cleanedData, navigate, user_id).finally(() => {
      setSubmitting(false);
      toggleEdit();
    });
  };

  const handleCancel = () => {
    loadUserFormData(currentUser);
    toggleEdit();
  };

  return (
    <>
      <AppBreadCrumb
        title={business_name}
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: `Profile`, url: "/user/profile" },
          { label: `${business_name}` },
        ]}
      />

      <Row className="p-5">
        <Col xs="12" sm="6" className="custom-input-card">
          <Card>
            <Form onSubmit={handleSubmit}>
              <div className="card-heading mb-3">
                <h4 className="header-title d-inline">Edit Profile</h4>
                <Button
                  variant="link"
                  size="sm"
                  className="float-end primary-btn-color"
                  onClick={toggleEdit}
                >
                  {isDisabled ? (
                    <MdEdit title="Click to Edit" size={20} />
                  ) : (
                    <FaRegEye title="View Mode" size={20} />
                  )}
                </Button>
              </div>

              {/* Business Name */}
              <Form.Group className="form-group-custom mb-2">
                <Form.Label htmlFor="business_name">Business Name *</Form.Label>
                <Form.Control
                  type="text"
                  id="business_name"
                  name="business_name"
                  maxLength="100"
                  value={business_name}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className={errorList.business_name ? "invalid" : ""}
                />
                <Errors current_key="business_name" />
              </Form.Group>

              {/* Name */}
              <Form.Group className="form-group-custom mb-2">
                <Form.Label htmlFor="name">Name *</Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  name="name"
                  maxLength="100"
                  value={name}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className={errorList.name ? "invalid" : ""}
                />
                <Errors current_key="name" />
              </Form.Group>

              {/* Email */}
              <Form.Group className="form-group-custom mb-2">
                <Form.Label htmlFor="email">Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  className={errorList.email ? "invalid" : ""}
                />
                <Errors current_key="email" />
              </Form.Group>

              {/* Phone */}
              <Form.Group className="form-group-custom mb-2">
                <Form.Label htmlFor="phone">Phone</Form.Label>
                <Form.Control
                  className={errorList.phone ? "invalid" : ""}
                  type="text"
                  id="phone"
                  name="phone"
                  maxLength="10"
                  minLength="10"
                  placeholder="Phone"
                  value={phone}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
                <Errors current_key="phone" key="phone" />
              </Form.Group>

              {/* address */}
              <Form.Group className="form-group-custom mb-2">
                <Form.Label htmlFor="address">Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className={errorList.address ? "invalid" : ""}
                  id="address"
                  name="address"
                  maxLength="100"
                  placeholder="Enter address"
                  value={address}
                  onChange={handleInputChange}
                  invalid={errorList.address ? "true" : undefined}
                  disabled={isDisabled}
                />
                <Errors current_key="address" />
              </Form.Group>

              {/* Pin Code */}
              <Form.Group className="form-group-custom mb-2">
                <Form.Label htmlFor="pin_code">Pin Code *</Form.Label>
                <Form.Control
                  className={errorList.pin_code ? "invalid" : ""}
                  type="text"
                  id="pin_code"
                  name="pin_code"
                  maxLength="6"
                  minLength="6"
                  placeholder="Pin Code"
                  value={pin_code}
                  onChange={handleInputChange}
                  invalid={errorList.pin_code ? "true" : undefined}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  disabled={isDisabled}
                />
                <Errors current_key="pin_code" />
              </Form.Group>
              {/* State and District */}
              <Row>
                <Col>
                  <Form.Group className="form-group-custom mb-2">
                    <Form.Label>State *</Form.Label>
                    <Select
                      value={selectedState}
                      isClearable={true}
                      isSearchable={true}
                      options={STATES_DISTRICTS.map((s) => ({
                        value: s.state,
                        label: s.state,
                      }))}
                      onChange={handleStateChange}
                      isDisabled={isDisabled}
                    />
                    <Errors current_key="state" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="form-group-custom mb-2">
                    <Form.Label>District *</Form.Label>
                    <Select
                      value={selectedDistrict}
                      isClearable={true}
                      isSearchable={true}
                      options={districtOptions.map((d) => ({
                        value: d,
                        label: d,
                      }))}
                      onChange={handleDistrictChange}
                      isDisabled={isDisabled}
                    />
                    <Errors current_key="city" />
                  </Form.Group>
                </Col>
              </Row>

              {/* GST Number */}
              <Form.Group className="form-group-custom mb-2">
                <Form.Label htmlFor="gst_number">GST Number</Form.Label>
                <Form.Control
                  className={errorList.gst_number ? "invalid" : ""}
                  type="text"
                  id="gst_number"
                  name="gst_number"
                  maxLength="25"
                  placeholder="GST Number"
                  value={gst_number?.toLocaleUpperCase()}
                  onChange={handleInputChange}
                  invalid={errorList.gst_number ? "true" : undefined}
                  disabled={isDisabled}
                />
                <Errors current_key="gst_number" />
              </Form.Group>

              {/* Buttons */}
              <div className="float-end mt-3">
                <Button
                  type="submit"
                  className="success-custom-btn fadeInLeft animated"
                  disabled={submitting || isDisabled}
                >
                  {submitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  // variant="danger"
                  className="cancel-custom-btn fadeInLeft animated ms-2"
                  onClick={handleCancel}
                  disabled={submitting || isDisabled}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

EditUser.propTypes = {
  editUser: PropTypes.func.isRequired,
  errorList: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  setErrors: PropTypes.func.isRequired,
  removeUserErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps, {
  editUser,
  removeUserErrors,
  setErrors,
})(EditUser);
