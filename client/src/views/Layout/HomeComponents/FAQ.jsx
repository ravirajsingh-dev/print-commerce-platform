import React from "react";

import FaqBgShape from "@assets/images/faq/faq-bg-shape.svg";
import FaqBuletShape from "@assets/images/faq/faq-bulet_shape.svg";
import Cross from "@assets/images/faq/cross.svg";
import Faq from "@assets/images/faq.jpg";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";

const FAQ = () => {
  return (
    <>
      {/* <AppBreadCrumb
        title="Products"
        breadcrumbs={[
          { label: "Home", url: "https://example.com" },
          { label: "Category", url: "https://example.com/category" },
          { label: "Products" },
        ]}
      /> */}

      <div className="elementor-element elementor-element-03cbfcb e-con-full e-flex e-con e-parent">
        <div className="elementor-element elementor-element-7cd8360 elementor-widget elementor-widget-rr-faq">
          <div className="elementor-widget-container">
            <section className="question__area overflow-hidden section-space question-bg rr-el-section">
              <div id="primary" className="shape-wrapper">
                <div className="container p-relative">
                  <div className="question__all-shape">
                    <div className="bg-shape">
                      <img
                        className="upDown"
                        src={FaqBgShape}
                        alt="FaqBgShape"
                      />
                    </div>
                    <div className="bulet-shape">
                      <img
                        className="upDown-top"
                        src={FaqBuletShape}
                        alt="FaqBuletShape"
                      />
                    </div>
                    <div className="close-shape">
                      <img className="zooming" src={Cross} alt="Cross" />
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-xl-7 col-lg-6 col-md-6">
                      <div className="content-area">
                        <div className="faq faqs">
                          <div id="faq" className="accordion">
                            <h6
                              className="subtitle wow fadeInLeft animated rr-el-sub-titl"
                              data-wow-delay=".6s"
                            >
                              Have Any Question
                            </h6>
                            <h2 className="title mb-40 wow fadeInLeft animated rr-el-title">
                              Frequently Ask Question
                            </h2>
                            <div
                              className="card wow fadeInLeft animated"
                              data-wow-delay="1s"
                            >
                              <div className="card-header">
                                <button
                                  className="card-link"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#faq-0"
                                >
                                  Appropriate For Your Specific Business
                                </button>
                              </div>
                              <div
                                id="faq-0"
                                className="collapse show"
                                data-bs-parent="#faq"
                              >
                                <div className="card-body">
                                  <p className="rr-el-re-dec">
                                    The other hand we denounce with righteou
                                    indg ation and dislike men who are so
                                    beguiled and demorali ed by the of pleasure
                                    of the moment. Dislike men who are so
                                    beguiled demoraliz worlds.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className="card wow fadeInLeft animated"
                              data-wow-delay="1s"
                            >
                              <div className="card-header">
                                <button
                                  className="card-link rr-el-re-Title"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#faq-1"
                                >
                                  Design &amp; Development Troubleshooting
                                </button>
                              </div>
                              <div
                                id="faq-1"
                                className="collapse"
                                data-bs-parent="#faq"
                              >
                                <div className="card-body">
                                  <p className="rr-el-re-dec">
                                    The other hand we denounce with righteou
                                    indg ation and dislike men who are so
                                    beguiled and demorali ed by the of pleasure
                                    of the moment. Dislike men who are so
                                    beguiled demoraliz worlds.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div
                              className="card wow fadeInLeft animated"
                              data-wow-delay="1s"
                            >
                              <div className="card-header">
                                <button
                                  className="card-link rr-el-re-Title"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#faq-2"
                                >
                                  Online Support &amp; Action
                                </button>
                              </div>
                              <div
                                id="faq-2"
                                className="collapse"
                                data-bs-parent="#faq"
                              >
                                <div className="card-body">
                                  <p className="rr-el-re-dec">
                                    The other hand we denounce with righteou
                                    indg ation and dislike men who are so
                                    beguiled and demorali ed by the of pleasure
                                    of the moment. Dislike men who are so
                                    beguiled demoraliz worlds.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-5 col-lg-6 col-md-6">
                      <div className="media">
                        <img
                          data-parallax='{"scale": 1.3, "smoothness": 15}'
                          src={Faq}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
