import starIcon from "../assets/star-svgrepo-com.svg";
import Nav from "react-bootstrap/Nav";
import "../css/Star.css";



export default function Stars() {
  const stars = parseInt(localStorage.getItem("userStars") || "0");
  return (
    <Nav.Link disabled >
      <img src={starIcon} alt="Ícone de estrela" width={20} height={20} />
      <span className="star-text">{stars}</span>

    </Nav.Link>
  );
}
