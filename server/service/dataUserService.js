import { promises as fs } from "fs";

// Small helper: read JSON safely
export async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export default function toArrayStore(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    // convert object map {id: {...}} to array
    return Object.entries(data).map(([id, v]) => ({ id, ...v }));
  }
  return [];
}
