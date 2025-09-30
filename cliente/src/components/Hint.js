import "../css/Hint.css";
import Logo from '../assets/Logo.png';
import { Col, Row } from "react-bootstrap";

export default function Hint() {
  return (
    <Row className="align-items-center">
      <Col xs="auto">
        <div className="bubble bubble-left">
          Type any text here and the bubble will grow to fit the text no matter how
          many lines. Isn't that nifty?
        </div>
      </Col>
      <Col xs="auto">
        <img src={Logo} alt="Logo" width={125} height={125} className="ms-2" />
      </Col>
    </Row>
  );
}