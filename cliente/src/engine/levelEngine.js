// Aceita config com raiz "chapter" (singular) ou "chapters" (plural)
export function getChapters(cfg) {
  return Array.isArray(cfg.chapters) ? cfg.chapters : (cfg.chapter || []);
}

export function flattenLevels(cfg) {
  const chapters = getChapters(cfg);
  const out = [];
  chapters.forEach(ch => {
    ch.levels.forEach((lv, i) => out.push({ ...lv, chapterId: ch.id, idxInChapter: i }));
  });
  return out;
}

export function firstLevelId(cfg) {
  const chapters = getChapters(cfg);
  return chapters?.[0]?.levels?.[0]?.id ?? null;
}

/**
 * Recalcula níveis desbloqueados.
 * Regras:
 * - Gate de capítulo: totalStars >= chapter.requiredStars (default 0)
 * - Dentro do capítulo: desbloqueio sequencial (precisa concluir o anterior)
 */
export function computeUnlocks(cfg, progress) {
  const chapters = getChapters(cfg);
  const totalStars = progress.totalStars || 0;
  const completed = progress.completed || {}; // { [levelId]: { stars } }
  const unlocked = new Set();

  // garante primeiro nível do primeiro capítulo se o gate permitir
  if (chapters.length) {
    const ch0 = chapters[0];
    const gate0 = (ch0.requiredStars || 0) <= totalStars;
    if (gate0 && ch0.levels?.[0]) unlocked.add(ch0.levels[0].id);
  }

  // por capítulo, sequência linear
  chapters.forEach(ch => {
    const chapterGate = (ch.requiredStars || 0) <= totalStars;
    if (!chapterGate) return;

    ch.levels.forEach((lv, idx) => {
      if (idx === 0) {
        unlocked.add(lv.id);
      } else {
        const prevId = ch.levels[idx - 1].id;
        if (completed[prevId]) unlocked.add(lv.id);
      }
    });
  });

  return unlocked;
}

/** Devolve próximo nível “jogável” pela ordem do JSON */
export function nextPlayable(cfg, progress) {
  const all = flattenLevels(cfg);
  for (const lv of all) {
    if (progress.unlocked.has(lv.id) && !progress.completed[lv.id]) return lv.id;
  }
  return null;
}
