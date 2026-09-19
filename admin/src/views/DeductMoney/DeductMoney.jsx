import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import React from "react";
import { connect } from "react-redux";
import {
  getUsersList,
  deductMoneyFromWallet,
  setCommonAlert,
} from "@actions/commonActions";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Errors from "@notifications/Errors";

const DeductMoney = ({
  getUsersList,
  usersList,
  errorList,
  deductMoneyFromWallet,
  setCommonAlert,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [amount, setAmount] = React.useState("");
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    // Add your form submission logic here
    // After submission, you can reset the submitting state
    setSubmitting(false);
  };

  const handleSelect = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  React.useEffect(() => {
    getUsersList();
  }, [getUsersList]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (!selectedUser) {
      setCommonAlert("Please select a user.", "danger");
      return;
    }
    if (!amount || amount <= 0) {
      setCommonAlert("Please enter a valid amount.", "danger");
      return;
    }

    setSubmitting(true);
    deductMoneyFromWallet(selectedUser.value, { amount }).then((res) =>
      setSubmitting(false)
    );
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      setAmount(value);
    }
  };

  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle="Deduct Money"
        crumbs={[{ name: "Deduct Money" }]}
      />

      <Form onSubmit={(e) => onSubmit(e)}>
        <Card className="p-4">
          <Row>
            <Col sm="12" md="6">
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

              <Errors key="user" current_key="user" />
            </Col>

            <Col md="6" sm="12">
              <Form.Group>
                <Form.Label htmlFor="amount">
                  Amount<span>*</span>
                </Form.Label>
                <Form.Control
                  className={errorList.amount ? "invalid" : ""}
                  type="text"
                  id="amount"
                  name="amount"
                  value={amount}
                  onChange={onChange}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
                <Errors current_key="amount" />
              </Form.Group>
            </Col>

            <Col xs={12} className="text-end mt-2">
              <Button
                className="m-2"
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>
                    {` Loading... `}
                  </>
                ) : (
                  <>Deduct</>
                )}
              </Button>
              <Button
                className="ml-2"
                type="reset"
                variant="danger"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  usersList: state.common.usersList,
});

export default connect(mapStateToProps, {
  getUsersList,
  deductMoneyFromWallet,
  setCommonAlert,
})(DeductMoney);
