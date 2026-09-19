import React from "react";
import CountUp from "react-countup";

import Group from "@assets/images/Group.png";
import PrinterBlack from "@assets/images/g3382.png";
import UsersGroup from "@assets/images/XMLID_46_.png";
import Group53 from "@assets/images/Group-53.png";

const Counter = () => {
  return (
    <div className="elementor-element e-con-full e-flex e-con e-parent">
      <div className="elementor-element elementor-widget elementor-widget-rr-fact">
        <div className="elementor-widget-container">
          <section className="latest-counter__area pt-75 pb-75 pt-xs-30 pb-xs-60 latest-counter-bg rr-el-section">
            <div className="container">
              <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div
                    className="latest-counter__counter-box wow fadeInLeft animated"
                    data-wow-delay="1s"
                  >
                    <div className="latest-counter__content text-center">
                      <div className="latest-counter__content__counter-img mt-40">
                        <img src={Group} alt="Group.png" />
                      </div>
                      <h5 className="rr-el-re-number">
                        <span className="count">
                          <CountUp end={8268} duration={3} />
                        </span>
                        +
                      </h5>
                      <span className="rr-el-re-Title">Happy Customers</span>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div
                    className="latest-counter__counter-box wow fadeInLeft animated"
                    data-wow-delay="1s"
                  >
                    <div className="latest-counter__content text-center">
                      <div className="latest-counter__content__counter-img mt-40">
                        <img src={PrinterBlack} alt="" />
                      </div>
                      <h5 className="rr-el-re-number">
                        <span className="count">
                          <CountUp end={65} duration={3} />
                        </span>
                        +
                      </h5>
                      <span className="rr-el-re-Title">Total Product</span>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div
                    className="latest-counter__counter-box wow fadeInLeft animated"
                    data-wow-delay="1s"
                  >
                    <div className="latest-counter__content text-center">
                      <div className="latest-counter__content__counter-img man-icon mt-40">
                        <img src={UsersGroup} alt="UsersGroup" />
                      </div>
                      <h5 className="rr-el-re-number">
                        <span className="count">
                          <CountUp end={128} duration={3} />
                        </span>
                        +
                      </h5>
                      <span className="rr-el-re-Title">Experts Team</span>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div
                    className="latest-counter__counter-box wow fadeInLeft animated"
                    data-wow-delay="1s"
                  >
                    <div className="latest-counter__content text-center">
                      <div className="latest-counter__content__counter-img ellipse-icon mt-40">
                        <img src={Group53} alt="" />
                      </div>
                      <h5 className="rr-el-re-number">
                        <span className="count">
                          <CountUp end={25} duration={3} />
                        </span>
                        +
                      </h5>
                      <span className="rr-el-re-Title">
                        Years Of Experience
                      </span>
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

export default Counter;
