// service/InterpreterService.js (ESM)
import { execFile } from "node:child_process";

export async function runPython(filePath) {
  return new Promise((resolve) => {
    // Use 'python' on Windows, 'python3' elsewhere
    const pythonCmd = process.platform === "win32" ? "python" : "python3";

    execFile(
      pythonCmd,
      ["-I", "-X", "utf8", filePath],
      { timeout: 5000, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        resolve({
          stdout: stdout?.toString() ?? "",
          stderr: stderr?.toString() ?? "",
          exitCode: typeof error?.code === "number" ? error.code : 0,
          timedOut: Boolean(error?.killed && error?.signal === "SIGTERM"),
        });
      }
    );
  });
}
