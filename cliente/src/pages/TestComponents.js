import { Container, Row } from "react-bootstrap";
import LevelPath from "../components/LevelPath";

export default function TestComponents() {
  const array = [
    { level: 4 },
    { level: 3 },
    { level: 2 },
    { level: 1 }
  ];

  return (
    <Container>
      <Row>
        <LevelPath items={array} />
      </Row>
    </Container>
  );
}
