import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Row, Card } from "react-bootstrap";
import "react-phone-number-input/style.css";

import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import Errors from "@notifications/Errors";
import Spinner from "@views/Spinner";

import { validateForm } from "@utils/validation";

import {
  editService,
  cancelSave,
  loadPage,
  setErrors,
  removeServiceErrors,
  getServiceById,
} from "@actions/serviceActions";

import { getUsersList } from "@actions/commonActions";

const EditService = ({
  editService,
  errorList,
  cancelSave,
  loadingService,
  loadPage,
  setErrors,
  removeServiceErrors,
  currentService,
  getServiceById,
}) => {
  const navigate = useNavigate();
  const { service_id } = useParams();

  const initialFormData = {
    title: "",
    service_image: "",
    service_url: "",
    description: "",
  };
  const [formData, setFormData] = React.useState(initialFormData);

  const { title, service_url, description } = formData;

  React.useEffect(() => {
    if (!currentService) return;

    const { title, service_url, description } = currentService;

    const data = {
      title,
      service_url,
      description,
    };

    setFormData((formData) => ({ ...formData, ...data }));
  }, [currentService]);

  React.useEffect(() => {
    if (!service_id) return;
    getServiceById(service_id);
  }, [service_id]);

  const onChange = (e) => {
    if (!e.target) {
      return;
    }

    if (e.target.name === "service_image") {
      let attached_file = e.target.files[0];
      setFormData({ ...formData, service_image: attached_file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  //########################## submit form data ##############################
  const onSubmit = (e) => {
    e.preventDefault();

    removeServiceErrors();

    let validationRules = [
      {
        param: "title",
        msg: "Service name is required.",
      },
      {
        param: "service_url",
        msg: "Service URL is required.",
      },
      {
        param: "description",
        msg: "Description is required.",
      },
    ];

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    const submitData = {};

    for (let i in formData) {
      if (
        formData[i] === "" ||
        formData[i] === null ||
        formData[i] === undefined
      )
        continue;
      submitData[i] = formData[i];
    }

    // console.log("Add Service Submit data", submitData);
    editService(submitData, navigate, service_id).then((res) => {});
  };

  const onClickHandel = (e) => {
    e.preventDefault();
    cancelSave(navigate);
  };

  React.useEffect(() => {
    removeServiceErrors();
  }, []);

  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle="Edit Service"
        crumbs={[
          { name: "Services", path: "/admin/services" },
          { name: "Edit Service" },
        ]}
      />

      {loadingService ? (
        <Spinner />
      ) : (
        <Row>
          <Col xs="12" sm="6">
            <Card className="card-body">
              <Form onSubmit={(e) => onSubmit(e)} autoComplete="off">
                <h4 className="header-title">Service Information</h4>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="title">
                    Service Name <span>*</span>
                  </Form.Label>

                  <Form.Control
                    className={errorList.title ? "invalid" : ""}
                    type="text"
                    id="title"
                    name="title"
                    minLength="5"
                    maxLength="100"
                    value={title}
                    onChange={(e) => onChange(e)}
                  />
                  <Errors current_key="title" key="title" />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="title">
                    Service URL <span>*</span>
                  </Form.Label>

                  <Form.Control
                    className={errorList.service_url ? "invalid" : ""}
                    type="text"
                    id="service_url"
                    name="service_url"
                    minLength="5"
                    maxLength="100"
                    value={service_url}
                    onChange={(e) => onChange(e)}
                  />
                  <Errors current_key="service_url" key="service_url" />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="service_image">
                    Service Image <span>*</span>
                  </Form.Label>

                  <Form.Control
                    className={errorList.service_image ? "invalid" : ""}
                    type="file"
                    id="service_image"
                    name="service_image"
                    accept="image/*"
                    // value={service_image}
                    onChange={(e) => onChange(e)}
                  />
                  <Errors current_key="service_image" key="service_image" />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="description">
                    Description <span>*</span>
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    className={errorList.description ? "invalid" : ""}
                    id="description"
                    name="description"
                    minLength={10}
                    maxLength={250}
                    rows={3}
                    value={description}
                    onChange={(e) => onChange(e)}
                    isInvalid={!!errorList.description}
                  />

                  <Errors current_key="description" key="description" />
                </Form.Group>

                <div className="float-end">
                  <Button
                    className="m-2"
                    type="submit"
                    size="sm"
                    variant="primary"
                  >
                    Submit
                  </Button>
                  <Button
                    className="ml-2"
                    type="reset"
                    size="sm"
                    variant="danger"
                    onClick={onClickHandel}
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

EditService.propTypes = {
  editService: PropTypes.func.isRequired,
  loadPage: PropTypes.func.isRequired,
  errorList: PropTypes.object.isRequired,
  cancelSave: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loadingService: state.service.loadingService,
  currentService: state.service.currentService,
});

export default connect(mapStateToProps, {
  editService,
  cancelSave,
  loadPage,
  setErrors,
  removeServiceErrors,
  getUsersList,
  getServiceById,
})(EditService);
