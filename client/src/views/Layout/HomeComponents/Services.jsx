import React from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";

import RightShape from "@assets/images/right-shape.svg";
import ServiceBgShape from "@assets/images/service-bg-shape.png";

const Services = ({ servicesList }) => {
  return (
    <div className="elementor-element elementor-element-bba8448 e-con-full e-flex e-con e-parent">
      <div className="elementor-element elementor-element-c1529ca elementor-widget elementor-widget-rr-services">
        <div className="elementor-widget-container">
          <section className="latest-service__area pt-120 pb-90 p-relative overflow-hidden latest-service-bg">
            <div className="container p-relative">
              <div className="latest-service__all-shape">
                <div className="latest-service__right-shape">
                  <img className="upDown" src={RightShape} alt="RightShape" />
                </div>
                <div className="latest-service__bg-shape">
                  <img
                    className="upDown"
                    src={ServiceBgShape}
                    alt="ServiceBgShape"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  <div className="latest-service__title-box mb-40 text-center">
                    <div
                      className="latest-service__title-box-subtitle wow fadeInLeft animated"
                      data-wow-delay=".6s"
                    >
                      <h6>Our Main Services</h6>
                    </div>
                    <div
                      className="latest-service__title-box-title wow fadeInLeft animated"
                      data-wow-delay=".8s"
                    >
                      <h2 className="rr-section-title wow rrfadeUp rr-el-title">
                        Professional Digital Printing
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row d-flex justify-content-around">
                {servicesList?.map((each) => (
                  <div
                    className="col-xl-3 col-lg-3 col-md-6 col-12 mb-30 wow fadeInUp"
                    key={each._id}
                  >
                    <Link to={each.service_url}>
                      <div className="latest-service__item text-center">
                        <div className="mb-4">
                          <Image
                            src={each.service_image}
                            alt={each.service_image}
                            style={{ width: "100%", height: "150px" }}
                          />
                        </div>
                        <div className="latest-service__item-title">
                          {each?.title}
                        </div>
                        <div className="latest-service__item-text">
                          <p className="rr-el-re-dec">{each.description}</p>
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
  );
};

const mapStateToProps = (state) => ({
  servicesList: state.common.servicesList,
});

export default connect(mapStateToProps, {})(Services);
