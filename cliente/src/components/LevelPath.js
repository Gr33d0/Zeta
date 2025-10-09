import { Container, Row, Col } from "react-bootstrap";
import LevelButton from "../components/LevelButton";
import { useEffect, useMemo, useState } from "react";

import "../css/LevelPath.css";

export default function LevelPath({ items = [] }) {
  // 1) name match + sensible default
  const [stars, setStars] = useState();
  const userId = 1; // adjust if you have real user IDs
  // 2) fetch stars once on mount (and expose a quick manual refresh if you want)

  function extractStars(data, userId) {
    if (Number.isFinite(data?.stars)) return data.stars;
    if (Array.isArray(data)) {
      const u = data.find((u) => String(u.id) === String(userId));
      if (u && Number.isFinite(u.stars)) return u.stars;
    }
    if (data && typeof data === "object") {
      const u = data[String(userId)] ?? data[userId];
      if (u && Number.isFinite(u.stars)) return u.stars;
    }
    return null;
  }

  const fetchStars = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/getDataUser/${userId}`
      );
      if (!res.ok) {
        console.error("HTTP", res.status, await res.text());
        return;
      }
      const data = await res.json();
      const val = extractStars(data, userId);
      if (Number.isFinite(val)) {
        setStars(val);
        localStorage.setItem("userStars", val);
        console.log("Stars do servidor:", val);
      } else {
        console.warn("Resposta sem 'stars' válido:", data);
      }
    } catch (err) {
      console.error("Erro ao obter dados do utilizador:", err);
    }
  };

  useEffect(() => {
    fetchStars();
  }, []);

  // layout constants
  const width = 420;
  const xPadding = 80;
  const stepY = 140;
  const nodeRadius = 34;
  const topOffset = 80;

  const leftX = xPadding;
  const rightX = width - xPadding;

  const height = useMemo(
    () => (Math.max(items.length, 1) - 1) * stepY + topOffset * 2,
    [items.length, stepY, topOffset]
  );

  // S-path
  const d = useMemo(() => {
    if (items.length < 2) return "";
    let path = "";
    for (let i = 0; i < items.length - 1; i++) {
      const y = topOffset + i * stepY;
      const nextY = y + stepY;

      const fromLeft = i % 2 === 0; // left, right, left...
      const x1 = fromLeft ? leftX : rightX;
      const x2 = fromLeft ? rightX : leftX;

      const midX = (x1 + x2) / 2;
      const midY = (y + nextY) / 2;

      path += `M ${x1} ${y} C ${x1} ${y}, ${midX} ${y}, ${midX} ${midY} S ${x2} ${nextY}, ${x2} ${nextY} `;
    }
    return path.trim();
  }, [items.length, leftX, rightX, stepY, topOffset]);

  return (
    <Container>
      <Row>
        <Col>
          <div className="level-path" style={{ width }}>
            {/* opcional: botão para atualizar stars manualmente
            <button className="btn btn-sm btn-outline-secondary" onClick={fetchStars}>
              Atualizar progresso ({stars}⭐)
            </button>
            */}
            <svg
              className="level-path__svg"
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="xMidYMin meet"
            >
              <path d={d} className="level-path__dash" />
            </svg>

            {items.map((it, i) => {
              const y = topOffset + i * stepY;
              const isLeft = i % 2 === 0;
              const x = (isLeft ? leftX : rightX) - nodeRadius;
              const yTop = y - nodeRadius;

              // 3) lock rule: locked if level > stars (adjust if your game logic differs)
              const levelNum = Number(it.level ?? i + 1);
              const locked = levelNum > stars;

              return (
                <div
                  key={levelNum}
                  className={`level-path__node ${isLeft ? "left" : "right"}`}
                  style={{ top: yTop, left: x }}
                >
                  <LevelButton level={levelNum} locked={locked} />
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
