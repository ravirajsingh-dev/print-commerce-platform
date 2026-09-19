import React from "react";
import OurServices from "./OurServices";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";

const OurServicesLayout = () => {
  return (
    <>
      <AppBreadCrumb
        title="Our Services"
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: "Our-Serviecs" },
        ]}
      />
      <OurServices />
    </>
  );
};

export default OurServicesLayout;
