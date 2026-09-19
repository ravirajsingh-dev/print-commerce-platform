import React from "react";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";
import GetInTouch from "./GetInTouch";

const ContactUs = () => {
  return (
    <div>
      <AppBreadCrumb
        title="Contact-Us"
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: "Contact-Us" },
        ]}
      />
      <GetInTouch />
    </div>
  );
};

export default ContactUs;
