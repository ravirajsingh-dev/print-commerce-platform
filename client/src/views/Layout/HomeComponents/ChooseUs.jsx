import React from "react";
import CountUp from "react-countup";

import { Image } from "react-bootstrap";

import BgShape from "@assets/images/bg-shape.svg";
import BagShape from "@assets/images/bag-shape.png";
import CapShape from "@assets/images/cap-shape.png";
import ChooseUsImg1 from "@assets/images/chooes-us-img1.png";
import ChooseUsImg2 from "@assets/images/chooes-us-img2.jpg";
import ChooseUsImg3 from "@assets/images/choose-us-3.jpeg";

const ChooseUs = () => {
  return (
    <div className="elementor-element e-con-full e-flex e-con">
      <div className="elementor-element elementor-widget">
        <div className="elementor-widget-container">
          <section className="section-space overflow-hidden latest-Choose-bg">
            <div className="container p-relative z-index-1">
              <div>
                <div className="latest-Choose-us__bg-shape">
                  <Image
                    className="upDown-bottom img-fluid"
                    src={BgShape}
                    alt="Bg-Shape"
                  />
                </div>
                {/* <div className="latest-Choose-us__bag-shape">
                  <Image
                    className="zooming img-fluid"
                    src={BagShape}
                    alt="BagShape"
                  />
                </div>
                <div className="latest-Choose-us__cap-shape">
                  <Image
                    className="upDown-top img-fluid"
                    src={CapShape}
                    alt="CapShape"
                  />
                </div> */}
              </div>
              {/* <div
                className="latest-Choose-us__media-experience-box d-flex"
                data-parallax='{"y": -160, "smoothness": 15}'
              >
                <div className="title">
                  <h3>
                    <span className="count">
                      <CountUp end={25} duration={3} />
                    </span>
                    +
                  </h3>
                  <h4>Years</h4>
                </div>
                <div className="description">
                  <p>Of experience in printing service</p>
                </div>
              </div> */}
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-7">
                  <div className="latest-Choose-us__content mb-40">
                    <h6 className="subtitle wow fadeInLeft animated">
                      Why Choose Us
                    </h6>
                    <h2 className="title wow fadeInLeft animated">
                      Why People Choose <br />
                      Shree Advertising?
                    </h2>
                    <p className="wow fadeInLeft animated">
                      Shree Advertising is dedicated to providing high-quality
                      and customized printing services and is always ready to
                      collaborate with all printers.
                    </p>
                    <div className="latest-Choose-us__content-text d-flex">
                      <div className="latest-Choose-us__content-text-box wow fadeInLeft animated">
                        <ul>
                          <li>
                            <i className="fa-solid fa-circle-check"></i>Over 25
                            years of experience in this field.
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check"></i>
                            High-resolution printing quality.
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check"></i>
                            Time-bound delivery.
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check"></i>100%
                            customer satisfaction.
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check"></i>
                            Online support system and urgent printing services.
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check"></i>
                            Printing services available 20 hours a day.
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check"></i>
                            Available for printers even on Sundays
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check"></i>
                            Pan-India delivery support.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-5">
                  <div className="latest-Choose-us__media d-flex flex-row">
                    <div className="latest-Choose-us__media-img1">
                      <Image src={ChooseUsImg3} alt="ChooseUsImg1" />
                    </div>
                    <div className="latest-Choose-us__media-img2">
                      <Image src={ChooseUsImg2} alt="ChooseUsImg2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChooseUs;
