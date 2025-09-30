import { Container, Row, Col } from "react-bootstrap";
import LevelButton from "../components/LevelButton";
import { useMemo } from "react";
import "../css/LevelPath.css";
export default function LevelPath({ items }) {
  // layout constants (ajusta à vontade)
  const width = 420;          // largura da área do caminho
  const xPadding = 80;        // afastamento da borda
  const stepY = 140;          // distância vertical entre níveis
  const nodeRadius = 34;      // metade do botão (para centrar)
  const topOffset = 80;       // margem superior

  const leftX = xPadding;
  const rightX = width - xPadding;

  // altura total do SVG
  const height = useMemo(
    () => (items.length - 1) * stepY + topOffset * 2,
    [items.length]
  );

  // Calcula o path em “S” ligando os centros dos botões
  const d = useMemo(() => {
    if (items.length < 2) return "";
    let path = "";
    for (let i = 0; i < items.length - 1; i++) {
      const y = topOffset + i * stepY;
      const nextY = y + stepY;

      const fromLeft = i % 2 === 0; // começa à esquerda, depois direita, etc.
      const x1 = fromLeft ? leftX : rightX;
      const x2 = fromLeft ? rightX : leftX;

      // Control points para uma curva suave estilo “S”
      const midX = (x1 + x2) / 2;
      const midY = (y + nextY) / 2;

      // Começa em cada segmento no ponto atual
      path += `M ${x1} ${y} C ${x1} ${y}, ${midX} ${y}, ${midX} ${midY} S ${x2} ${nextY}, ${x2} ${nextY} `;
    }
    return path.trim();
  }, [items.length]);

  return (
    <Container>
      <Row>
        <Col>
          <div className="level-path" style={{ width }}>
            {/* SVG do tracejado */}
            <svg
              className="level-path__svg"
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="xMidYMin meet"
            >
              <path d={d} className="level-path__dash" />
            </svg>

            {/* Botões alternando esquerda/direita */}
            {items.map((it, i) => {
              const y = topOffset + i * stepY;
              const isLeft = i % 2 === 0;
              const x = (isLeft ? leftX : rightX) - nodeRadius; // centra botão
              const yTop = y - nodeRadius;

              return (
                <div
                  key={it.level ?? i}
                  className={`level-path__node ${isLeft ? "left" : "right"}`}
                  style={{ top: yTop, left: x }}
                >
                  <LevelButton level={it.level} />
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

// Exemplo de uso:
// <LevelPath items={[{level:1},{level:2},{level:3},{level:4},{level:5}]}/>
