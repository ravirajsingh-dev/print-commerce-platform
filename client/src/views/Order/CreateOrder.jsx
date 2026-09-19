import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Image,
} from "react-bootstrap";
import Select from "react-select";

import Errors from "@src/Notifications/Errors";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";
import {
  cancelSave,
  create,
  loadPage,
  removeOrderErrors,
  resetComponentStore,
  setErrors,
} from "@src/actions/orderActions";
import { validateForm } from "@src/utils/validation";

const CreateOrder = ({
  errorList,
  loggedInUser,
  create,
  cancelSave,
  loadPage,
  setErrors,
  removeOrderErrors,
  resetComponentStore,
}) => {
  const location = useLocation();
  const selectedProduct = location.state?.orderProduct || {};

  const navigate = useNavigate();

  // Determine product type and details
  const { productType, productData } = useMemo(() => {
    if (selectedProduct.ProductServices) {
      return {
        productType: "ProductServices",
        productData: selectedProduct.ProductServices,
      };
    } else if (selectedProduct.ServicesCategories) {
      return {
        productType: "ServicesCategories",
        productData: selectedProduct.ServicesCategories,
      };
    }
    return { productType: "", productData: {} };
  }, [selectedProduct]);

  const initialFormData = {
    name: loggedInUser?.name || "",
    remark: "",
    quality: null,
    fileUpload: null,
    order_items: [
      {
        product: "",
        service_id: "",
        category_id: "",
        quantity: "",
        quality: "",
        remark: "",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormData);

  React.useEffect(() => {
    if (!selectedProduct) return;

    const { ProductServices, ServicesCategories } = selectedProduct;

    const prepareData = [];
    if (ServicesCategories?.product_service) {
      prepareData.push({
        product: ServicesCategories?.product,
        service_id: ServicesCategories?.product_service,
        category_id: ServicesCategories?._id,
        qualityArray: ServicesCategories?.quality,
        price: ServicesCategories?.price,
      });
    } else {
      prepareData.push({
        product: ProductServices?.product,
        service_id: ProductServices?._id,
        qualityArray: ProductServices?.quality,
        price: ProductServices?.price,
      });
    }

    setFormData((prev) => ({ ...prev, order_items: prepareData }));
  }, [selectedProduct]);

  const { order_items } = formData;

  React.useEffect(() => {
    resetComponentStore();
    loadPage();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form Submitted:", formData);
  // };

  const onSubmit = (e) => {
    e.preventDefault();

    removeOrderErrors();

    let validationRules = [
      {
        param: "name",
        msg: "Name is required.",
      },
      {
        param: "quantity",
        msg: "Quantity is required.",
      },
    ];

    const errors = validateForm(formData, validationRules);

    order_items.forEach((each) => {
      if (each?.qualityArray && !each?.quality) {
        errors.push({
          param: "quality",
          msg: "Please fill all qualities",
        });
      }
    });

    // console.log("errors", errors);

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

    console.log(submitData);

    // return;
    create(submitData, navigate).then((res) => {});
  };

  const handleSelect = (field, index) => (selectedOption) => {
    const itemsCopy = order_items.map((data, i) => {
      const data2 = { ...data };
      if (i === index) {
        data2[field] = selectedOption.value;

        if (field === "quality") {
          data2["amount"] = selectedOption.amount;
        }
      }

      return data2;
    });

    setFormData({
      ...formData,
      order_items: itemsCopy,
    });
  };

  const getQualitySelectedData = (array, value) => {
    const selected = array.find((each) => each.title === value);

    return selected
      ? {
          label: selected.title,
          value: selected.title,
        }
      : null;
  };

  const onChange = (e, index) => {
    if (!e.target) return;
    const itemsCopy = order_items.map((data, i) => {
      const data2 = { ...data };
      if (i === index) {
        data2["quantity"] = e.target.value;
      }

      return data2;
    });

    setFormData({
      ...formData,
      order_items: itemsCopy,
    });
  };

  return (
    <Container className="p-5">
      <Row>
        <AppBreadCrumb
          title="Create Order"
          breadcrumbs={[
            { label: "Shree Advertising", url: "/" },
            { label: "Our Services", url: "/our-services" },
            // ...(productType === "ProductServices"
            //   ? [
            //       {
            //         label: "Product Services",
            //         url: `/product-services/${productData.product}`,
            //       },
            //     ]
            //   : [
            //       {
            //         label: "Services Categories",
            //         url: `/services-categories/${productData.product_service}`,
            //       },
            //     ]),
            { label: "Create Order" },
          ]}
        />
      </Row>

      <Row className="mt-5">
        <Col xs="12" sm="7" className="custom-input-card">
          <Card>
            <Card.Body>
              <Form onSubmit={(e) => onSubmit(e)}>
                <Form.Group className="form-group-custom mb-3">
                  <Form.Label>
                    Name <span>*</span>
                  </Form.Label>
                  <Form.Control
                    className={errorList.name ? "invalid" : ""}
                    type="text"
                    name="name"
                    maxLength="100"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <Errors current_key="name" key="name" />
                </Form.Group>

                {order_items?.map((eachItem, index) => (
                  <>
                    {eachItem?.qualityArray ? (
                      <Form.Group
                        className="form-group-custom mb-3"
                        style={{ zIndex: 20 }}
                      >
                        <Form.Label>Product Quality*</Form.Label>
                        <Select
                          name="quality"
                          styles={{ zIndex: 20 }}
                          options={
                            eachItem?.qualityArray?.map((q) => ({
                              value: q.title,
                              amount: q.price,
                              label: `${q.title} - ₹${q.price}`,
                            })) || []
                          }
                          value={getQualitySelectedData(
                            eachItem?.qualityArray,
                            eachItem.quality
                          )}
                          placeholder="Select"
                          isRequired={true}
                          onChange={handleSelect("quality", index)}
                        />

                        <Errors current_key="quality" key="quality" />
                      </Form.Group>
                    ) : null}

                    <Form.Group className="form-group-custom">
                      <Form.Label htmlFor="quantity">
                        Quantity <span>*</span>
                      </Form.Label>

                      <Form.Control
                        className={errorList.quantity ? "invalid" : ""}
                        type="text"
                        id="quantity"
                        name="quantity"
                        maxLength="60"
                        value={eachItem?.quantity}
                        requried
                        onChange={(e) => onChange(e, index)}
                        invalid={errorList.quantity ? true : false}
                      />

                      <Errors current_key="quantity" key="quantity" />
                    </Form.Group>
                  </>
                ))}

                <Form.Group className="form-group-custom mb-3">
                  <Form.Label>
                    Remark <span>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    className={errorList.remark ? "invalid" : ""}
                    name="remark"
                    maxLength="500"
                    rows={3}
                    value={formData.remark}
                    onChange={handleChange}
                  />
                  <Errors current_key="remark" />
                </Form.Group>

                {/* <Form.Group className="form-group-custom mb-3">
                  <Form.Label>Upload File</Form.Label>
                  <Form.Control
                    type="file"
                    name="fileUpload"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </Form.Group> */}

                <Form.Group className="form-group-custom mb-3">
                  <Button
                    type="submit"
                    className="w-100 rr-btn create-order-btn fadeInLeft animated"
                  >
                    Create Order
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col xl="5" lg="5" md="5" xs="12" className="wow fadeInUp">
          <div className="latest-service__item-custom text-center">
            <div className="latest-service__item-title">
              {productData.title}
            </div>
            <div className="latest-service__item-icon-custom">
              <Image
                src={productData.image}
                alt={productData.title}
                className="mb-3"
              />
            </div>
            <div className="latest-service__item-text">
              <p className="rr-el-re-dec">{productData.description}</p>
              {order_items[0]?.qualityArray &&
                order_items[0]?.qualityArray?.length > 0 && (
                  <div>
                    <strong>Quality Options:</strong>
                    {productData.quality.map((q, index) => (
                      <p key={index} className="rr-el-re-dec">
                        {q.title} - ₹{q.price}
                      </p>
                    ))}
                  </div>
                )}

              {order_items[0]?.price ? (
                <div>
                  <strong>Price : {order_items[0]?.price}</strong>
                </div>
              ) : null}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

CreateOrder.propTypes = {
  errorList: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loggedInUser: state.auth.user,
});

export default connect(mapStateToProps, {
  create,
  cancelSave,
  loadPage,
  setErrors,
  removeOrderErrors,
  resetComponentStore,
})(CreateOrder);
