// Home.jsx
import cfg from "../data/level.json"; // o teu JSON
import { getChapters } from "../engine/levelEngine";
import { useProgress } from "../engine/useProgress";
import { Link } from "react-router-dom";

export default function Home() {
  const { progress } = useProgress(cfg);
  const chapters = getChapters(cfg);

  return (
    <div>
      {chapters.map(ch => (
        <section key={ch.id}>
          <h3>{ch.title} (precisa {ch.requiredStars || 0} ⭐)</h3>
          <ul>
            {ch.levels.map(lv => {
              const locked = !progress.unlocked?.has(lv.id);
              return (
                <li key={lv.id}>
                  {locked ? (
                    <span>🔒 {lv.title}</span>
                  ) : (
                    <Link to={`/level/${lv.id}`}>✅ {lv.title}</Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
