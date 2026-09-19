import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Row, Card } from "react-bootstrap";
import Select from "react-select";

import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import Errors from "@notifications/Errors";
import Spinner from "@views/Spinner";

import { STATES_DISTRICTS } from "@constants/CustomSelectValues";
import { validateForm } from "@utils/validation";
import { isAdmin } from "@utils/helper";

import {
  create,
  cancelSave,
  loadPage,
  setErrors,
  removeUserErrors,
  resetComponentStore,
} from "@actions/user";

const CreateUser = ({
  create,
  errorList,
  cancelSave,
  loadingUser,
  loadPage,
  setErrors,
  removeUserErrors,
  resetComponentStore,
  loggedInUser,
}) => {
  const navigate = useNavigate();

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
    reference_by: "",
  };
  const [formData, setFormData] = React.useState(initialFormData);
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
    reference_by,
  } = formData;

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

  const onChange = (e) => {
    if (e?.target?.name) {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    removeUserErrors();

    const validationRules = [
      { param: "business_name", msg: "Business Name is required." },
      { param: "name", msg: "Name is required." },
      { param: "email", msg: "Email is required." },
      { param: "phone", msg: "Phone is required." },
      { param: "address", msg: "Address is required." },
      { param: "pin_code", msg: "Pin Code is required." },
      { param: "city", msg: "City is required." },
      { param: "state", msg: "State is required." },
    ];

    const errors = validateForm(formData, validationRules);
    if (errors.length) {
      setErrors(errors);
      return;
    }

    const submitData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value)
    );

    await create(submitData, navigate);
  };

  const onCancel = (e) => {
    e.preventDefault();
    cancelSave(navigate);
  };

  React.useEffect(() => {
    resetComponentStore();
    loadPage();

    if (loggedInUser && !isAdmin(loggedInUser)) {
      navigate("/admin/dashboard");
    }
  }, [loggedInUser]);

  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle="Create New User"
        crumbs={[
          { name: "Users", path: "/admin/users" },
          { name: "Create New User" },
        ]}
      />

      {loadingUser ? (
        <Spinner />
      ) : (
        <Row>
          <Col xs="12" sm="8">
            <Card className="card-body">
              <Form onSubmit={onSubmit}>
                <h4 className="header-title">User Information</h4>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="business_name">
                    Business Name *
                  </Form.Label>
                  <Form.Control
                    className={errorList.business_name ? "invalid" : ""}
                    type="text"
                    id="business_name"
                    name="business_name"
                    maxLength="150"
                    value={business_name}
                    onChange={onChange}
                  />
                  <Errors current_key="business_name" key="business_name" />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="name">Name *</Form.Label>
                  <Form.Control
                    className={errorList.name ? "invalid" : ""}
                    type="text"
                    id="name"
                    name="name"
                    maxLength="150"
                    value={name}
                    onChange={onChange}
                  />
                  <Errors current_key="name" key="name" />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="email">Email *</Form.Label>
                  <Form.Control
                    className={errorList.email ? "invalid" : ""}
                    type="email"
                    id="email"
                    name="email"
                    maxLength="100"
                    value={email}
                    onChange={onChange}
                    invalid={errorList.email ? "true" : undefined}
                  />
                  <Errors current_key="email" key="email" />
                </Form.Group>

                <Form.Group className="form-group">
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
                    onChange={onChange}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                  <Errors current_key="phone" key="phone" />
                </Form.Group>

                {/* Address */}
                <Form.Group className="form-group">
                  <Form.Label htmlFor="address">Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    className={errorList.address ? "invalid" : ""}
                    id="address"
                    name="address"
                    maxLength="100"
                    placeholder="Enter address"
                    value={address}
                    onChange={onChange}
                    invalid={errorList.address ? "true" : undefined}
                  />
                  <Errors current_key="address" />
                </Form.Group>

                {/* Pin Code */}
                <Form.Group className="form-group">
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
                    onChange={onChange}
                    invalid={errorList.pin_code ? "true" : undefined}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                  <Errors current_key="pin_code" />
                </Form.Group>
                {/* State and District */}
                <Row>
                  <Col>
                    <Form.Group>
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
                      />
                      <Errors current_key="state" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
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
                      />
                      <Errors current_key="city" />
                    </Form.Group>
                  </Col>
                </Row>

                {/* GST Number */}
                <Form.Group className="form-group mt-3">
                  <Form.Label htmlFor="gst_number">GST Number</Form.Label>
                  <Form.Control
                    className={errorList.gst_number ? "invalid" : ""}
                    type="text"
                    id="gst_number"
                    name="gst_number"
                    maxLength="25"
                    placeholder="GST Number"
                    value={gst_number?.toLocaleUpperCase()}
                    onChange={onChange}
                    invalid={errorList.gst_number ? "true" : undefined}
                  />
                  <Errors current_key="gst_number" />
                </Form.Group>

                {/* Reference by */}
                <Form.Group className="form-group">
                  <Form.Label htmlFor="reference_by">Reference by</Form.Label>
                  <Form.Control
                    className={errorList.reference_by ? "invalid" : ""}
                    type="text"
                    id="reference_by"
                    name="reference_by"
                    maxLength="8"
                    minLength="8"
                    placeholder="Enter Reference SA ID"
                    value={reference_by?.toLocaleUpperCase()}
                    onChange={onChange}
                    invalid={errorList.reference_by ? "true" : undefined}
                  />
                  <Errors current_key="reference_by" />
                </Form.Group>

                <div className="float-end">
                  <Button className="m-2" type="submit" size="sm">
                    Submit
                  </Button>
                  <Button
                    className="ml-2"
                    type="reset"
                    size="sm"
                    variant="danger"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
};

CreateUser.propTypes = {
  create: PropTypes.func.isRequired,
  loadPage: PropTypes.func.isRequired,
  errorList: PropTypes.object.isRequired,
  cancelSave: PropTypes.func.isRequired,
  resetComponentStore: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loadingUser: state.user.loadingUser,
  loggedInUser: state.auth.user,
});

export default connect(mapStateToProps, {
  create,
  cancelSave,
  loadPage,
  setErrors,
  removeUserErrors,
  resetComponentStore,
})(CreateUser);
