// src/pages/Home.jsx
import { Container } from "react-bootstrap";
import LevelPath from "../components/LevelPath";

export default function Home() {
  // lista de níveis a mostrar no “S”
  const levels = [
    { level: 1 },
    { level: 2 },
    { level: 3 },
    { level: 4 },
    { level: 5 },
  ];

  return (
    <Container style={{ paddingTop: 24, paddingBottom: 24 }}>
      <h2 className="mb-3">Níveis</h2>
      <p style={{ opacity: 0.75, marginBottom: 12 }}>
        Clica num nível para abrir a página correspondente.
      </p>

      {/* O LevelPath desenha o percurso em “S” e usa <LevelButton /> por nível */}
      <LevelPath items={levels} />
    </Container>
  );
}
