import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import { MdEdit } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";

import { validateForm } from "@utils/validation";
import Errors from "@notifications/Errors";
import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import extractNumber from "@utils/extractNumber";

import {
  onProfileSubmit,
  removeProfileErrors,
  setErrors,
} from "@actions/profileActions";
import { STATES_DISTRICTS } from "@constants/CustomSelectValues";

const EditProfile = ({
  auth: { user },
  removeProfileErrors,
  onProfileSubmit,
  setErrors,
  errorList,
  loading,
}) => {
  const navigate = useNavigate();
  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    ccode_phone: "+91",
    address: "",
    state: "",
    city: "",
    pin_code: "",
  };

  const [formData, setFormData] = React.useState(initialFormData);
  const [districtOptions, setDistrictOptions] = React.useState([]);
  const [selectedState, setSelectedState] = React.useState(null);
  const [selectedDistrict, setSelectedDistrict] = React.useState(null);

  const loadUserFormData = (currentUser) => {
    const { name, email, ccode, phone, address, state, city, pin_code } =
      currentUser;

    const ccode_phone = ccode + phone;
    const data = {
      name,
      email,
      ccode,
      ccode_phone,
      address,
      state,
      city,
      pin_code,
    };
    setFormData((formData) => ({ ...formData, ...data }));
  };

  const { name, email, ccode, ccode_phone, address, state, city, pin_code } =
    formData;

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!user) return;

    loadUserFormData(user);
  }, [user]);

  const onSubmit = (e) => {
    e.preventDefault();

    removeProfileErrors();
    let validationRules = [
      {
        param: "name",
        msg: "Name is required",
      },
      {
        param: "email",
        msg: "Email is required",
      },
    ];

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    const submitData = {};
    const excludeList = { iute164_phone: 1 };
    for (let i in formData) {
      if (!formData[i] || excludeList[i]) continue;
      submitData[i] = formData[i];
    }

    //console.log("On Profile Submit ", submitData)
    onProfileSubmit(submitData, navigate).then((res) => {
      setDisabled(!isDisabled);
    });
  };

  const [isDisabled, setDisabled] = React.useState(true);
  const toggleEdit = () => setDisabled(!isDisabled);

  const onChange = (e) => {
    if (!e.target) {
      return;
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onPhoneChange = (val) => {
    const phone = extractNumber(val, ccode);
    setFormData((form) => ({
      ...form,
      phone: phone,
      ccode_phone: val || ccode,
    }));
  };

  const onCountryChange = (code) => {
    setFormData((form) => ({
      ...form,
      iso: code || "US",
      ccode: "+" + getCountryCallingCode(code || "US"),
    }));
  };

  const onClickCancel = (e) => {
    e.preventDefault();
    removeProfileErrors();
    loadUserFormData(user);
    toggleEdit();
  };

  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle="Profile"
        crumbs={[{ name: "profile", path: "/admin/profile" }, { name: "Edit" }]}
      />

      <Row>
        <Col md="6">
          <Card className="card-body">
            <Form onSubmit={(e) => onSubmit(e)}>
              <div className="card-heading mb-3">
                <h4 className="header-title">User Information</h4>
                <Button
                  variant="link"
                  size="sm"
                  className="float-end"
                  onClick={toggleEdit}
                >
                  {isDisabled ? (
                    <span>
                      <MdEdit title="Click to Edit" size={20} />
                    </span>
                  ) : (
                    <span>
                      <FaRegEye title="View mode" size={20} />
                    </span>
                  )}
                </Button>
              </div>

              <Form.Group className="form-group">
                <Form.Label htmlFor="name">
                  Name <span>*</span>
                </Form.Label>
                <br></br>
                <Form.Control
                  className={errorList.name ? "invalid" : ""}
                  type="text"
                  id="name"
                  name="name"
                  maxLength="100"
                  value={name}
                  onChange={(e) => onChange(e)}
                  disabled={isDisabled}
                />
                <Errors current_key="name" key="name" />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label htmlFor="email">
                  Email <span>*</span>
                </Form.Label>
                <br></br>
                <Form.Control
                  className={errorList.email ? "invalid" : ""}
                  type="mail"
                  id="email"
                  name="email"
                  maxLength="100"
                  value={email}
                  onChange={(e) => onChange(e)}
                  disabled={isDisabled}
                />

                <Errors current_key="email" key="email" />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label htmlFor="phone">Phone</Form.Label>
                <br></br>
                <PhoneInput
                  className={errorList.phone ? "invalid" : ""}
                  id="phone"
                  name="phone"
                  international={true}
                  defaultCountry="US"
                  countryOptionsOrder={["US", "|", "..."]}
                  value={ccode_phone}
                  onChange={onPhoneChange}
                  addInternationalOption={false}
                  onCountryChange={onCountryChange}
                  disabled={isDisabled}
                />
                <Errors current_key="phone" key="phone" />
              </Form.Group>

              {/* address */}
              <Form.Group className="form-group-custom mb-2">
                <Form.Label htmlFor="address">Address *</Form.Label>
                <Form.Control
                  type="text"
                  id="address"
                  name="address"
                  maxLength="250"
                  value={address}
                  onChange={(e) => onChange(e)}
                  disabled={isDisabled}
                  className={errorList.address ? "invalid" : ""}
                />
                <Errors current_key="address" />
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
                <Col>
                  <Form.Group className="form-group-custom mb-2">
                    <Form.Label htmlFor="pin_code">PIN Code *</Form.Label>
                    <Form.Control
                      type="text"
                      id="pin_code"
                      name="pin_code"
                      maxLength="6"
                      minLength="6"
                      value={pin_code}
                      onChange={(e) => onChange(e)}
                      disabled={isDisabled}
                      className={errorList.pin_code ? "invalid" : ""}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                    <Errors current_key="pin_code" />
                  </Form.Group>
                </Col>
              </Row>

              <div className="float-end">
                <Button
                  className="m-2"
                  type="submit"
                  variant="primary"
                  disabled={loading || isDisabled}
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
                <Button
                  className="ml-2"
                  type="reset"
                  variant="danger"
                  onClick={onClickCancel}
                  disabled={loading || isDisabled}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

EditProfile.propTypes = {
  removeProfileErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errorList: state.errors,
  loading: state.profile.loading,
});

export default connect(mapStateToProps, {
  removeProfileErrors,
  setErrors,
  onProfileSubmit,
})(EditProfile);
