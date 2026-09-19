import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Errors from "@notifications/Errors";

import { validateForm } from "@utils/validation";
import { connect } from "react-redux";
import { create, removeBannerErrors, setErrors } from "@actions/bannerActions";

const BannerModal = ({
  modal,
  errorList,
  create,
  removeBannerErrors,
  setErrors,
  onNo,
}) => {
  const initialFormData = {
    title: "",
    image: "",
  };
  const [formData, setFormData] = React.useState(initialFormData);
  const [saving, setSaving] = React.useState(false);

  const { title } = formData;

  const onChange = (e) => {
    if (!e.target) {
      return;
    }

    if (e.target.name === "image") {
      let attached_file = e.target.files[0];
      setFormData({ ...formData, image: attached_file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  React.useEffect(() => {
    removeBannerErrors();
  }, [modal]);

  //########################## submit form data ##############################
  const onSubmit = (e) => {
    e.preventDefault();

    removeBannerErrors();

    let validationRules = [
      {
        param: "image",
        msg: "Image is required.",
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

    // console.log("Add Banner Submit data", submitData);
    setSaving(true);
    create(submitData).then((res) => {
      setSaving(false);
      onNo();
    });
  };

  return (
    <div>
      <Modal
        show={modal}
        onClose={onNo}
        className="transition-all ease-in-out duration-500 delay-500"
      >
        <Modal.Body>
          <Form onSubmit={(e) => onSubmit(e)} autoComplete="off">
            <h4 className="header-title">Banner Information</h4>

            <Form.Group className="form-group">
              <Form.Label htmlFor="title">Title</Form.Label>

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

            <div className="float-end">
              <Button
                className="m-2"
                type="submit"
                size="sm"
                variant="primary"
                disabled={saving}
              >
                Submit
              </Button>
              <Button
                className="ml-2"
                type="reset"
                size="sm"
                variant="danger"
                onClick={onNo}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  bannersList: state.banner.bannersList,
  loadingBannerList: state.banner.loadingBannerList,
  sortingParams: state.banner.sortingParams,
  errorList: state.errors,
});

export default connect(mapStateToProps, {
  create,
  removeBannerErrors,
  setErrors,
})(BannerModal);
