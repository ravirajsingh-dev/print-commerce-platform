import React from "react";

import { PropTypes } from "prop-types";
import { connect } from "react-redux";

import Banner from "../Banner/Banner";
import Feature from "./Feature";
import ChooseUs from "./ChooseUs";
import Services from "./Services";
import Counter from "./Counter";
import FAQ from "./FAQ";

import { getServicesList } from "@src/actions/commonActions";
import OurDuties from "./OurDuties";

const Body = ({ getServicesList }) => {
  React.useEffect(() => {
    getServicesList();
  }, []);
  return (
    <div>
      <Banner />
      <Services />
      <Counter />
      <Feature />
      {/* <FAQ /> */}
      <ChooseUs />

      <OurDuties />
    </div>
  );
};
const mapStateToProps = (state) => ({
  servicesList: state.common.servicesList,
});

export default connect(mapStateToProps, { getServicesList })(Body);
