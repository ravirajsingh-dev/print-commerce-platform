import React from "react";

const Footer2 = () => {
  return (
    <div
      className="footer__bottom-wrapper footer__bottom-home-1-bg mt-auto"
      data-bg-color="#001D08"
    >
      <div className="footer__bottom">
        <div className="container">
          <div className="row">
            <div className="col-xxl-6 col-lg-6 col-md-6 col-12">
              <div className="footer__copyright">
                <p>
                  Copyright © 2025{" "}
                  <a href="http://rrdevs.net">Shree Advertising.</a> All Rights
                  Reserved
                </p>
              </div>
            </div>
            <div className="col-xxl-6 col-lg-6 col-md-6 col-12">
              <div className="footer__copyright-menu">
                <ul id="menu-footer-bottom-menu" className="">
                  <li
                    // itemscope="itemscope"
                    // itemtype="https://www.schema.org/SiteNavigationElement"
                    id="menu-item-616"
                    className="menu-item menu-item-type-custom menu-item-object-custom menu-item-616 nav-item"
                  >
                    <a
                      title="Privacy &amp; Terms Condition"
                      href="#"
                      className="nav-links"
                    >
                      Privacy &#038; Terms Condition
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer2;
