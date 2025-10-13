import { useState } from "react";
import ExecuteButton from "./ExecuteButton";
import ExecutionResult from "./ExecutionResult";
export default function PythonTextCompiler({ level, expectedResult,id }) {
  const [code, setCode] = useState('print("Olá do Python!")');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:3001/api/run", {
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
        style={{ width: "100%", fontFamily: "monospace", resize: "none" }}
      />
      <div style={{ marginTop: 8 }}>
        <ExecuteButton onClick={run} loading={loading} />
      </div>

      <ExecutionResult level={level} result={result} id={id} data={expectedResult} />


    </div>
  );
}
