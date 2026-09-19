import React from "react";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";
import AboutUsInfo from "./AboutUsInfo";
import Services2 from "./Services2";
import Crousel from "./Crousel";
import ChooseUs from "../HomeComponents/ChooseUs";
import FAQ from "../HomeComponents/FAQ";

const AboutUs = () => {
  return (
    <div>
      <AppBreadCrumb
        title="About-Us"
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: "About-Us" },
        ]}
      />

      <AboutUsInfo />
      <Services2 />
      {/* <Crousel /> */}
      {/* <ChooseUs /> */}
      {/* <FAQ /> */}
    </div>
  );
};

export default AboutUs;
