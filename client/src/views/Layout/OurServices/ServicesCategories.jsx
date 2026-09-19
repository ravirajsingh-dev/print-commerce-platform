import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import { PropTypes } from "prop-types";
import { connect } from "react-redux";

import { getProductServiceCategoriesListByID } from "@src/actions/commonActions";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";

const ServicesCategories = ({
  getProductServiceCategoriesListByID,
  productServiceCategoriesList,
}) => {
  const { product_service_id } = useParams();

  const location = useLocation();
  const title = `${location.state?.title} Categories` || "Product Categories";

  React.useEffect(() => {
    if (!product_service_id) return;

    getProductServiceCategoriesListByID(product_service_id);
  }, [product_service_id]);

  React.useEffect(() => {
    console.log("productServiceCategoriesList", productServiceCategoriesList);
    // console.log("product_id", product_id);
    console.log("title from state", location);
  }, [productServiceCategoriesList]);

  return (
    <>
      <AppBreadCrumb
        title={title}
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: "Our Services", url: "/our-services" },
          { label: title },
        ]}
      />

      <div className="elementor-element elementor-element-bba8448 e-con-full e-flex e-con e-parent">
        <div className="elementor-element elementor-element-c1529ca elementor-widget elementor-widget-rr-services">
          <div className="elementor-widget-container">
            <section className="latest-service__area pb-90 p-relative overflow-hidden latest-service-bg">
              <div className="container p-relative">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="latest-service__title-box mb-40 text-center">
                      <div className="latest-service__title-box-subtitle wow fadeInLeft animated">
                        <h6>{title}</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {productServiceCategoriesList?.map((serviceCat) => (
                    <div
                      className="col-xl-3 col-lg-3 col-md-4 col-12 mb-30 wow fadeInUp"
                      key={serviceCat._id}
                    >
                      <Link
                        to={`/user/create-order`}
                        state={{
                          orderProduct: { ServicesCategories: serviceCat },
                        }}
                      >
                        <div className="latest-service__item-custom text-center">
                          <div className="latest-service__item-icon-custom">
                            <img
                              src={serviceCat.image}
                              alt={serviceCat.title}
                            />
                          </div>
                          <div className="latest-service__item-title">
                            {serviceCat.title}
                          </div>
                          <div className="latest-service__item-text">
                            <p className="rr-el-re-dec">
                              {serviceCat.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  productServiceCategoriesList: state.common.productServiceCategoriesList,
});

export default connect(mapStateToProps, {
  getProductServiceCategoriesListByID,
})(ServicesCategories);
