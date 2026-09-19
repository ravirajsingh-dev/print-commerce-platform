import { MenuItems } from "@src/constants/index";
import React, { useState } from "react";
import LogoImg from "@assets/images/logo/offcanvas-logo.png";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (index) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="fix">
      <div id="sidebar-area" className="offcanvas__area">
        <div className="offcanvas__wrapper">
          <div className="offcanvas__content">
            <div className="offcanvas__top d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo">
                <a href="https://wp.rrdevs.net/printfix/">
                  <img src={LogoImg} alt="logo" />
                </a>
              </div>
              <div className="offcanvas__close">
                <button className="offcanvas-close-icon animation--flip">
                  <span className="offcanvas-m-lines">
                    <span className="offcanvas-m-line line--1"></span>
                    <span className="offcanvas-m-line line--2"></span>
                    <span className="offcanvas-m-line line--3"></span>
                  </span>
                </button>
              </div>
            </div>

            <div className="mobile-menu fix mean-container">
              <div className="mean-bar">
                <nav className="mean-nav">
                  <ul id="menu-main-menu">
                    {MenuItems.map((item, index) => (
                      <li
                        key={index}
                        id={`${item.title}-${index}`}
                        className="nav-item"
                      >
                        <a href={item.href} className="nav-links">
                          {item.title}
                        </a>

                        {item.subMenu && (
                          <>
                            <a
                              className="mean-expand mean-clicked"
                              onClick={() => toggleMenu(index)}
                            >
                              <i
                                className={`fa ${
                                  openMenus[index]
                                    ? "fa-angle-down"
                                    : "fa-angle-right"
                                }`}
                                aria-hidden="true"
                              ></i>
                            </a>

                            <ul
                              className={`submenu tp-submenu ${
                                openMenus[index] ? "open" : "d-none"
                              }`}
                              role="menu"
                            >
                              {item.subMenu.map((subItem, subIndex) => (
                                <li
                                  key={subIndex}
                                  id={`${item.title}-${index}-${subItem.title}`}
                                  className="menu-item"
                                >
                                  <a
                                    className="dropdown-items"
                                    href={subItem.href}
                                  >
                                    {subItem.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            <div className="offcanvas__social">
              <h3 className="offcanvas__title mb-20">CONTACT US</h3>
              <ul>
                <li>
                  <a className="icon facebook" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a className="icon pinterest" href="#">
                    <i className="fa-brands fa-pinterest-p"></i>
                  </a>
                </li>
                <li>
                  <a className="icon linkedin" href="#">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
