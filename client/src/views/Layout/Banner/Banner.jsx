import React from "react";

import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";

import Cup from "@assets/images/cup.png";
import SmallRed from "@assets/images/banner/small-red.svg";
import SmallPurple from "@assets/images/banner/small-parpale.svg";
import SmallBlue from "@assets/images/banner/small-blue.svg";
import BlueDot from "@assets/images/banner/blue-dot.svg";
import RedDot from "@assets/images/banner/red-dot.svg";
import BlueShape from "@assets/images/banner/blue-shape.svg";
import PurpleShape from "@assets/images/banner/parpale-shape.svg";
import BannerShape1 from "@assets/images/banner/banner-shape-1.svg";
import BannerShape2 from "@assets/images/banner/banner-shape-2.svg";
import BigRightShape from "@assets/images/banner/big-right-shape.png";
import BannerTopCart from "@assets/images/banner-top-1-cart.png";
import BannerBottomCart from "@assets/images/banner-bottom-2-cart.png";
import BigBottleImg from "@assets/images/machine.png";

const Banner = () => {
  return (
    <div>
      <div>
        <div>
          <div className="elementor-widget-container">
            <section className="banner-home overflow-hidden banner-home-bg p-relative">
              <div className="container p-relative z-index-1">
                <div className="banner-all-shape-wrapper">
                  <div className="banner-home__small-red">
                    <Image src={SmallRed} alt="img not found" />
                  </div>
                  <div className="banner-home__small-parpale">
                    <Image src={SmallPurple} alt="img not found" />
                  </div>
                  <div className="banner-home__small-blue">
                    <Image src={SmallBlue} alt="img not found" />
                  </div>
                  <div className="banner-home__blue-dot-shape">
                    <Image src={BlueDot} alt="img not found" />
                  </div>
                  <div className="banner-home__red-shape">
                    <Image src={RedDot} alt="img not found" />
                  </div>
                  <div className="banner-home__blue-shape d-none d-md-block">
                    {/* <Image src={BlueShape} alt="img not found" /> */}
                  </div>
                  <div className="banner-home__parpale-shape d-none d-md-block">
                    {/* <Image src={PurpleShape} alt="img not found" /> */}
                  </div>
                  <div className="banner-home__banner-shape-1">
                    {/* <Image
                      className="upDown-top"
                      src={BannerShape1}
                      alt="img not found"
                    /> */}
                  </div>
                  <div className="banner-home__banner-shape-2">
                    <Image
                      className="upDown-bottom"
                      src={BannerShape2}
                      alt="img not found"
                    />
                  </div>
                  <div className="banner-home__banner-right-shape d-none d-md-block">
                    {/* <Image
                      className=""
                      src={BigRightShape}
                      alt="img not found"
                    /> */}
                  </div>
                  <div className="banner-home__card1-shape">
                    {/* <Image src={BannerTopCart} alt="" /> */}
                  </div>
                  <div className="banner-home__card2-shape">
                    {/* <Image src={BannerBottomCart} alt="" /> */}
                  </div>
                  <div className="banner-home__cup-shape">
                    {/* <Image className="zooming" src={Cup} alt="" /> */}
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-md-7">
                    <div className="banner-home__content p-relative">
                      <h6 className="sub-title mb-5  fadeInLeft animated ">
                        Welcome To Shree Advertising
                      </h6>
                      <h2 className="title mb-3 mb-xs-2  fadeInLeft animated">
                        Printing Se Delivery Tak
                      </h2>
                      <div
                        className="description mb-20 mb-sm-15 mb-xs-10  fadeInLeft animated"
                        data--delay="1.4s"
                      >
                        <p className="rr-el-desc">
                          Shree Advertising is dedicated to providing
                          high-quality and customized printing services and is
                          always ready to collaborate with all printers.
                        </p>
                      </div>
                      <div className="banner-home__btn__wrapper d-flex flex-wrap mt-5">
                        <Link
                          to="/our-services"
                          className="rr-btn  fadeInLeft animated rr-el-btn"
                        >
                          Our Service
                        </Link>
                        {/* <button className="rr-btn btn-transparent  fadeInLeft animated rr-el-btn-1">
                          Discover More
                        </button> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="banner-home__media text-sm-center text-xs-center mt-sm-40 upDown">
                      <Image src={BigBottleImg} alt="" />
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

export default Banner;
