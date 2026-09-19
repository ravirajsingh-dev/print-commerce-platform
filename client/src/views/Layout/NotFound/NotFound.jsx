import React from "react";
import { useNavigate } from "react-router-dom";
import NotFoundImg from "@assets/images/not-found.png";
import Header from "../Header/Header";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="not-found-container">
        <div className="content">
          <img
            src={NotFoundImg}
            alt="404 Not Found"
            className="not-found-image"
          />
          <h1>Oops! Page Not Found</h1>
          <p>
            The page you're looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <button
            onClick={() => navigate("/")}
            className="rr-btn btn-transparent  fadeInLeft animated rr-el-btn-1"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
