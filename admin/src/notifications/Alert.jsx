import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Alert as ShowAlert } from "react-bootstrap";

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert, idx) => (
    <ShowAlert key={idx} variant={`${alert.alertType}`}>
      {alert.msg}
    </ShowAlert>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
