import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import toArrayStore, { readJson } from "../service/dataUserService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keep a single, consistent data file
const DATA_FILE = path.join(__dirname, "../dataUser.json");




export async function getDataUser(req, res){
  try {
    const id = req.params.id;
    const dadosRaw = await readJson(DATA_FILE, []);
    const dados = toArrayStore(dadosRaw);

    const user = dados.find((u) => String(u.id) === id);
    const stars = Number.isFinite(user?.stars) ? user.stars : null;

    if (!Number.isFinite(stars)) {
      return res.status(404).json({ error: `Utilizador ${id} sem 'stars'` });
    }
    return res.json({ stars });
  } catch (error) {
    return res.status(500).json({
      error: "Falha ao ler dados do utilizador.",
      detail: String(error),
    });
  }
}

export async function updateDataUser(req, res){
  try {
    const id = String(req.params.id);
    const newData = (req.body && typeof req.body === "object") ? req.body : {};

    console.log("PATCH /updateDataUser/:id", req.params.id, req.body);

    const dadosRaw = await readJson(DATA_FILE, []);
    const dados = toArrayStore(dadosRaw);

    let user = dados.find((u) => String(u.id) === id);
    let statusCode = 200;

    if (user) {
      // increment stars safely
      const currentStars = Number(user.stars ?? 0);
      const updated = { ...user, ...newData };
      // ensure stars cannot be overridden by client
      updated.stars = Number.isFinite(currentStars) ? currentStars + 1 : 1;
      user = Object.assign(user, updated);
    } else {
      statusCode = 201;
      const base = { id, stars: 1 };
      // ignore client-provided stars on create; merge the rest
      const { stars: _ignore, ...rest } = newData || {};
      user = { ...base, ...rest };
      dados.push(user);
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(dados, null, 2), "utf8");

    return res.status(statusCode).json({
      message: statusCode === 201 ? "Utilizador criado e atualizado." : "Utilizador atualizado.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Falha ao atualizar dados do utilizador.",
      detail: String(error),
    });
  }
}
