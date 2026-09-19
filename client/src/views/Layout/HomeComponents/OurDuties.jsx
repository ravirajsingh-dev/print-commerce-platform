import React from "react";
import { Link } from "react-router-dom";
import { BiSupport } from "react-icons/bi";
import { IoMdLock } from "react-icons/io";
import { GiReceiveMoney } from "react-icons/gi";
import { FaThumbsUp } from "react-icons/fa";

const OurDuties = () => {
  return (
    <div className="px-5">
      <div className="elementor-element elementor-element-8bcb16b e-con-full e-flex e-con e-parent e-lazyloaded">
        <div className="elementor-element elementor-element-6700bf9 elementor-widget elementor-widget-rr-services">
          <div className="elementor-widget-container">
            <section className="latest-service3__area latest-service-bg ele-section">
              <div className="container-fluid">
                <div className="row mb-minus-30">
                  <div className="col-xl-3 col-lg-6 col-md-6 col-12 mb-30 wow fadeInUp">
                    <div className="latest-service3__item text-center services-box d-flex justify-content-center align-items-center pt-4">
                      <div className="latest-service3__item-text ">
                        <div className="latest-service3__item-icon mt-30">
                          <IoMdLock size="35px" />
                        </div>
                        <h6 className="rr-el-re-Title mt-2">Payment Secure</h6>
                        <p className="rr-el-re-dec">Get 100% Payment Safe</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-6 col-md-6 col-12 mb-30 wow fadeInUp">
                    <div className="latest-service3__item text-center services-box d-flex justify-content-center align-items-center pt-4">
                      <div className="latest-service3__item-text ">
                        <div className="latest-service3__item-icon mt-30">
                          <BiSupport size="35px" />
                        </div>
                        <h6 className="rr-el-re-Title mt-2">Support 24/7</h6>
                        <p className="rr-el-re-dec">Quality Support 24/7</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6 col-md-6 col-12 mb-30 wow fadeInUp">
                    <div className="latest-service3__item text-center services-box d-flex justify-content-center align-items-center pt-4">
                      <div className="latest-service3__item-text ">
                        <div className="latest-service3__item-icon mt-30">
                          <GiReceiveMoney size="35px" />
                        </div>
                        <h6 className="rr-el-re-Title mt-2">100% Money Back</h6>
                        <p className="rr-el-re-dec">100% Money Back</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6 col-md-6 col-12 mb-30 wow fadeInUp ">
                    <div className="latest-service3__item text-center services-box d-flex justify-content-center align-items-center pt-4">
                      <div className="latest-service3__item-text d-flex flex-column align-items-center justify-content-center">
                        <div className="latest-service3__item-icon mt-30">
                          <FaThumbsUp size="35px" />
                        </div>
                        <h6 className="rr-el-re-Title mt-2">
                          Quality Assurance
                        </h6>
                        <p className="rr-el-re-dec">100% Quality assurance</p>
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

export default OurDuties;
