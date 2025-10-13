import { useParams } from "react-router-dom";
import Level1 from "./Level1";
import Level2 from "./Level2";

const MAP = { "1": Level1,"2": Level2 };

export default function LevelLoader() {
  const { level } = useParams();           // aqui virá "Level1"
  const normalized = (level || "").replace(/^Level/i, ""); // -> "1"
  const Component = MAP[normalized];

  if (!Component) return <p>Nível {level} não encontrado.</p>;
  return <Component />;
}
