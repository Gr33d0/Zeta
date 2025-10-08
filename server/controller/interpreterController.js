import { runPython } from "../service/InterpreterService.js";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

export async function executePythonCode(req, res) {
  
  try {
    const code = String(req.body?.code ?? "");

    if (!code.trim()) {
      return res.status(400).json({ error: "Nenhum código enviado." });
    }
    if (code.length > 50_000) {
      return res.status(413).json({ error: "Código demasiado grande." });
    }

    // cria ficheiro temporário .py
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, `snippet_${Date.now()}.py`);
    await fs.writeFile(filePath, code, { encoding: "utf8" });

    // executa
    const result = await runPython(filePath);

    // apaga o ficheiro
    await fs.unlink(filePath).catch(() => {});

    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: "Falha ao executar código.", detail: String(e) });
  }
};