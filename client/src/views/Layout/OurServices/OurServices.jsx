import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

import { PropTypes } from "prop-types";
import { connect } from "react-redux";

import { getProductsList } from "@src/actions/commonActions";

const OurServices = ({ getProductsList, productsList }) => {
  React.useEffect(() => {
    getProductsList();
  }, []);

  React.useEffect(() => {
    console.log("productsList", productsList);
  }, [productsList]);

  return (
    <div className="elementor-element elementor-element-bba8448 e-con-full e-flex e-con e-parent">
      <div className="elementor-element elementor-element-c1529ca elementor-widget elementor-widget-rr-services">
        <div className="elementor-widget-container">
          <section className="latest-service__area pt-120 pb-90 p-relative overflow-hidden latest-service-bg">
            <div className="container p-relative">
              <div className="row">
                <div className="col-xl-12">
                  <div className="latest-service__title-box mb-40 text-center">
                    <div
                      className="latest-service__title-box-subtitle wow fadeInLeft animated"
                      data-wow-delay=".6s"
                    >
                      <h6>Our Main Services</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {productsList?.map((product) => (
                  <div
                    className="col-xl-3 col-lg-3 col-md-4 col-12 mb-30 fadeInUp"
                    key={product._id}
                  >
                    <Link
                      to={`/product-services/${product._id}`}
                      state={{ title: product.title }}
                    >
                      <div className="latest-service__item-custom text-center">
                        <div className="latest-service__item-icon-custom">
                          <img
                            src={product.product_image}
                            alt={product.product_sku}
                          />
                        </div>
                        <div className="latest-service__item-title">
                          {product.title}
                        </div>
                        <div className="latest-service__item-text">
                          <p className="rr-el-re-dec">{product.description}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  // <div
                  //   className="col-xl-3 col-lg-3 col-md-4 col-12 mb-30 wow fadeInUp"
                  //   key={product._id}
                  // >
                  //   <Card
                  //     style={{
                  //       borderRadius: "10px",
                  //       overflow: "hidden",
                  //       boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  //     }}
                  //   >
                  //     <Card.Img
                  //       variant="top"
                  //       src={product.product_image}
                  //       alt="Card Image"
                  //     />
                  //     <Card.Body className="text-center">
                  //       <Card.Title>Unique Card</Card.Title>
                  //       <Card.Text>
                  //         This is a small and modern card design using React
                  //         Bootstrap.
                  //       </Card.Text>
                  //       <Button variant="primary" size="sm">
                  //         Explore
                  //       </Button>
                  //     </Card.Body>
                  //   </Card>
                  // </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  productsList: state.common.productsList,
});

export default connect(mapStateToProps, { getProductsList })(OurServices);
