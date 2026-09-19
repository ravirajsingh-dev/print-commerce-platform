import React from "react";
import { Link } from "react-router-dom";

import BannerPrinting from "@assets/images/bannerPrinting.png";
import Printing from "@assets/images/printer.png";
import Flymer from "@assets/images/Flymer.png";
import BusinessDfsd from "@assets/images/dfsd.png";

const Services2 = () => {
  return (
    <div>
      <div className="elementor-element elementor-element-8bcb16b e-con-full e-flex e-con e-parent e-lazyloaded">
        <div className="elementor-element elementor-element-6700bf9 elementor-widget elementor-widget-rr-services">
          <div className="elementor-widget-container">
            <section className="latest-service2__area latest-service-bg section-space ele-section">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="latest-service2__title-wrapper text-center mb-40">
                      <h6 className="latest-service2__title-wrapper-subtitle rr-el-sub-title">
                        Our Main Services
                      </h6>
                      <h2 className="latest-service2__title-wrapper-title rr-el-title">
                        Professional Digital Printing
                      </h2>{" "}
                    </div>
                  </div>
                </div>
                <div className="row mb-minus-30">
                  <div className="col-xl-4 col-lg-4 col-md-6 col-12 mb-30 wow fadeInUp">
                    <div className="latest-service2__item text-center services-box">
                      <div className="latest-service2__item-icon mt-30">
                        <img src={BannerPrinting} alt="BannerPrinting" />
                      </div>
                      <div className="latest-service2__item-text">
                        <h4 className="rr-el-re-Title">
                          {" "}
                          <Link to="/our-services">Solvent Printing</Link>
                        </h4>
                        <p className="rr-el-re-dec">
                          There are many variations but the majority have
                          suffered.
                        </p>
                        {/* <a
                          href="https://wp.rrdevs.net/printfix/services/t-shirt-printing/"
                          className="readmore d-flex align-items-center justify-content-center rr-el-btn"
                        >
                          Read More <i className="fa-solid fa-arrow-right"></i>
                        </a> */}
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-xl-4 col-lg-4 col-md-6 col-12 mb-30 wow fadeInUp"
                    data-wow-duration="0.9s"
                    data-wow-delay="0.5s"
                  >
                    <div className="latest-service2__item text-center services-box">
                      <div className="latest-service2__item-icon mt-30">
                        <img src={Printing} alt="Printing" />
                      </div>
                      <div className="latest-service2__item-text">
                        <h4 className="rr-el-re-Title">
                          {" "}
                          <Link to="/our-services">Eco Printing</Link>
                        </h4>
                        <p className="rr-el-re-dec">
                          There are many variations but the majority have
                          suffered.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-xl-4 col-lg-4 col-md-6 col-12 mb-30 wow fadeInUp"
                    data-wow-duration="0.9s"
                    data-wow-delay="0.7s"
                  >
                    <div className="latest-service2__item text-center services-box">
                      <div className="latest-service2__item-icon mt-30">
                        <img decoding="async" src={Flymer} alt="Flyer" />
                      </div>
                      <div className="latest-service2__item-text">
                        <h4 className="rr-el-re-Title">
                          {" "}
                          <Link to="/our-services">Digital Printing</Link>
                        </h4>
                        <p className="rr-el-re-dec">
                          There are many variations but the majority have
                          suffered.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <div
                    className="col-xl-3 col-lg-6 col-md-6 col-12 mb-30 wow fadeInUp"
                    data-wow-duration="0.9s"
                    data-wow-delay="0.9s"
                  >
                    <div className="latest-service2__item text-center services-box">
                      <div className="latest-service2__item-icon mt-30">
                        <img src={BusinessDfsd} alt="BusinessDfsd" />
                      </div>
                      <div className="latest-service2__item-text">
                        <h4 className="rr-el-re-Title">
                          {" "}
                          <Link to="/our-services">Business Card</Link>
                        </h4>
                        <p className="rr-el-re-dec">
                          There are many variations but the majority have
                          suffered.
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services2;
