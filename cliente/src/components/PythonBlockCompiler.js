import CommandBlock from "./CommandBlock";
import { useState, useRef } from "react";
import Col from "react-bootstrap/Col";

export default function PythonBlockCompiler() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropRef = useRef(null);

  // Drag & Drop
   function onDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const node = document.getElementById(id);
    if (!node || !dropRef.current) return;

    // cria cópia
    const clone = node.cloneNode(true);
    clone.id = id + "-" + Date.now(); // id único
    clone.draggable = false; // já está fixo na área de drop

    dropRef.current.append(clone); // sempre no fim
  }


  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  // Executar
  async function run(codeStr) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:3001/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeStr }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "Falha ao contactar servidor.", detail: String(e) });
    } finally {
      setLoading(false);
    }
  }

  function gerarCodigo() {
    const container = dropRef.current;
    if (!container) return;

    const els = container.querySelectorAll(".commandBlock");
    const linhas = Array.from(els).map((el) => el.getAttribute("data-code") ?? el.textContent ?? "");
    const codeStr = linhas.join("\n");
    setCode(codeStr);
    run(codeStr);
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Palete de exemplo (podes adicionar mais) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <CommandBlock command="a=2" />
        <CommandBlock command="b=1" />
        <CommandBlock command="print(a+b)" />
      </div>

      <Col>
        <h4>coloca aqui os blocos</h4>
        <div
          id="div1"
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={{
            minHeight: 120,
            border: "1px dashed #aaa",
            padding: 8,
            borderRadius: 8,
            // empilhar verticalmente:
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
          }}
        />
      </Col>

      <button onClick={gerarCodigo} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "A executar..." : "▶ Executar"}
      </button>

      {code && (
        <div style={{ marginTop: 12 }}>
          <h4>Código</h4>
          <pre>{code}</pre>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          {"error" in result ? (
            <>
              <h4 style={{ color: "crimson" }}>Erro</h4>
              <pre>
                {result.error}
                {result.detail ? `\n${result.detail}` : ""}
              </pre>
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
