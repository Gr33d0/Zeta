import { useEffect, useState, useMemo } from "react";
import { computeUnlocks } from "./levelEngine";

const KEY = "levelProgress_v1";

function revive(raw) {
  if (!raw) return { completed: {}, totalStars: 0, unlocked: new Set() };
  return { ...raw, unlocked: new Set(raw.unlocked || []) };
}

export function useProgress(config) {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(KEY);
    return revive(saved ? JSON.parse(saved) : null);
  });

  // recalcular unlocks ao montar/alterar config ou progresso
  useEffect(() => {
    const unlocked = computeUnlocks(config, progress);
    if (unlocked.size !== progress.unlocked.size) {
      setProgress(p => {
        const np = { ...p, unlocked };
        localStorage.setItem(KEY, JSON.stringify({ ...np, unlocked: [...unlocked] }));
        return np;
      });
    }
    // eslint-disable-next-line
  }, [config, progress.totalStars, progress.completed]);

  const saveResult = ({ levelId, starsEarned }) => {
    setProgress(p => {
      const prev = p.completed[levelId]?.stars || 0;
      const best = Math.max(prev, starsEarned || 0);
      const completed = { ...p.completed, [levelId]: { stars: best } };
      const totalStars = Object.values(completed).reduce((s, r) => s + (r.stars || 0), 0);
      const updated = { ...p, completed, totalStars };
      updated.unlocked = computeUnlocks(config, updated);
      localStorage.setItem(KEY, JSON.stringify({ ...updated, unlocked: [...updated.unlocked] }));
      return updated;
    });
  };

  const resetProgress = () => {
    const cleared = { completed: {}, totalStars: 0, unlocked: new Set() };
    localStorage.removeItem(KEY);
    setProgress(cleared);
  };

  return {
    progress,
    saveResult,
    resetProgress,
    allUnlocked: useMemo(() => progress.unlocked, [progress.unlocked]),
  };
}
