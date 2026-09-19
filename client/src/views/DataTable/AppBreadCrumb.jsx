import React from "react";
import { Link } from "react-router-dom";

const AppBreadCrumb = ({ title = "Shop", breadcrumbs = {} }) => {
  const breadcrumbItems = Array.isArray(breadcrumbs) ? breadcrumbs : [];

  return (
    <div className="breadcrumb__area breadcrumb-space overflow-hidden">
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-12">
            <div className="breadcrumb__content text-center">
              <div className="breadcrumb__title-wrapper mb-15 mb-sm-10 mb-xs-5">
                <h1 className="breadcrumb__title wow fadeIn animated">
                  <span>{title}</span>
                </h1>
              </div>
              <div className="breadcrumb__menu wow fadeIn animated">
                {breadcrumbItems.map((item, index) => (
                  <span key={index}>
                    {item.url ? (
                      <Link to={item.url} className="home">
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <span className="archive post-product-archive current-item">
                        {item.label}
                      </span>
                    )}
                    {index < breadcrumbItems.length - 1 && (
                      <span className="dvr">
                        <i className="fa-solid fa-angle-right"></i>
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBreadCrumb;
