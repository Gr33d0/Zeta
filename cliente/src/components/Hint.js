import "../css/Hint.css";
import Logo from '../assets/Logo.png';
import { Col, Row } from "react-bootstrap";

export default function Hint({message}) {
  return (
    <Row className="align-items-center">
      <Col xs="auto">
        <div className="bubble bubble-left">
          {message}
        </div>
      </Col>
      <Col xs="auto">
        <img src={Logo} alt="Logo" width={125} height={125} className="ms-2" />
      </Col>
    </Row>
  );
}