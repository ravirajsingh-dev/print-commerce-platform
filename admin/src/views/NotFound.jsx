import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { RiEmotionUnhappyFill, RiReplyLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-dark-new.png";

const NotFound = () => {
  return (
    <>
      <div className="auth-fluid">
        <div className="auth-fluid-form-box">
          <Row className="align-items-center d-flex h-100">
            <div className="auth-brand text-center text-lg-start">
              <Link to="/">
                <span>
                  <img src={logo} alt="" height="40" />
                </span>
              </Link>
            </div>
            <Col lg="12">
              <Card>
                <Card.Body className="p-4">
                  <Card.Body className="text-center">
                    <h1 className="text-error">
                      4
                      <span>
                        <RiEmotionUnhappyFill />
                      </span>
                      4
                    </h1>
                    <h4 className="text-uppercase text-danger mt-3">
                      Page Not Found
                    </h4>
                    <Card.Text className="text-muted mt-3">
                      It's looking like you may have taken a wrong turn. Don't
                      worry... it happens to the best of us. Here's a little tip
                      that might help you get back on track.
                    </Card.Text>

                    <Card.Body>
                      <Button variant="info">
                        <Link
                          to="/"
                          style={{
                            color: "white",
                            textDecoration: "inherit",
                          }}
                        >
                          <span>
                            <RiReplyLine className="m-2" />
                          </span>
                          Return Home
                        </Link>
                      </Button>
                    </Card.Body>
                  </Card.Body>
                </Card.Body>
              </Card>
            </Col>
            <footer className="text-center">2024 © 2BrushStrokes</footer>
          </Row>
        </div>
      </div>
    </>
  );
};

export default NotFound;
