import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Row, Card } from "react-bootstrap";
import Select from "react-select";
import { BiPlusMedical, BiTrash } from "react-icons/bi";

import "react-phone-number-input/style.css";

import AppBreadcrumb from "../../Layout/AppBreadCrumb";
import Errors from "@notifications/Errors";

import { validateForm } from "@utils/validation";
import { isAdmin } from "@utils/helper";

import { getProductServicesByID } from "@actions/productServiceActions";

import {
  create,
  editServiceCat,
  cancelSave,
  loadPage,
  setErrors,
  removeServiceCatErrors,
  resetComponentStore,
} from "@actions/serviceCategoryActions";

import { getProductsListAll } from "@actions/productActions";
import * as constants from "@constants/index";

const ServiceCatForm = ({
  create,
  errorList,
  cancelSave,
  loadPage,
  setErrors,
  removeServiceCatErrors,
  resetComponentStore,
  loggedInUser,
  serviceCatID,
  currentServiceCat,
  productsList,
  getProductsListAll,
  editServiceCat,
  loadingProductService,
  getProductServicesByID,
  productServices,
}) => {
  const navigate = useNavigate();
  const [isDisabled, setDisabled] = React.useState(serviceCatID ? true : false);
  const toggleEdit = () => setDisabled(!isDisabled);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [productServicesList, setProductServicesList] = React.useState([]);
  const [selectedProductService, setSelectedProductService] =
    React.useState(null);
  const [serviceCatFields, setServiceCatFields] = React.useState(null);

  const initialFormData = {
    product: "",
    product_service: "",
    title: "",
    image: "",
    production_time: "",
    price: "",
    price_per_square: "",
    stock: "",
    description: "",
    fields: [],
    quality: [
      {
        title: "",
        price: "",
      },
    ],
    lamination: [],
  };
  const [formData, setFormData] = React.useState(initialFormData);

  const loadProviderFormData = (currentServiceCat) => {
    const {
      product,
      product_service,
      title,
      image,
      production_time,
      price,
      price_per_square,
      stock,
      description,
    } = currentServiceCat;

    const data = {
      product,
      product_service,
      title,
      image,
      production_time,
      price,
      price_per_square,
      stock,
      description,
    };
    setFormData((formData) => ({ ...formData, ...data }));
  };

  React.useEffect(() => {
    if (!serviceCatID || !currentServiceCat) return;

    loadProviderFormData(currentServiceCat);
  }, [currentServiceCat]);

  const {
    product,
    product_service,
    title,
    image,
    production_time,
    price,
    price_per_square,
    stock,
    description,
    quality,
  } = formData;

  const onChange = (e) => {
    if (!e.target) return;

    if (e.target.name === "image") {
      let attached_file = e.target.files[0];
      setFormData({ ...formData, image: attached_file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  React.useEffect(() => {
    if (!product || !productsList?.length) return;

    const selected = productsList.find((each) => each._id === product);

    if (selected) {
      setSelectedProduct({
        value: selected._id,
        label: selected.title,
      });
    }
  }, [product, productsList]);

  //########################## submit form data ##############################
  const onSubmit = (e) => {
    e.preventDefault();

    removeServiceCatErrors();

    let validationRules = [
      {
        param: "product",
        msg: "Product is required.",
      },
      {
        param: "title",
        msg: "Service Name is required.",
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

    const fieldsArry = serviceCatFields?.map((each) => each.key);

    submitData["fields"] = fieldsArry;

    // console.log("Provider Submit data", submitData);
    if (serviceCatID) {
      editServiceCat(submitData, navigate, serviceCatID).then((res) => {});
    } else {
      create(submitData, navigate).then((res) => {});
    }
  };

  const onClickHandel = (e) => {
    e.preventDefault();
    cancelSave(navigate);
  };

  React.useEffect(() => {
    if (!serviceCatID) {
      resetComponentStore();
      loadPage();
    }
    getProductsListAll();

    if (!loggedInUser) return;

    // Went to dashboard when user is not a admin
    if (!isAdmin(loggedInUser)) {
      navigate("/admin/dashboard");
    }
  }, [loggedInUser]);

  const handleSelect = (type) => (selectedOption) => {
    if (type === "field") {
      setServiceCatFields(selectedOption);
    } else if (type === "product") {
      setFormData((form) => ({ ...form, product: selectedOption?.value }));
      setSelectedProduct(selectedOption);
      getProductServicesByID(selectedOption?.value);
    } else {
      setFormData((form) => ({
        ...form,
        product_service: selectedOption?.value,
      }));
      setSelectedProductService(selectedOption);
    }
  };

  const onChange2 = (e) => {
    if (!e.target) return;

    const value = e.target.value;
    const valueArray = value.split(",");

    setFormData({ ...formData, [e.target.name]: valueArray });
  };

  const onChange3 = (e, index, key) => {
    if (!e.target) return;

    switch (e.target.name) {
      case "quality":
        const field = e.target.name;
        const listCopy = quality?.map((data, i) => {
          const data2 = { ...data };
          if (i === index) {
            data2[key] = e.target.value;
          }

          return data2;
        });
        setFormData((form) => ({ ...form, quality: listCopy }));
        break;
      default:
    }
  };

  const onClickRemove = (key, index) => {
    switch (key) {
      case "quality":
        const itemsCopy = quality.filter((each, i) => i !== index);
        setFormData((form) => ({ ...form, quality: itemsCopy }));
        break;
      default:
    }
  };

  const onClickHadle = (key) => {
    switch (key) {
      case "quality":
        setFormData({
          ...formData,
          quality: [
            ...quality,
            {
              title: "",
              price: "",
            },
          ],
        });
        break;
      default:
    }
  };

  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle="Create New Service Category"
        crumbs={[
          { name: "Service Categories", path: "/admin/service-categories" },
          { name: "Create New Service Category" },
        ]}
      />

      <Row>
        <Col xs="12" sm="6">
          <Card className="card-body">
            <Form onSubmit={(e) => onSubmit(e)} autoComplete="off">
              <h4 className="header-title">Service Category Information</h4>

              <Form.Group className="mb-2 mr-sm-3">
                <Form.Label htmlFor="filter">
                  Product <span>*</span>
                </Form.Label>
                <Select
                  id="product"
                  name="product"
                  options={productsList?.map((r) => ({
                    value: r._id,
                    label: r.title,
                  }))}
                  value={selectedProduct}
                  placeholder="Select"
                  onChange={handleSelect("product")}
                />

                <Errors current_key="product" key="product" />
              </Form.Group>

              <Form.Group className="mb-2 mr-sm-3">
                <Form.Label htmlFor="filter">
                  Product Service<span>*</span>
                </Form.Label>
                <Select
                  id="product_service"
                  name="product_service"
                  options={productServices?.map((r) => ({
                    value: r._id,
                    label: r.title,
                  }))}
                  value={selectedProductService}
                  placeholder="Select"
                  onChange={handleSelect("productService")}
                />

                <Errors current_key="product_service" key="product_service" />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label htmlFor="title">
                  Title <span>*</span>
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
                <Form.Label htmlFor="image">
                  Image <span>*</span>
                </Form.Label>

                <Form.Control
                  className={errorList.image ? "invalid" : ""}
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  // value={image}
                  onChange={(e) => onChange(e)}
                />
                <Errors current_key="image" key="image" />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label htmlFor="production_time">
                  Production Time <span>*</span>
                </Form.Label>

                <Form.Control
                  className={errorList.production_time ? "invalid" : ""}
                  type="text"
                  id="production_time"
                  name="production_time"
                  maxLength="60"
                  value={production_time}
                  onChange={(e) => onChange(e)}
                  invalid={errorList.production_time ? true : false}
                />

                <Errors current_key="production_time" key="production_time" />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label htmlFor="price">
                  price <span>*</span>
                </Form.Label>

                <Form.Control
                  className={errorList.price ? "invalid" : ""}
                  type="text"
                  id="price"
                  name="price"
                  maxLength="60"
                  value={price}
                  onChange={(e) => onChange(e)}
                  invalid={errorList.price ? true : false}
                />

                <Errors current_key="price" key="price" />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label htmlFor="fields">
                  Fields <span>*</span>
                </Form.Label>

                <Select
                  id="fields"
                  name="fields"
                  options={constants.serviceCatFieldsGlobal?.map((r) => ({
                    value: r.value,
                    label: r.label,
                    key: r.key,
                    type: r.type,
                  }))}
                  value={serviceCatFields}
                  isMulti={true}
                  placeholder="Select"
                  onChange={handleSelect("field")}
                />

                <Errors current_key="fields" key="fields" />
              </Form.Group>

              {serviceCatFields?.map((eachField) => (
                <Form.Group className="form-group">
                  <Form.Label htmlFor="price_per_square">
                    {eachField.label} <span>*</span>
                  </Form.Label>

                  {eachField.type === "dropdown" ? (
                    <>
                      {formData[eachField.key]?.map((each, index) => (
                        <Row key={index}>
                          <Col sm="4">
                            <Form.Control
                              className={
                                errorList[`${eachField.key}`] ? "invalid" : ""
                              }
                              type="text"
                              id={`${eachField.key}`}
                              name={`${eachField.key}`}
                              maxLength="60"
                              value={each?.title}
                              onChange={(e) => onChange3(e, index, "title")}
                              invalid={
                                errorList[`${eachField.key}`] ? true : false
                              }
                              required
                            />
                          </Col>
                          <Col sm="4">
                            <Form.Control
                              className={
                                errorList[`${eachField.key}`] ? "invalid" : ""
                              }
                              type="text"
                              id={`${eachField.key}`}
                              name={`${eachField.key}`}
                              maxLength="60"
                              value={each?.price}
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                              onChange={(e) => onChange3(e, index, "price")}
                              invalid={
                                errorList[`${eachField.key}`] ? true : false
                              }
                              required
                            />
                          </Col>
                          <Col sm="4">
                            <Button
                              className="c-red"
                              variant="link"
                              onClick={(e) =>
                                onClickRemove(eachField.key, index)
                              }
                            >
                              Remove
                            </Button>

                            <Button
                              color="primary"
                              size="sm"
                              onClick={(e) => onClickHadle(eachField.key)}
                            >
                              <BiPlusMedical /> Add New
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    </>
                  ) : (
                    <Form.Control
                      className={errorList[`${eachField.key}`] ? "invalid" : ""}
                      type={`${eachField.type}`}
                      id={`${eachField.key}`}
                      name={`${eachField.key}`}
                      maxLength="60"
                      value={eachField[eachField.key]}
                      onChange={(e) => onChange(e)}
                      invalid={errorList[`${eachField.key}`] ? true : false}
                      required
                    />
                  )}

                  <Errors
                    current_key={`${eachField.key}`}
                    key={`${eachField.key}`}
                  />
                </Form.Group>
              ))}

              <Form.Group className="form-group">
                <Form.Label htmlFor="stock">
                  Stock <span>*</span>
                </Form.Label>

                <Form.Control
                  className={errorList.stock ? "invalid" : ""}
                  type="text"
                  id="stock"
                  name="stock"
                  maxLength="60"
                  value={stock}
                  onChange={(e) => onChange(e)}
                  invalid={errorList.stock ? true : false}
                />

                <Errors current_key="stock" key="stock" />
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
                  disabled={loadingProductService}
                >
                  {loadingProductService ? "Saving..." : "Save"}
                </Button>
                <Button
                  className="ml-2"
                  type="reset"
                  size="sm"
                  variant="danger"
                  onClick={onClickHandel}
                  disabled={loadingProductService}
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

ServiceCatForm.propTypes = {
  create: PropTypes.func.isRequired,
  errorList: PropTypes.object.isRequired,
  cancelSave: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  currentServiceCat: state.serviceCat.currentServiceCat,
  loggedInUser: state.auth.user,
  productsList: state.product.productsListAll,
  productServices: state.productService.productServices,
  loadingProductService: state.serviceCat.loadingProductService,
});

export default connect(mapStateToProps, {
  create,
  cancelSave,
  loadPage,
  setErrors,
  removeServiceCatErrors,
  resetComponentStore,
  getProductsListAll,
  editServiceCat,
  getProductServicesByID,
})(ServiceCatForm);
