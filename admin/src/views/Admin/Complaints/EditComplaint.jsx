import React from "react";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

import ComplaintForm from "./ComplaintForm";

import { getComplaintById } from "@actions/complaintActions";
import AppBreadcrumb from "../Layout/AppBreadCrumb";
import Spinner from "@views/Spinner";

const EditPatient = ({ loadingComplaint, getComplaintById }) => {
  const { complaint_id } = useParams();

  React.useEffect(() => {
    if (!complaint_id) return;
    getComplaintById(complaint_id);
  }, [complaint_id]);

  return (
    <React.Fragment>
      <AppBreadcrumb
        pageTitle="Edit Complaint"
        crumbs={[
          { name: "Complaints", path: "/admin/complaints" },
          { name: "Edit Complaint" },
        ]}
      />

      <Row>
        {loadingComplaint ? (
          <Spinner />
        ) : (
          <ComplaintForm complaintID={complaint_id} />
        )}
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  loadingComplaint: state.complaint.loadingComplaint,
});

export default connect(mapStateToProps, {
  getComplaintById,
})(EditPatient);
