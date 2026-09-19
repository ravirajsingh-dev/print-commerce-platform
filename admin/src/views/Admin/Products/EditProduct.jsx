import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Select from "react-select";

import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Row, Card } from "react-bootstrap";
import "react-phone-number-input/style.css";

import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import Errors from "@notifications/Errors";
import Spinner from "@views/Spinner";

import { validateForm } from "@utils/validation";

import {
  editProduct,
  getProductById,
  cancelSave,
  loadPage,
  setErrors,
  removeProductErrors,
  resetComponentStore,
} from "@actions/productActions";

import { getUsersList } from "@actions/commonActions";
import { getServicesListAll } from "@actions/serviceActions";

const EditProduct = ({
  editProduct,
  errorList,
  cancelSave,
  loadingProduct,
  loadPage,
  setErrors,
  removeProductErrors,
  resetComponentStore,
  loggedInProduct,
  getUsersList,
  usersList,
  servicesList,
  getServicesListAll,
  getProductById,
  currentProduct,
}) => {
  const navigate = useNavigate();
  const { product_id } = useParams();

  const initialFormData = {
    service: "",
    title: "",
    product_image: "",
    description: "",
  };
  const [formData, setFormData] = React.useState(initialFormData);
  const [selectedService, setSelectedService] = React.useState(null);

  const { title, description } = formData;

  const onChange = (e) => {
    if (!e.target) {
      return;
    }

    if (e.target.name === "product_image") {
      let attached_file = e.target.files[0];
      setFormData({ ...formData, product_image: attached_file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  //########################## submit form data ##############################
  const onSubmit = (e) => {
    e.preventDefault();

    removeProductErrors();

    let validationRules = [
      {
        param: "title",
        msg: "Product name is required.",
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

    // console.log("Add Product Submit data", submitData);
    editProduct(submitData, navigate, product_id).then((res) => {});
  };

  const onClickHandel = (e) => {
    e.preventDefault();
    cancelSave(navigate);
  };

  React.useEffect(() => {
    resetComponentStore();
    loadPage();
    getServicesListAll();
  }, []);

  React.useEffect(() => {
    if (!currentProduct) return;

    const { service, title, product_image, description } = currentProduct;

    const data = {
      service,
      title,
      product_image,
      description,
    };

    setFormData((formData) => ({ ...formData, ...data }));
  }, [currentProduct]);

  React.useEffect(() => {
    if (!currentProduct?.service || !servicesList?.length) return;

    const selectedOption = servicesList.find(
      (each) => each._id === currentProduct?.service
    );

    setSelectedService({
      value: selectedOption?._id,
      label: selectedOption?.title,
    });
  }, [currentProduct, servicesList]);

  React.useEffect(() => {
    if (!product_id) return;
    getProductById(product_id);
  }, [product_id]);

  const handleSelect = (selectedOption) => {
    setSelectedService(selectedOption);
    setFormData((form) => ({ ...form, service: selectedOption?.value }));
  };

  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle="Edit Product"
        crumbs={[
          { name: "Products", path: "/admin/products" },
          { name: "Edit Product" },
        ]}
      />

      {loadingProduct ? (
        <Spinner />
      ) : (
        <Row>
          <Col xs="12" sm="6">
            <Card className="card-body">
              <Form onSubmit={(e) => onSubmit(e)} autoComplete="off">
                <h4 className="header-title">Product Information</h4>

                <Form.Group className="mb-2 mr-sm-3">
                  <Form.Label htmlFor="filter">
                    Service <span>*</span>
                  </Form.Label>
                  <Select
                    id="product"
                    name="product"
                    options={servicesList?.map((r) => ({
                      value: r._id,
                      label: r.title,
                    }))}
                    value={selectedService}
                    placeholder="Select"
                    onChange={(e) => {
                      handleSelect(e);
                    }}
                  />

                  <Errors current_key="product" key="product" />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="title">
                    Product Name <span>*</span>
                  </Form.Label>

                  <Form.Control
                    className={errorList.title ? "invalid" : ""}
                    type="text"
                    id="title"
                    name="title"
                    maxLength="100"
                    value={title}
                    onChange={(e) => onChange(e)}
                  />
                  <Errors current_key="title" key="title" />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="product_image">
                    Product Image <span>*</span>
                  </Form.Label>

                  <Form.Control
                    className={errorList.product_image ? "invalid" : ""}
                    type="file"
                    id="product_image"
                    name="product_image"
                    accept="image/*"
                    // value={product_image}
                    onChange={(e) => onChange(e)}
                  />
                  <Errors current_key="product_image" key="product_image" />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label htmlFor="description">
                    Description <span>*</span>
                  </Form.Label>

                  <Form.Control
                    className={errorList.description ? "invalid" : ""}
                    type="text"
                    id="description"
                    name="description"
                    maxLength="60"
                    value={description}
                    onChange={(e) => onChange(e)}
                    invalid={errorList.description ? true : false}
                  />

                  <Errors current_key="description" key="description" />
                </Form.Group>

                <div className="float-end">
                  <Button
                    className="m-2"
                    type="submit"
                    size="sm"
                    // variant="primary"
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

EditProduct.propTypes = {
  editProduct: PropTypes.func.isRequired,
  loadPage: PropTypes.func.isRequired,
  errorList: PropTypes.object.isRequired,
  cancelSave: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loadingProduct: state.product.loadingProduct,
  currentProduct: state.product.currentProduct,
  loggedInProduct: state.auth.product,
  usersList: state.common.usersList,
  servicesList: state.service.servicesListAll,
});

export default connect(mapStateToProps, {
  editProduct,
  cancelSave,
  loadPage,
  setErrors,
  removeProductErrors,
  resetComponentStore,
  getUsersList,
  getServicesListAll,
  getProductById,
})(EditProduct);
