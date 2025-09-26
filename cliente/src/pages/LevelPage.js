// LevelPage.jsx
import { useParams } from "react-router-dom";
import cfg from "../data/level.json"; // o JSON que mostraste (com "chapter")
import PythonInterpreter from "./PythonInterpreter";
import { useProgress } from "../engine/useProgress";
import { flattenLevels, getChapters } from "../engine/levelEngine";

function pickLevel(config, id) {
  const chapters = getChapters(config);
  for (const ch of chapters) {
    const found = ch.levels.find(l => l.id === id);
    if (found) return { level: found, chapter: ch };
  }
  return {};
}

// validadores simples baseados no "description" dos teus níveis
function validate(levelId, { code = "", result = {} }) {
  const c = (code || "").replace(/\s+/g, " ").toLowerCase();

  // helpers
  const has = (s) => c.includes(s.toLowerCase());

  switch (levelId) {
    case "L1": // imprimir "Olá mundo"
      return has("print(") && (has("olá mundo") || has("ola mundo")) ? 3 : (has("print(") ? 1 : 0);

    case "L2": // declarar x = 2
      return /\bx\s*=\s*2\b/.test(code) ? 3 : (/\b=\b/.test(code) ? 1 : 0);

    case "L3": // if x == 1 imprime Olá mundo
      {
        const condOk = /if\s+.*x\s*==?\s*1\s*:/.test(code);
        const printsHello = /print\s*\(\s*["']?ol[aá]\s+mundo["']?\s*\)/i.test(code);
        return condOk && printsHello ? 3 : (condOk || printsHello ? 1 : 0);
      }

    case "L4": // while imprime Olá mundo 5x (aceitamos while + print)
      {
        const hasWhile = /\bwhile\b/.test(code);
        const printsHello = /print\s*\(\s*["']?ol[aá]\s+mundo["']?\s*\)/i.test(code);
        return hasWhile && printsHello ? 3 : (hasWhile || printsHello ? 1 : 0);
      }

    default:
      // fallback: deu output? 1 estrela
      const out = (result?.stdout || "").trim();
      return out ? 1 : 0;
  }
}

export default function LevelPage() {
  const { levelId } = useParams();
  const { progress, saveResult } = useProgress(cfg);

  const { level } = pickLevel(cfg, levelId);
  if (!level) return <p>Nível não encontrado.</p>;
  // Se quiseres bloquear quando não desbloqueado, verifica progress.unlocked.has(levelId)

  const handleAfterRun = (mode, payload) => {
    const stars = validate(level.id, payload);
    if (stars > 0) {
      saveResult({ levelId: level.id, starsEarned: stars });
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <h2>{level.title}</h2>
      <p>{level.description}</p>
      <p><strong>Blocos permitidos:</strong> {level.blocos.join(", ")}</p>

      <PythonInterpreter
        allowedBlocks={level.blocos}
        defaultMode={level.blocos?.length ? "block" : "text"}
        onAfterRun={handleAfterRun}
      />

      <p style={{ opacity: 0.7, marginTop: 12 }}>
        Dica: clica em “Executar” para validar e ganhar ⭐ automaticamente.
      </p>
    </div>
  );
}
