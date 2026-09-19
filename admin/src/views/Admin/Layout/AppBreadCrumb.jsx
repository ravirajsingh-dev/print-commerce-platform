import React from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import { capitalizeFirst } from "@utils/helper";

const AppBreadcrumb = ({ pageTitle, crumbs }) => {
  return (
    <div className="bread-crumb d-flex">
      <h4>{capitalizeFirst(pageTitle)}</h4>

      {crumbs ? (
        <Breadcrumb>
          <Breadcrumb.Item linkProps={{ to: "/admin/dashboard" }} linkAs={Link}>
            Dashboard
          </Breadcrumb.Item>
          {crumbs.map((item, i) => (
            <React.Fragment key={i}>
              {item.path ? (
                <Breadcrumb.Item linkProps={{ to: item.path }} linkAs={Link}>
                  {capitalizeFirst(item.name)}
                </Breadcrumb.Item>
              ) : (
                <Breadcrumb.Item active>
                  {capitalizeFirst(item.name)}
                </Breadcrumb.Item>
              )}
            </React.Fragment>
          ))}
        </Breadcrumb>
      ) : undefined}
    </div>
  );
};

export default AppBreadcrumb;
