import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Badge, Image, Row, Col } from "react-bootstrap";
import { MenuItems3 } from "@src/constants/index";
import { logout } from "@src/actions/authActions";

const SubHeader = ({ loggedInUser }) => {
  return (
    <div className="header__middle my-div">
      <div className="mean__menu-wrapper d-none d-lg-block ">
        <div id="mobile-menu" className="main-menu ">
          <ul id="menu-main-menu  ">
            {MenuItems3.map((item, index) => (
              <li key={index} className={item.subMenu ? "has-dropdown" : ""}>
                <Link to={item.href}>
                  <span
                    className={item?.isButton ? "sub-header-button" : ""}
                    style={{ color: item?.isButton ? "black" : "#fff" }}
                  >
                    {item.title}
                  </span>
                </Link>
                {item.title === "Orders" && loggedInUser?.isNewOrder ? (
                  <Badge
                    pill
                    bg="danger"
                    style={{
                      position: "absolute",
                      top: "20px", // Moves the badge slightly above
                      right: "-10px", // Adjust to position correctly
                      fontSize: "0.7rem", // Slightly smaller badge
                      padding: "4px 4px",
                    }}
                  >
                    New
                  </Badge>
                ) : null}
                {item.subMenu && (
                  <ul className="submenu">
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link to={subItem.href}>
                          {subItem.title}{" "}
                          {subItem.href === "/user/orders" &&
                          loggedInUser?.isNewOrder ? (
                            <Badge pill bg="danger">
                              New
                            </Badge>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

SubHeader.propTypes = {
  loggedInUser: PropTypes.object,
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.user,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { logout })(SubHeader);
