import { useState } from "react";

export default function PythonTextCompiler() {
  const [code, setCode] = useState('print("Olá do Python!")');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:3001/run", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "Falha ao contactar servidor.", detail: String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "1rem auto", padding: 16 }}>
      <h2>Executar Python</h2>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        style={{ width: "100%", fontFamily: "monospace", resize: "vertical" }}
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={run} disabled={loading}>
          {loading ? "A executar..." : "▶ Executar"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 16 }}>
          {"error" in result ? (
            <>
              <h4 style={{ color: "crimson" }}>Erro</h4>
              <pre>{result.error}{result.detail ? `\n${result.detail}` : ""}</pre>
            </>
          ) : (
            <>
              <h4>Saída</h4>
              <pre>{result.stdout || result.stderr}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
