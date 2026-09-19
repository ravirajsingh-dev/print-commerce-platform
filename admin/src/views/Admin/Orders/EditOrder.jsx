import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BiPlusMedical, BiTrash } from "react-icons/bi";
import { Button, Col, Form, Row, Card } from "react-bootstrap";
import Select from "react-select";

import "react-phone-number-input/style.css";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";

import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import Errors from "@notifications/Errors";
import Spinner from "@views/Spinner";

import { validateForm } from "@utils/validation";
import extractNumber from "@utils/extractNumber";
import { isAdmin } from "@utils/helper";

import {
  editOrder,
  cancelSave,
  loadPage,
  setErrors,
  removeOrderErrors,
  resetComponentStore,
  getOrderById,
} from "@actions/orderActions";

import { getUsersList } from "@actions/commonActions";
import {
  getProductServiceByProductID,
  getServiceCatByProductServiceID,
} from "@utils/helper";

const EditOrder = ({
  editOrder,
  errorList,
  cancelSave,
  loadingOrder,
  loadPage,
  setErrors,
  removeOrderErrors,
  resetComponentStore,
  loggedInUser,
  getUsersList,
  usersList,
  productsListAll,
  getOrderById,
  currentOrder,
  productServicesListAll,
  serviceCatsListAll,
}) => {
  const navigate = useNavigate();
  const { order_id } = useParams();

  const initialFormData = {
    user: "",
    name: "",
    amount: 0,
    full_amount: 0,
    order_items: [
      {
        product: "",
        service_id: "",
        category_id: "",
        quantity: "",
        quality: "",
        width: "",
        height: "",
        width_feet: "",
        height_feet: "",
        amount: "",
        remarks: "",
        lamination: "",
        role_used: "",
      },
    ],
  };
  const [formData, setFormData] = React.useState(initialFormData);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isDisabled, setDisabled] = React.useState(false);
  const [productsList, setProductsList] = React.useState([]);
  const [productServicesList, setProductServicesList] = React.useState([]);
  const [serviceCatsList, setServiceCatsList] = React.useState([]);

  React.useEffect(() => {
    if (!order_id) return;
    getOrderById(order_id);
  }, [order_id]);

  const { order_items, amount, full_amount, name } = formData;

  React.useEffect(() => {
    const prepareList = productsListAll.map((each) => ({
      label: each.title,
      value: each._id,
    }));
    setProductsList(prepareList);
  }, [productsListAll, order_items]);

  const onChange = (e) => {
    if (!e.target) return;

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChange2 = (e, index) => {
    if (!e.target) return;

    const keyName = e.target.name;

    const itemsCopy = order_items.map((data, i) => {
      const data2 = { ...data };
      if (i === index) {
        data2[e.target.name] = e.target.value;

        if (
          keyName === "width_feet" ||
          keyName === "height_feet" ||
          keyName === "quantity"
        ) {
          // --- calculate amount ---
          const amount = calculateProductAmount(data2, i);
          data2["amount"] = amount;

          // --- calculate total square fit ---
          let w = data2.width_feet ? parseFloat(data2.width_feet) : 0;
          let h = data2.height_feet ? parseFloat(data2.height_feet) : 0;

          const sqFeet = w * h;

          console.log("sqFeet=======", sqFeet);
          data2["total_square_fit"] = sqFeet > 0 ? sqFeet : "";
        }
      }

      return data2;
    });

    setFormData((form) => ({
      ...form,
      order_items: itemsCopy,
      amount: itemsCopy.reduce((sum, item) => sum + item.amount, 0),
      full_amount: itemsCopy.reduce((sum, item) => sum + item.amount, 0),
    }));
  };

  //########################## submit form data ##############################
  const onSubmit = (e) => {
    e.preventDefault();

    removeOrderErrors();

    let validationRules = [
      {
        param: "user",
        msg: "User is required.",
      },
    ];

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    const submitData = {};

    const orderItemsCp = order_items?.map((obj) => {
      const filteredObj = Object.fromEntries(
        Object.entries(obj).filter(
          ([key, value]) =>
            value !== "" && value !== undefined && value !== null
        )
      );
      return filteredObj;
    });
    for (let i in formData) {
      if (
        formData[i] === "" ||
        formData[i] === null ||
        formData[i] === undefined
      )
        continue;
      submitData[i] = formData[i];
    }

    submitData["order_items"] = orderItemsCp;
    console.log("Edit Order Submit data", submitData);
    // return;
    editOrder(submitData, navigate, order_id).then((res) => {});
  };

  const onClickHadle = () => {
    setFormData({
      ...formData,
      order_items: [
        ...order_items,
        {
          product: "",
          service_id: "",
          category_id: "",
          quantity: "",
          quality: "",
          width: "",
          height: "",
          width_feet: "",
          height_feet: "",
          amount: "",
          remarks: "",
          lamination: "",
          role_used: "",
        },
      ],
    });
  };

  const onClickCancel = (e) => {
    e.preventDefault();
    cancelSave(navigate);
  };

  React.useEffect(() => {
    getUsersList();
    removeOrderErrors();

    if (!loggedInUser) return;

    // Went to dashboard when order is not a admin
    if (!isAdmin(loggedInUser)) {
      navigate("/admin/dashboard");
    }
  }, [loggedInUser]);

  const handleSelect = (selectedOption) => {
    setSelectedUser(selectedOption);
    setFormData((form) => ({
      ...form,
      user: selectedOption?.value,
    }));
  };

  const onClickRemove = (index) => {
    const itemsCopy = order_items.filter((each, i) => i !== index);
    setFormData({
      ...formData,
      order_items: itemsCopy,
    });
  };

  const handleSelect2 = (field, index) => (selectedOption) => {
    const itemsCopy = order_items.map((data, i) => {
      const data2 = { ...data };
      if (i === index) {
        data2[field] = selectedOption.value;
        data2["qualityArray"] = selectedOption?.quality;
        data2["laminationArray"] = selectedOption?.lamination;
        data2["fields"] = selectedOption?.fields;
        if (selectedOption?.isCatExist) {
          data2["isCatExist"] = selectedOption?.isCatExist;
        }

        if (!selectedOption?.quality && selectedOption.price) {
          data2["price"] = selectedOption.price;
        }
      }

      return data2;
    });

    if (field === "product") {
      const list = getProductServiceByProductID(selectedOption.value);

      console.log("list", list);
      setProductServicesList(
        list.map((each) => ({
          label: each.title,
          value: each._id,
          fields: each.fields,
          price: each.price,
          quality: each.quality,
          isCatExist: each.isCatExist,
          lamination: each.lamination,
        }))
      );
    } else if (field === "service_id") {
      const list = getServiceCatByProductServiceID(selectedOption.value);
      console.log("list", list);

      setServiceCatsList(
        list.map((each) => ({
          label: each.title,
          value: each._id,
          fields: each.fields,
          price: each.price,
          quality: each.quality,
          lamination: each.lamination,
        }))
      );
    }

    setFormData({
      ...formData,
      order_items: itemsCopy,
    });
  };

  const handleSelect3 = (field, index) => (selectedOption) => {
    const itemsCopy = order_items.map((data, i) => {
      const data2 = { ...data };
      if (i === index) {
        data2[field] = selectedOption.value;

        if (field === "quality") {
          data2["price"] = selectedOption.price;
        }
      }

      return data2;
    });

    setFormData({
      ...formData,
      order_items: itemsCopy,
    });
  };

  const prepareOrderItems = (items) => {
    const itemsCopy = items.map((data, i) => {
      const data2 = { ...data };
      // if (i === index) {
      //   data2[field] = selectedOption.value;
      // };

      const pList = getProductServiceByProductID(data?.product);
      const prepareList = pList.map((each) => ({
        label: each.title,
        value: each._id,
        fields: each.fields,
        price: each.price,
        quality: each.quality,
        isCatExist: each.isCatExist,
        lamination: each.lamination,
      }));

      setProductServicesList(prepareList);

      if (data?.category_id) {
        const list = getServiceCatByProductServiceID(data?.service_id);

        setServiceCatsList(
          list.map((each) => ({
            label: each.title,
            value: each._id,
            fields: each.fields,
            price: each.price,
            quality: each.quality,
            lamination: each.lamination,
          }))
        );

        const catInfo = serviceCatsListAll.find(
          (each) => each._id === data?.category_id
        );

        const selectedQuality = catInfo?.quality?.find(
          (each) => each.title === data.quality
        );

        if (selectedQuality) {
          data2["price"] = selectedQuality?.price;
        }
        data2["qualityArray"] = catInfo?.quality;
        data2["laminationArray"] = catInfo?.lamination;
        data2["fields"] = catInfo?.fields;
      } else {
        const pServiceInfo = productServicesListAll.find(
          (each) => each._id === data?.service_id
        );

        console.log("pServiceInfo", pServiceInfo);
        const selectedQuality = pServiceInfo?.quality?.find(
          (each) => each.title === data.quality
        );

        if (selectedQuality) {
          data2["price"] = selectedQuality?.price;
        }

        data2["qualityArray"] = pServiceInfo?.quality;
        data2["laminationArray"] = pServiceInfo?.lamination;
        data2["fields"] = pServiceInfo?.fields;
        data2["isCatExist"] = pServiceInfo?.isCatExist;
      }

      return data2;
    });

    setFormData((formData) => ({ ...formData, order_items: itemsCopy }));
  };

  React.useEffect(() => {
    if (!currentOrder) return;

    const { user, name, amount, full_amount, order_items } = currentOrder;

    if (order_items) {
      prepareOrderItems(order_items);
    }

    const data = {
      user,
      name,
      amount,
      full_amount,
    };

    setFormData((formData) => ({ ...formData, ...data }));
  }, [currentOrder]);

  React.useEffect(() => {
    if (!usersList?.length || !formData?.user) return;
    const { user } = formData;

    const selectedOption = usersList.find((each) => each._id === user);
    setSelectedUser({
      label: selectedOption?.name,
      value: selectedOption?._id,
    });
  }, [formData, usersList]);

  const calculateProductAmount = (orderItem, index) => {
    if (orderItem?.service_id && orderItem?.category_id) {
      const serviceCatInfo = serviceCatsList.find(
        (each) => each.value === orderItem.category_id
      );

      if (serviceCatInfo) {
        // Convert the strings to numbers
        let num1 = orderItem.width_feet ? parseInt(orderItem.width_feet) : 1;
        let num2 = orderItem.height_feet ? parseInt(orderItem.height_feet) : 1;
        let num3 = orderItem.quantity ? parseInt(orderItem.quantity) : 1;
        let num4 = parseInt(
          orderItem.price ? orderItem.price : serviceCatInfo.price
        );

        const calculatedamount = num1 * num2 * num3 * num4;

        return calculatedamount;
      }
    } else if (orderItem?.service_id) {
      const productServiceInfo = productServicesList.find(
        (each) => each.value === orderItem.service_id
      );

      if (productServiceInfo) {
        // Convert the strings to numbers
        let num1 = orderItem.width_feet ? parseInt(orderItem.width_feet) : 1;
        let num2 = orderItem.height_feet ? parseInt(orderItem.height_feet) : 1;
        let num3 = orderItem.quantity ? parseInt(orderItem.quantity) : 1;
        let num4 = parseInt(
          orderItem.price ? orderItem.price : productServiceInfo.price
        );

        const calculatedamount = num1 * num2 * num3 * num4;
        console.log("calculatedamount", calculatedamount);

        return calculatedamount;
      }
    }
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

  const getProductSelectedData = (array, value) => {
    const selected = array.find((each) => each._id === value);

    return selected
      ? {
          label: selected.title,
          value: selected._id,
        }
      : null;
  };

  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle="Edit Order"
        crumbs={[
          { name: "Orders", path: "/admin/orders" },
          { name: "Edit Order" },
        ]}
      />

      {loadingOrder ? (
        <Spinner />
      ) : (
        <Row>
          <Col xs="12">
            <Card className="card-body">
              <Form onSubmit={(e) => onSubmit(e)} autoComplete="off">
                <h4 className="header-title">Order Information</h4>
                <Row>
                  <Col xs="12" sm="6">
                    <Form.Group>
                      <Form.Label htmlFor="filter">
                        User <span>*</span>
                      </Form.Label>

                      <Select
                        id="user"
                        name="user"
                        options={usersList?.map((r) => ({
                          value: r._id,
                          label: r.name,
                        }))}
                        value={selectedUser}
                        placeholder="Select"
                        onChange={handleSelect}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs="12" sm="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="name">
                        Name <span>*</span>
                      </Form.Label>

                      <Form.Control
                        className={errorList.name ? "invalid" : ""}
                        type="text"
                        id="name"
                        name="name"
                        maxLength="100"
                        value={name}
                        onChange={(e) => onChange(e)}
                      />
                      <Errors current_key="name" key="name" />
                    </Form.Group>
                  </Col>

                  <Col xs="12" className="my-4">
                    <Row>
                      {order_items?.map((each, index) => (
                        <React.Fragment key={index}>
                          <Col xs="2">
                            <Form.Group className="form-group">
                              <Form.Label>Product *</Form.Label>
                              <Select
                                id="product"
                                name="product"
                                placeholder="Select"
                                options={productsList}
                                value={getProductSelectedData(
                                  productsListAll,
                                  each.product
                                )}
                                onChange={handleSelect2("product", index)}
                              />

                              <Errors
                                current_key={`order_items[${index}].product`}
                                key={`order_items[${index}].product`}
                              />
                            </Form.Group>
                          </Col>

                          {each.product ? (
                            <Col xs="2">
                              <Form.Group className="form-group">
                                <Form.Label>Media Name*</Form.Label>
                                <Select
                                  id="service_id"
                                  name="service_id"
                                  options={getProductServiceByProductID(
                                    each.product
                                  ).map((x) => ({
                                    label: x.title,
                                    value: x._id,
                                    fields: x.fields,
                                    price: x.price,
                                    quality: x.quality,
                                    isCatExist: x.isCatExist,
                                    lamination: x.lamination,
                                  }))}
                                  value={getProductServiceByProductID(
                                    each.product
                                  )
                                    .map((x) => ({
                                      label: x.title,
                                      value: x._id,
                                      fields: x.fields,
                                      price: x.price,
                                      quality: x.quality,
                                      isCatExist: x.isCatExist,
                                      lamination: x.lamination,
                                    }))
                                    .find((b) => b.value === each.service_id)}
                                  onChange={handleSelect2("service_id", index)}
                                  isDisabled={isDisabled}
                                  placeholder="Select"
                                />

                                <Errors
                                  current_key={`order_items[${index}].service_id`}
                                  key={`order_items[${index}].service_id`}
                                />
                              </Form.Group>
                            </Col>
                          ) : null}

                          {each?.isCatExist || each?.category_id ? (
                            <>
                              <Col xs="2">
                                <Form.Group className="form-group">
                                  <Form.Label>Service Category *</Form.Label>
                                  <Select
                                    id="category_id"
                                    name="category_id"
                                    options={serviceCatsList}
                                    value={serviceCatsList.find(
                                      (b) => b.value === each.category_id
                                    )}
                                    onChange={handleSelect2(
                                      "category_id",
                                      index
                                    )}
                                    isDisabled={isDisabled}
                                    placeholder="Select"
                                  />

                                  <Errors
                                    current_key={`order_items[${index}].category_id`}
                                    key={`order_items[${index}].category_id`}
                                  />
                                </Form.Group>
                              </Col>

                              {each?.fields?.includes("quality") ? (
                                <Col xs="2">
                                  {console.log("each", each)}
                                  <Form.Group className="form-group">
                                    <Form.Label>Quality</Form.Label>
                                    {/* <Form.Control
                                      type="text"
                                      name="quality"
                                      value={each[index]?.quality}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                    /> */}

                                    <Select
                                      name="service_id"
                                      options={each?.qualityArray?.map((q) => ({
                                        label: q.title,
                                        value: q.title,
                                        price: q.amount,
                                      }))}
                                      value={getQualitySelectedData(
                                        each?.qualityArray,
                                        each?.quality
                                      )}
                                      onChange={handleSelect3("quality", index)}
                                      isDisabled={isDisabled}
                                      placeholder="Select"
                                    />

                                    <Errors
                                      current_key={`items[${index}].quality`}
                                      key={`items[${index}].quality`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("lamination") ? (
                                <Col xs="2">
                                  <Form.Group className="form-group">
                                    <Form.Label>Lamination</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="lamination"
                                      value={each?.lamination}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                    />

                                    <Errors
                                      current_key={`items[${index}].lamination`}
                                      key={`items[${index}].lamination`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("width") ? (
                                <Col xs="2">
                                  <Form.Group className="form-group">
                                    <Form.Label>Width (inch)</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="width"
                                      value={each?.width}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />

                                    <Errors
                                      current_key={`items[${index}].width`}
                                      key={`items[${index}].width`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("height") ? (
                                <Col xs="3">
                                  <Form.Group className="form-group">
                                    <Form.Label>Height (inch)</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="height"
                                      value={each?.height}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />

                                    <Errors
                                      current_key={`items[${index}].height`}
                                      key={`items[${index}].height`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("width_feet") ? (
                                <Col xxl="2" lg="4" md="4" xs="6">
                                  <Form.Group className="form-group">
                                    <Form.Label>Width (Feet)</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="width_feet"
                                      value={each?.width_feet}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />

                                    <Errors
                                      current_key={`items[${index}].width_feet`}
                                      key={`items[${index}].width_feet`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("height_feet") ? (
                                <Col xxl="2" lg="4" md="4" xs="6">
                                  <Form.Group className="form-group">
                                    <Form.Label>Height (Feet)</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="height_feet"
                                      value={each?.height_feet}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />

                                    <Errors
                                      current_key={`items[${index}].height_feet`}
                                      key={`items[${index}].height_feet`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("height") ||
                              each?.fields?.includes("width") ? (
                                <Col xxl="2" lg="4" md="4" xs="6">
                                  <Form.Group className="form-group">
                                    <Form.Label>Total Square Feet</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="total_square_fit"
                                      value={each?.total_square_fit}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />

                                    <Errors
                                      current_key={`items[${index}].toal_square_fit`}
                                      key={`items[${index}].toal_square_fit`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.category_id ? (
                                <>
                                  <Col xxl="2" lg="4" md="4" xs="6">
                                    <Form.Group className="form-group">
                                      <Form.Label>Quantity</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="quantity"
                                        value={each?.quantity}
                                        onChange={(e) => onChange2(e, index)}
                                        disabled={isDisabled}
                                        onKeyPress={(event) => {
                                          if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                          }
                                        }}
                                      />

                                      <Errors
                                        current_key={`items[${index}].quantity`}
                                        key={`items[${index}].quantity`}
                                      />
                                    </Form.Group>
                                  </Col>

                                  <Col xxl="2" lg="4" md="4" xs="6">
                                    <Form.Group className="form-group">
                                      <Form.Label>Amount</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="amount"
                                        value={each?.amount}
                                        onChange={(e) => onChange2(e, index)}
                                        disabled={true}
                                        onKeyPress={(event) => {
                                          if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                          }
                                        }}
                                      />

                                      <Errors
                                        current_key={`items[${index}].amount`}
                                        key={`items[${index}].amount`}
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col xxl="2" lg="4" md="4" xs="6">
                                    <Form.Group className="form-group">
                                      <Form.Label>Remarks</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="remarks"
                                        value={each?.remarks}
                                        onChange={(e) => onChange2(e, index)}
                                        disabled={isDisabled}
                                      />

                                      <Errors
                                        current_key={`items[${index}].remarks`}
                                        key={`items[${index}].remarks`}
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col xxl="2" lg="4" md="4" xs="6">
                                    <Form.Group className="form-group">
                                      <Form.Label>Role Used</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="role_used"
                                        value={each?.role_used}
                                        onChange={(e) => onChange2(e, index)}
                                        onKeyPress={(event) => {
                                          if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                          }
                                        }}
                                        disabled={isDisabled}
                                      />

                                      <Errors
                                        current_key={`items[${index}].role_used`}
                                        key={`items[${index}].role_used`}
                                      />
                                    </Form.Group>
                                  </Col>
                                </>
                              ) : null}
                            </>
                          ) : (
                            <>
                              {each?.fields?.includes("quality") ? (
                                <Col xxl="2" lg="4" md="4" xs="6">
                                  <Form.Group className="form-group">
                                    <Form.Label>Quality</Form.Label>
                                    <Select
                                      id="quality"
                                      name="quality"
                                      options={each?.qualityArray?.map((q) => ({
                                        label: q.title,
                                        value: q.title,
                                        price: q.price,
                                      }))}
                                      value={getQualitySelectedData(
                                        each?.qualityArray,
                                        each?.quality
                                      )}
                                      onChange={handleSelect3("quality", index)}
                                      isDisabled={isDisabled}
                                      placeholder="Select"
                                    />

                                    <Errors
                                      current_key={`items[${index}].quality`}
                                      key={`items[${index}].quality`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("lamination") ? (
                                <Col xxl="2" lg="4" md="4" xs="6">
                                  <Form.Group className="form-group">
                                    <Form.Label>Lamination</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="lamination"
                                      value={each?.lamination}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                    />

                                    <Errors
                                      current_key={`items[${index}].lamination`}
                                      key={`items[${index}].lamination`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("width") ? (
                                <Col xs="2">
                                  <Form.Group className="form-group">
                                    <Form.Label>Width (inch)</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="width"
                                      value={each?.width}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />

                                    <Errors
                                      current_key={`items[${index}].width`}
                                      key={`items[${index}].width`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("height") ? (
                                <Col xs="2">
                                  <Form.Group className="form-group">
                                    <Form.Label>Height (inch)</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="height"
                                      value={each?.height}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />

                                    <Errors
                                      current_key={`items[${index}].height`}
                                      key={`items[${index}].height`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("width_feet") ? (
                                <Col xs="2">
                                  <Form.Group className="form-group">
                                    <Form.Label>Width (Feet)</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="width_feet"
                                      value={each?.width_feet}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />

                                    <Errors
                                      current_key={`items[${index}].width_feet`}
                                      key={`items[${index}].width_feet`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("height_feet") ? (
                                <Col xs="2">
                                  <Form.Group className="form-group">
                                    <Form.Label>Height (Feet)</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="height_feet"
                                      value={each?.height_feet}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled={isDisabled}
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />

                                    <Errors
                                      current_key={`items[${index}].height_feet`}
                                      key={`items[${index}].height_feet`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              {each?.fields?.includes("height") ||
                              each?.fields?.includes("width") ? (
                                <Col xs="2">
                                  <Form.Group className="form-group">
                                    <Form.Label>Total Square Feet</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="total_square_fit"
                                      value={each?.total_square_fit}
                                      onChange={(e) => onChange2(e, index)}
                                      disabled
                                      onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }}
                                    />

                                    <Errors
                                      current_key={`items[${index}].total_square_fit`}
                                      key={`items[${index}].total_square_fit`}
                                    />
                                  </Form.Group>
                                </Col>
                              ) : null}

                              <Col xs="2">
                                <Form.Group className="form-group">
                                  <Form.Label>Quantity</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="quantity"
                                    value={each?.quantity}
                                    onChange={(e) => onChange2(e, index)}
                                    disabled={isDisabled}
                                    onKeyPress={(event) => {
                                      if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                  />

                                  <Errors
                                    current_key={`items[${index}].quantity`}
                                    key={`items[${index}].quantity`}
                                  />
                                </Form.Group>
                              </Col>

                              {each?.service_id ? (
                                <>
                                  <Col xs="2">
                                    <Form.Group className="form-group">
                                      <Form.Label>Amount</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="amount"
                                        value={each?.amount}
                                        onChange={(e) => onChange2(e, index)}
                                        disabled={true}
                                        onKeyPress={(event) => {
                                          if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                          }
                                        }}
                                      />

                                      <Errors
                                        current_key={`items[${index}].amount`}
                                        key={`items[${index}].amount`}
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col xs="2">
                                    <Form.Group className="form-group">
                                      <Form.Label>Remarks</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="remarks"
                                        value={each?.remarks}
                                        onChange={(e) => onChange2(e, index)}
                                        disabled={isDisabled}
                                      />

                                      <Errors
                                        current_key={`items[${index}].remarks`}
                                        key={`items[${index}].remarks`}
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col xs="2">
                                    <Form.Group className="form-group">
                                      <Form.Label>Role Used</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="role_used"
                                        value={each?.role_used}
                                        onChange={(e) => onChange2(e, index)}
                                        onKeyPress={(event) => {
                                          if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                          }
                                        }}
                                        disabled={isDisabled}
                                      />

                                      <Errors
                                        current_key={`items[${index}].role_used`}
                                        key={`items[${index}].role_used`}
                                      />
                                    </Form.Group>
                                  </Col>
                                </>
                              ) : null}
                            </>
                          )}

                          {/* {!isDisabled && order_items?.length > 1 ? (
                            <Col xxl="1" lg="2" md="3" xs="6">
                              <Button
                                className="c-red mt-4"
                                variant="link"
                                onClick={(e) => onClickRemove(index)}
                              >
                                Remove
                              </Button>
                            </Col>
                          ) : null} */}

                          <hr className="tab-hr-line" />
                        </React.Fragment>
                      ))}

                      {!isDisabled ? (
                        <div>
                          <Button
                            color="primary"
                            size="sm"
                            onClick={(e) => onClickHadle()}
                          >
                            <BiPlusMedical /> Add New
                          </Button>

                          <div>
                            <Errors current_key="items" key="items" />
                          </div>
                        </div>
                      ) : null}
                    </Row>
                  </Col>

                  <Col sm="12" md="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="amount">
                        Amount <span>*</span>
                      </Form.Label>

                      <Form.Control
                        className={errorList.amount ? "invalid" : ""}
                        type="text"
                        id="amount"
                        name="amount"
                        value={amount}
                        onChange={(e) => onChange(e)}
                      />
                      <Errors current_key="amount" key="amount" />
                    </Form.Group>
                  </Col>

                  <Col sm="12" md="6">
                    <Form.Group className="form-group">
                      <Form.Label htmlFor="full_amount">
                        Full Amount <span>*</span>
                      </Form.Label>

                      <Form.Control
                        className={errorList.full_amount ? "invalid" : ""}
                        type="mail"
                        id="full_amount"
                        name="full_amount"
                        value={full_amount}
                        onChange={(e) => onChange(e)}
                        invalid={errorList.full_amount ? true : false}
                      />

                      <Errors current_key="full_amount" key="full_amount" />
                    </Form.Group>
                  </Col>

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
                      onClick={onClickCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
};

EditOrder.propTypes = {
  editOrder: PropTypes.func.isRequired,
  loadPage: PropTypes.func.isRequired,
  errorList: PropTypes.object.isRequired,
  cancelSave: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loadingOrder: state.order.loadingOrder,
  currentOrder: state.order.currentOrder,
  loggedInUser: state.auth.user,
  usersList: state.common.usersList,
  productsListAll: state.product.productsListAll,
  productServicesListAll: state.productService.productServicesListAll,
  serviceCatsListAll: state.serviceCat.serviceCatsListAll,
});

export default connect(mapStateToProps, {
  editOrder,
  cancelSave,
  loadPage,
  setErrors,
  removeOrderErrors,
  resetComponentStore,
  getUsersList,
  getOrderById,
})(EditOrder);
