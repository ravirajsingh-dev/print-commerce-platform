import React from "react";
import CredentialForm from "./CredentialForm";
import { Row, Col } from "react-bootstrap";
import AppBreadcrumb from "../Layout/AppBreadCrumb";

const CreateCredential = () => {
  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle="Create New Credential"
        crumbs={[
          { name: "Credentials", path: "/admin/credentials" },
          { name: "Cretae New Credential" },
        ]}
      />
      <Row className="grid grid-cols-2 gap-4">
        <Col>
          <CredentialForm />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CreateCredential;
