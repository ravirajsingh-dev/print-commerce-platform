import React from "react";
import { Image } from "react-bootstrap";

import AboutBGShape from "@assets/images/about2-bg-shape.svg";
import AboutCircleImg from "@assets/images/about2-circle-img1.svg";
import FeatureMediaImg from "@assets/images/feature2-media-img1.jpg";
import FeatureMediaImg2 from "@assets/images/feature2-media-img2.jpg";

const AboutUsInfo = () => {
  return (
    <div>
      <div
        className="elementor-element elementor-element-b9c14f7 e-con-full e-flex e-con e-parent e-lazyloaded"
        data-id="b9c14f7"
        data-element_type="container"
      >
        <div
          className="elementor-element elementor-element-eda7af3 elementor-widget elementor-widget-about"
          data-id="eda7af3"
          data-element_type="widget"
          data-widget_type="about.default"
        >
          <div className="elementor-widget-container">
            <section className="latest-about2__area section-space overflow-hidden rr-el-section">
              <div className="container p-relative z-index-1">
                <div className="latest-about2__all-shape">
                  <div className="latest-about2__all-shape-bg-shape">
                    <Image
                      className="upDown-bottom"
                      src={AboutBGShape}
                      alt="AboutBGShape"
                    />
                  </div>
                  <div className="latest-about2__all-shape-circle-shape">
                    <Image
                      className="zooming"
                      src={AboutCircleImg}
                      alt="AboutCircleImg"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-6 col-lg-6">
                    <div className="latest-about2__content">
                      <h6 className="latest-about2__content-subtitle rr-el-sub-title">
                        About Us
                      </h6>
                      <h2 className="latest-about2__content-title rr-el-title">
                        Professional Printing.
                      </h2>
                      <div className="latest-about2__content-description">
                        <p className="rr-el-desc" data-wow-delay="1s">
                          Shree Advertising is dedicated to providing
                          high-quality and customized printing services and is
                          always ready to collaborate with all printers.
                        </p>
                      </div>
                      <div className="latest-about2__content-text">
                        <ul>
                          <li className="rr-rp-title">
                            <i className="fa-solid fa-check"></i>High-resolution
                            printing quality.
                          </li>
                          <li className="rr-rp-title">
                            <i className="fa-solid fa-check"></i>100% customer
                            satisfaction.
                          </li>
                          <li className="rr-rp-title">
                            <i className="fa-solid fa-check"></i>Online support
                            system and urgent printing services.
                          </li>
                          <li className="rr-rp-title">
                            <i className="fa-solid fa-check"></i>Pan-India
                            delivery support.
                          </li>
                          <li className="rr-rp-title">
                            <i className="fa-solid fa-check"></i>Available for
                            printers even on Sundays.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="latest-about2__media">
                      <div className="latest-about2__media-img1">
                        <Image src={FeatureMediaImg} alt="FeatureMediaImg" />
                      </div>
                      <div className="latest-about2__media-img2">
                        <Image src={FeatureMediaImg2} alt="FeatureMediaImg2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsInfo;
