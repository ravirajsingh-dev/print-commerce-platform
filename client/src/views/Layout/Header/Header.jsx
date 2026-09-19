import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Badge, Image } from "react-bootstrap";
import LogoImg from "@assets/images/logo.png";
import { MenuItems2 } from "@src/constants/index";
import { FaPowerOff } from "react-icons/fa";
import { logout } from "@src/actions/authActions";

const Header = ({ loggedInUser, loading, logout }) => {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById("header-sticky");
      const sidebar = document.getElementById("sidebar-area");
      if (header) {
        if (window.scrollY > 250) {
          header.classList.add("rs-sticky");
        } else {
          header.classList.remove("rs-sticky");
          sidebar?.classList.remove("info-open");
        }
      }
    };

    const sidebar = document.getElementById("sidebar-area");
    const sidebarToggle = document.querySelector(".sidebar__toggle");
    const closeElements = document.querySelectorAll(
      ".offcanvas__close, .offcanvas__overlay"
    );

    const openSidebar = () => sidebar?.classList.add("info-open");
    const closeSidebar = () => sidebar?.classList.remove("info-open");

    sidebarToggle?.addEventListener("click", openSidebar);
    closeElements.forEach((el) => el.addEventListener("click", closeSidebar));
    window.addEventListener("scroll", handleScroll);

    return () => {
      sidebarToggle?.removeEventListener("click", openSidebar);
      closeElements.forEach((el) =>
        el.removeEventListener("click", closeSidebar)
      );
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header>
      <div id="header-sticky" className="header__area header-1">
        <div className="container">
          <div className="p-relative">
            <div className="header__main">
              <Logo />
              <MainMenu loggedInUser={loggedInUser} />
              <UserDetails
                loggedInUser={loggedInUser}
                loading={loading}
                logout={logout}
              />
              <MakeOrder />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Logo = () => (
  <div className="">
    <div className="py-2">
      <Link className="" to="/">
        <Image
          src={LogoImg}
          alt="logo"
          height="60"
          style={{ height: "100px" }}
        />
      </Link>
    </div>
  </div>
);

const MainMenu = ({ loggedInUser }) => (
  <div className="header__middle">
    <div className="mean__menu-wrapper d-none d-lg-block">
      <div id="mobile-menu" className="main-menu">
        <ul id="menu-main-menu">
          {MenuItems2.map((item, index) => (
            <li key={index} className={item.subMenu ? "has-dropdown" : ""}>
              <Link to={item.href}>{item.title}</Link>
              {item.title === "Orders" && loggedInUser?.isNewOrder ? (
                <Badge
                  pill
                  bg="danger"
                  style={{
                    position: "absolute",
                    top: "20px", // Moves the badge slightly above
                    right: "-10px", // Adjust to position correctly
                    fontSize: "0.7rem", // Slightly smaller badge
                    padding: "4px 6px",
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

const UserDetails = ({ loggedInUser, loading, logout }) => {
  const [displayState, setDisplayState] = useState(
    loggedInUser ? "user" : "loading"
  );

  useEffect(() => {
    if (loading) {
      setDisplayState("loading");
    } else if (loggedInUser) {
      setDisplayState("user");
    } else {
      setDisplayState("login");
    }
  }, [loggedInUser, loading]);

  const userDisplay = useMemo(() => {
    switch (displayState) {
      case "loading":
        return <strong>Loading...</strong>;
      case "user":
        return (
          <strong>
            {`${loggedInUser?.business_name} (${loggedInUser?.SA_ID})`}{" "}
            <FaPowerOff
              cursor="pointer"
              onClick={(e) => {
                if (window.confirm(`Are you really want to logout?`)) {
                  logout();
                }
              }}
              className="ms-2 my-auto text-danger fs-5 cursor-pointer"
              size="18px"
            />
          </strong>
        );
      default:
        return (
          <Link to="/login" className="rr-btn">
            Login
          </Link>
        );
    }
  }, [displayState, loggedInUser]);

  return (
    <div className="header__right">
      <div className="header__action d-flex align-items-center">
        <div className="header__btn-wrap d-none d-sm-inline-flex d-block">
          <span> {userDisplay} </span>
        </div>
      </div>
    </div>
  );
};

const MakeOrder = () => (
  <div className="header__right">
    <div className="header__action d-flex align-items-center">
      <div className="header__btn-wrap d-none d-sm-inline-flex">
        <Link to="/our-services" className="rr-btn">
          Make An Order
        </Link>
      </div>
      <div className="header__hamburger ml-20 d-lg-none">
        <div className="sidebar__toggle">
          <button className="bar-icon">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

Header.propTypes = {
  loggedInUser: PropTypes.object,
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.user,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { logout })(Header);
