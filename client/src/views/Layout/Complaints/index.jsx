import React from "react";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import ComplaintForm from "./ComplaintForm";
import ComplaintsList from "./ComplaintsList";

const Complaints = () => {
  const [currentTab, setCurrentTab] = React.useState("details");
  const [modal, setModal] = React.useState(false);

  const onClickOnCall = () => {
    setCurrentTab("details");
    setModal(true);
  };
  return (
    <Container className="mt-4">
      <MobileInfo
        modal={modal}
        onNo={() => {
          setModal(false);
        }}
      />

      <Row className="text-center mb-4">
        <h2>REGISTER YOUR COMPLAINT</h2>
      </Row>
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={4} className="mb-3 d-flex justify-content-center">
          <Card style={{ textAlign: "center", border: "none" }}>
            <Card.Body>
              <Button
                className="rr-btn"
                variant="primary"
                size="lg"
                block
                onClick={() => setCurrentTab("form")}
              >
                REGISTER ONLINE
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4} className="mb-3 d-flex justify-content-center">
          <Card style={{ textAlign: "center", border: "none" }}>
            <Card.Body>
              <Button
                className="rr-btn"
                variant="primary"
                size="lg"
                block
                onClick={() => onClickOnCall()}
              >
                REGISTER ON CALL
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4} className="mb-3 d-flex justify-content-center">
          <Card style={{ textAlign: "center", border: "none" }}>
            <Card.Body>
              <Button
                className="rr-btn"
                variant="primary"
                size="lg"
                onClick={() => setCurrentTab("list")}
                block
              >
                COMPLAINT STATUS
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {currentTab === "details" ? (
        <>
          <Row className="mb-4">
            <Col>
              <h5>नोट :-</h5>
              <ol style={{ color: "red" }}>
                <li>
                  हिंदी टाइपिंग की सुविधा व मोबाइल से खींची फोटो को अटैच करने के
                  लिए आप इस वेब पेज को मोबाइल पर ओपन करें !
                </li>
                <li>
                  कलर वेरिएशन/पहले से छपे ऑर्डर के समान कलर/कंप्यूटर स्क्रीन के
                  समान कलर नहीं आने की कम्प्लेंट नहीं ली जाएगी !
                </li>
                <li>
                  ऑर्डर की डिस्पैच डेट से 15 दिन के भीतर की गई शिकायत ही स्वीकार
                  की जाएगी। इसके बाद कोई भी कम्प्लेंट दर्ज नहीं की जाएगी।
                </li>
                <li>
                  ऑर्डर में कंपनी की मिस्टेक सिद्ध होने पर Reprint किया जायेगा,
                  Refund नहीं किया जायेगा एवं रिफंड करने की आवश्यकता पड़ने पर भी
                  अधिकतम 50% ही रिफंड किया जा सकता है !
                </li>
                <li>
                  कूरियर या ट्रांसपोर्ट कंपनी के द्वारा हुए सामान में नुक्सान की
                  जिम्मेदारी श्री एडवरटाइजिंग की नहीं होगी!
                </li>
              </ol>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <h5>Notes :-</h5>
              <ol style={{ color: "red" }}>
                <li>
                  Complaints regarding Color Variations/ Similar Color needed as
                  in Previous Printing/ Color not same as on computer screen
                  will not be entertained.
                </li>
                <li>
                  Complaints will only be accepted within 15 days from the order
                  dispatch date. No complaints will be registered after that.
                </li>
                <li>
                  If Company mistake is proven in an Order, it will only be
                  Reprint, in case if Refund is needed only up to{" "}
                  <strong>maximum of 50%</strong> can be refunded.
                </li>
                <li>
                  Printers Club of India Ltd. will not be responsible for any
                  kind of losses because of Courier or Transportation.
                </li>
              </ol>
            </Col>
          </Row>

          <Row className="text-white text-center p-3">
            <Col>
              <p style={{ margin: 0, color: "red" }}>
                If you are not satisfied with any solution or you are facing a
                serious issue, you can reach out to the company's Director via
                E-Mail -
                <br />
                <strong>support@example.com</strong>
              </p>
            </Col>
          </Row>
        </>
      ) : currentTab === "form" ? (
        <ComplaintForm />
      ) : currentTab === "list" ? (
        <ComplaintsList />
      ) : null}
    </Container>
  );
};

const MobileInfo = ({ modal, onNo }) => {
  return (
    <Modal show={modal} onHide={onNo}>
      <Modal.Header closeButton className="modal-header">
        REGISTER ON CALL
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <p>To register your complaint via call Please.</p>

          <h4 className="text-danger">Dial +91 9999999999</h4>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default Complaints;
