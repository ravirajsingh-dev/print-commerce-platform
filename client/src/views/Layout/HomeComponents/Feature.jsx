import React from "react";
import { Link } from "react-router-dom";

import { Container, Row, Col, Image } from "react-bootstrap";

import Printer from "@assets/images/printer.png";
import WebDesign from "@assets/images/web-design.png";
import CallCenter from "@assets/images/call-center.png";

const Feature = () => {
  return (
    <div className="elementor-element e-con-full e-flex e-con">
      <div className="elementor-element elementor-widget">
        <div className="elementor-widget-container">
          <section className="pt-80 pb-50 latest-feature-bg">
            <Container>
              <Row>
                <Col className="col-xl-4 col-lg-6 col-md-6 col-12 mb-3  fadeInUp">
                  <div className="latest-feature__item mb-3 d-flex  fadeInLeft animated">
                    <div className="latest-feature__item-icon">
                      <Image src={Printer} alt="Printer" />
                    </div>
                    <div className="latest-feature__item-content">
                      <h4>
                        <Link to="/our-services">Printing Services</Link>
                      </h4>
                      <p>Elevate your brand with our premium prints.</p>
                    </div>
                  </div>
                </Col>

                <Col className="col-xl-4 col-lg-6 col-md-6 col-12 mb-30 fadeInUp">
                  <div className="latest-feature__item mb-30 d-flex fadeInLeft animated">
                    <div className="latest-feature__item-icon">
                      <Image src={WebDesign} alt="Web-Design" />
                    </div>
                    <div className="latest-feature__item-content">
                      <h4>
                        <Link to="/our-services">Best Services</Link>
                      </h4>
                      <p>
                        Print it right, print it here Your one-choice for print
                        shree advertising.
                      </p>
                    </div>
                  </div>
                </Col>

                <Col className="col-xl-4 col-lg-6 col-md-6 col-12 mb-30 fadeInUp">
                  <div className="latest-feature__item mb-30 d-flex fadeInLeft animated">
                    <div className="latest-feature__item-icon call-center">
                      <Image src={CallCenter} alt="Call-Center" />
                    </div>
                    <div className="latest-feature__item-content">
                      <h4>
                        <Link to="/our-services">Best Online Support</Link>
                      </h4>
                      <p>Instant answers. Trusted guidance.</p>
                      {/* <a href="https://wp.rrdevs.net/printfix/services/t-shirt-printing/">
                        Read More <i className="fa-solid fa-arrow-right"></i>
                      </a> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Feature;
