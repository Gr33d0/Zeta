import "../css/hint.css";
import Logo from "../assets/image.png";
import { Col } from "react-bootstrap";

export default function Hint({ message }) {
  return (

      <Col className="mine ">
        <p className="message last">{message}</p>
       <img src={Logo} width={125} height={125}  alt="Logo" className="logo-image"/>
       
      </Col>

  );
}
