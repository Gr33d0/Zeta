const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const { execFile } = require("child_process");
const os = require("os");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit: "200kb" })); // evita payloads enormes

// helper para executar um ficheiro .py com timeout e limites
function runPython(filePath) {
  return new Promise((resolve) => {
    // use 'python3' em Linux/Mac, 'python' no Windows
    const pythonCmd = process.platform === "win32" ? "python" : "python3";

    // -I = isolated mode (menos exposição a ambiente/site)
    const child = execFile(
      pythonCmd,
      ["-I", "-X", "utf8", filePath],
      { timeout: 5000, maxBuffer: 1024 * 1024 }, // 5s, 1MB buffer
      (error, stdout, stderr) => {
        resolve({
          stdout: stdout?.toString() ?? "",
          stderr: stderr?.toString() ?? "",
          exitCode: error && typeof error.code === "number" ? error.code : 0,
          timedOut: error && error.killed && error.signal === "SIGTERM",
        });
      }
    );
  });
}

app.post("/run", async (req, res) => {
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
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Python runner a ouvir em http://localhost:${PORT}`));
