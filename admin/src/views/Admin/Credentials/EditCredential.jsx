import React from "react";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

import CredentialForm from "./CredentialForm";

import { getCredentialById } from "@actions/credentialActions";
import AppBreadcrumb from "../Layout/AppBreadCrumb";
import Spinner from "@views/Spinner";

const EditPatient = ({ loadingCredential, getCredentialById }) => {
  const { credential_id } = useParams();

  React.useEffect(() => {
    if (!credential_id) return;
    getCredentialById(credential_id);
  }, [credential_id]);

  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle="Edit Credential"
        crumbs={[
          { name: "Credentials", path: "/admin/credentials" },
          { name: "Edit Credential" },
        ]}
      />

      <Row>
        {loadingCredential ? (
          <Spinner />
        ) : (
          <CredentialForm credentialID={credential_id} />
        )}
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  loadingCredential: state.credentials.loadingCredential,
});

export default connect(mapStateToProps, {
  getCredentialById,
})(EditPatient);
