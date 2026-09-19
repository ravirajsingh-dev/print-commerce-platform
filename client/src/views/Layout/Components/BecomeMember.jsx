import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Row, Card } from "react-bootstrap";
import Select from "react-select";

import Errors from "@src/Notifications/Errors";
import { validateForm } from "@utils/validation";

import {
  requestForID,
  cancelSave,
  loadPage,
  setErrors,
  removeUserErrors,
  resetComponentStore,
} from "@actions/userActions";
import { STATES_DISTRICTS } from "@src/constants/CustomSelectValues";

const BecomeMember = ({
  requestForID,
  errorList,
  cancelSave,
  setErrors,
  removeUserErrors,
}) => {
  const navigate = useNavigate();

  const initialFormData = {
    business_name: "",
    name: "",
    email: "",
    ccode: "+91",
    phone: "",
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
    phone,
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
      console.log("errors", errors);
      setErrors(errors);
      return;
    }

    const submitData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value)
    );

    await requestForID(submitData, navigate).finally(() => {
      setFormData(initialFormData);
      navigate("/");
    });
  };

  return (
    <div className="elementor-widget-container">
      <section className="contact-us__area overflow-hidden">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-12">
              <div className="contact-us__form-wrapper mb-30 mb-xs-25">
                <h2 className="section__title mb-10 wow fadeInLeft rr-el-title">
                  Request to become a member
                </h2>{" "}
                <p className="mb-40 mb-sm-25 mb-xs-20 wow fadeInLeft">
                  Shree Advertising serves only businesses, not direct
                  customers. Approval takes working day after verification,
                  Thanks.
                </p>
                <div className="contact-us__form">
                  <div>
                    <Form onSubmit={onSubmit}>
                      <div className="contact-us__form">
                        <div className="row wow fadeInLeft animated">
                          <div className="col-sm-6">
                            <div className="contact-us__input">
                              <span>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="business_name">
                                    Business Name *
                                  </Form.Label>
                                  <Form.Control
                                    className={
                                      errorList.business_name ? "invalid" : ""
                                    }
                                    type="text"
                                    id="business_name"
                                    name="business_name"
                                    placeholder="Business Name"
                                    maxLength="150"
                                    value={business_name}
                                    onChange={onChange}
                                  />
                                  <Errors current_key="business_name" />
                                </Form.Group>
                              </span>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="contact-us__input">
                              <span>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="name">Name *</Form.Label>
                                  <Form.Control
                                    className={errorList.name ? "invalid" : ""}
                                    type="text"
                                    id="name"
                                    name="name"
                                    maxLength="150"
                                    placeholder="Name"
                                    value={name}
                                    onChange={onChange}
                                  />
                                  <Errors current_key="name" />
                                </Form.Group>
                              </span>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="contact-us__input">
                              <span>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="email">
                                    Email *
                                  </Form.Label>
                                  <Form.Control
                                    className={errorList.email ? "invalid" : ""}
                                    type="email"
                                    id="email"
                                    name="email"
                                    maxLength="100"
                                    placeholder="Email"
                                    value={email}
                                    onChange={onChange}
                                    invalid={
                                      errorList.email ? "true" : undefined
                                    }
                                  />
                                  <Errors current_key="email" />
                                </Form.Group>
                              </span>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="contact-us__input">
                              <span>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="phone">
                                    Phone *
                                  </Form.Label>

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
                                    invalid={
                                      errorList.phone ? "true" : undefined
                                    }
                                    onKeyPress={(event) => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                  />
                                  <Errors current_key="phone" />
                                </Form.Group>
                              </span>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="contact-us__textarea">
                              <span>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="address">
                                    Address *
                                  </Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    rows={5}
                                    className={
                                      errorList.address ? "invalid" : ""
                                    }
                                    id="address"
                                    name="address"
                                    maxLength="100"
                                    placeholder="Enter address"
                                    value={address}
                                    onChange={onChange}
                                    invalid={
                                      errorList.address ? "true" : undefined
                                    }
                                  />
                                  <Errors current_key="address" />
                                </Form.Group>
                              </span>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="contact-us__input">
                              <span>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="pin_code">
                                    Pin Code *
                                  </Form.Label>

                                  <Form.Control
                                    className={
                                      errorList.pin_code ? "invalid" : ""
                                    }
                                    type="text"
                                    id="pin_code"
                                    name="pin_code"
                                    maxLength="6"
                                    minLength="6"
                                    placeholder="Pin Code"
                                    value={pin_code}
                                    onChange={onChange}
                                    invalid={
                                      errorList.pin_code ? "true" : undefined
                                    }
                                    onKeyPress={(event) => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                  />
                                  <Errors current_key="pin_code" />
                                </Form.Group>
                              </span>
                            </div>
                          </div>

                          <div className="col-sm-6 select-custom">
                            <div className="contact-us__input">
                              <span>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="state">
                                    State *
                                  </Form.Label>

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
                              </span>
                            </div>
                          </div>

                          <div className="col-sm-6 select-custom">
                            <div className="contact-us__input">
                              <span>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="city">
                                    District *
                                  </Form.Label>

                                  <Select
                                    className=""
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
                              </span>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="contact-us__input">
                              <span>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="gst_number">
                                    GST Number
                                  </Form.Label>

                                  <Form.Control
                                    className={
                                      errorList.gst_number ? "invalid" : ""
                                    }
                                    type="text"
                                    id="gst_number"
                                    name="gst_number"
                                    maxLength="25"
                                    placeholder="GST Number"
                                    value={gst_number.toLocaleUpperCase()}
                                    onChange={onChange}
                                    invalid={
                                      errorList.gst_number ? "true" : undefined
                                    }
                                  />
                                  <Errors current_key="gst_number" />
                                </Form.Group>
                              </span>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="contact-us__input">
                              <span>
                                <Form.Group className="form-group">
                                  <Form.Label htmlFor="reference_by">
                                    Reference by
                                  </Form.Label>

                                  <Form.Control
                                    className={
                                      errorList.reference_by ? "invalid" : ""
                                    }
                                    type="text"
                                    id="reference_by"
                                    name="reference_by"
                                    maxLength="8"
                                    minLength="8"
                                    placeholder="Enter Reference SA ID"
                                    value={reference_by.toLocaleUpperCase()}
                                    onChange={onChange}
                                    invalid={
                                      errorList.reference_by
                                        ? "true"
                                        : undefined
                                    }
                                  />
                                  <Errors current_key="reference_by" />
                                </Form.Group>
                              </span>
                            </div>
                          </div>

                          <div className="col-12 mt-5">
                            <Button
                              type="submit"
                              className="rr-btn none-z-index"
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div
                        className="wpcf7-response-output"
                        aria-hidden="true"
                      ></div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

BecomeMember.propTypes = {
  requestForID: PropTypes.func.isRequired,
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
  requestForID,
  cancelSave,
  loadPage,
  setErrors,
  removeUserErrors,
  resetComponentStore,
})(BecomeMember);
